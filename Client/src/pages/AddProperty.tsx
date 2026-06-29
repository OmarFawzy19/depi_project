import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { Upload, MapPin, Loader2, Navigation, Trash2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PropertyMap } from "@/components/PropertyMap";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { propertyService } from "@/services/propertyService";

type PropertyType =
  | "apartment"
  | "villa"
  | "studio"
  | "penthouse"
  | "house"
  | "loft";

type PriceType = "rent" | "sale";

type FormState = {
  title: string;
  type: PropertyType;
  price: string;
  priceType: PriceType;
  bedrooms: string;
  bathrooms: string;
  area: string;
  location: string;
  description: string;
};

const AddProperty = () => {
  const [point, setPoint] = useState<{ lat: number; lng: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const [formData, setFormData] = useState<FormState>({
    title: "",
    type: "apartment",
    price: "",
    priceType: "rent",
    bedrooms: "",
    bathrooms: "",
    area: "",
    location: "",
    description: "",
  });

  const { toast } = useToast();
  const navigate = useNavigate();
  const [geoLoading, setGeoLoading] = useState(false);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location detection.",
        variant: "destructive",
      });
      return;
    }

    setGeoLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Set map pin
        setPoint({ lat: latitude, lng: longitude });

        // Reverse geocode to fill location field
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`,
          );
          const data = await res.json();

          if (data?.address) {
            const addr = data.address;
            const locationName = [
              addr.suburb || addr.neighbourhood || addr.district || "",
              addr.city || addr.town || addr.state || "",
              addr.country || "",
            ]
              .filter(Boolean)
              .join(", ");

            if (locationName) {
              setFormData((prev) => ({ ...prev, location: locationName }));
            }
          }
        } catch {
          // Reverse geocoding failed — not critical, pin is still set
        }

        toast({
          title: "Location detected ✅",
          description: `Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        });

        setGeoLoading(false);
      },
      (error) => {
        setGeoLoading(false);
        let msg = "Could not get your location.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Please allow location access in your browser settings.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          msg = "Location request timed out. Try again.";
        }
        toast({
          title: "Location error",
          description: msg,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const removeSelectedImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    if (files.length > 10) {
      toast({
        title: "Too many images",
        description: "Maximum 10 images allowed.",
        variant: "destructive",
      });
      return;
    }

    const oversized = files.find((file) => file.size > 5 * 1024 * 1024);

    if (oversized) {
      toast({
        title: "Image too large",
        description: "Each image must be less than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setImages((prev) => [...prev, ...files].slice(0, 10));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.title.trim().length < 5) {
      toast({
        title: "Invalid title",
        description: "Title must be at least 5 characters.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price.",
        variant: "destructive",
      });
      return;
    }

    if (formData.location.trim().length < 3) {
      toast({
        title: "Invalid location",
        description: "Please enter a valid location.",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "Images required",
        description: "Please upload at least one image.",
        variant: "destructive",
      });
      return;
    }

    if (!point) {
      toast({
        title: "Pick a location on the map",
        variant: "destructive",
      });
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast({
        title: "Not logged in",
        description: "Please log in and try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);

      const uploadedImages: string[] = [];

      for (const image of images) {
        const imageFormData = new FormData();
        imageFormData.append("file", image);
        imageFormData.append("upload_preset", "makany_unsigned");

        const uploadResponse = await fetch(
          "https://api.cloudinary.com/v1_1/dj1gq6vlo/image/upload",
          {
            method: "POST",
            body: imageFormData,
          },
        );

        const uploadData = await uploadResponse.json();

        if (uploadData.secure_url) {
          uploadedImages.push(uploadData.secure_url);
        }
      }

      if (uploadedImages.length === 0) {
        toast({
          title: "Image upload failed",
          description: "Please try uploading the images again.",
          variant: "destructive",
        });
        return;
      }

      await propertyService.create({
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        price: Number(formData.price),
        priceType: formData.priceType,
        bedrooms: Number(formData.bedrooms || 0),
        bathrooms: Number(formData.bathrooms || 0),
        area: Number(formData.area || 0),
        location: formData.location.trim(),
        lat: point.lat,
        lng: point.lng,
        images: uploadedImages,
        features: [],
      });

      toast({
        title: "Listing submitted ✅",
        description: "Your property is now under review.",
      });

      navigate("/my-properties");
    } catch (err: unknown) {
      const status =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "status" in err.response
          ? (err.response as { status: number }).status
          : null;

      if (status === 401) {
        toast({
          title: "Session expired",
          description: "Please log out and log back in, then try again.",
          variant: "destructive",
        });
      } else if (status === 403) {
        toast({
          title: "Not authorised",
          description: "You don't have permission to add properties.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to submit property",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />

      <div className="container mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            For owners
          </p>

          <h1 className="font-heading text-3xl font-bold">
            List your property
          </h1>

          <p className="text-muted-foreground">
            Reach buyers and renters near your location.
          </p>
        </div>

        <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl bg-card p-6 shadow-card">
              <h2 className="mb-4 font-heading text-lg font-semibold">
                Photos
              </h2>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/40 p-10 text-center transition hover:bg-muted">
                <Upload className="mb-2 h-8 w-8 text-primary" />

                <p className="font-semibold">Click to upload images</p>

                <p className="text-xs text-muted-foreground">
                  PNG, JPG up to 5MB - Maximum 10 images
                </p>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImagesChange}
                />
              </label>

              {images.length > 0 && (
                <div className="mt-4">
                  <p className="mb-3 text-sm text-muted-foreground">
                    {images.length} image(s) selected
                  </p>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {images.map((image, index) => (
                      <div
                        key={`${image.name}-${index}`}
                        className="relative overflow-hidden rounded-lg"
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`preview-${index}`}
                          className="h-24 w-full rounded-lg border object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removeSelectedImage(index)}
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white shadow-md hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-card p-6 shadow-card">
              <h2 className="mb-4 font-heading text-lg font-semibold">
                Details
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Title">
                  <input
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="Modern City Apartment"
                  />
                </Field>

                <Field label="Type">
                  <select
                    name="type"
                    className={inputCls}
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="studio">Studio</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="house">House</option>
                    <option value="loft">Loft</option>
                  </select>
                </Field>

                <Field label="Price (USD)">
                  <input
                    required
                    name="price"
                    type="number"
                    min={1}
                    value={formData.price}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="2500"
                  />
                </Field>

                <Field label="Listing">
                  <select
                    name="priceType"
                    className={inputCls}
                    value={formData.priceType}
                    onChange={handleChange}
                  >
                    <option value="rent">For rent</option>
                    <option value="sale">For sale</option>
                  </select>
                </Field>

                <Field label="Bedrooms">
                  <input
                    name="bedrooms"
                    type="number"
                    min={0}
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="2"
                  />
                </Field>

                <Field label="Bathrooms">
                  <input
                    name="bathrooms"
                    type="number"
                    min={0}
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="2"
                  />
                </Field>

                <Field label="Area (m²)" full>
                  <input
                    name="area"
                    type="number"
                    min={0}
                    value={formData.area}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="120"
                  />
                </Field>

                <Field label="Location" full>
                  <input
                    required
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="Cairo, Egypt"
                  />
                </Field>

                <Field label="Description" full>
                  <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="Bright apartment with city views…"
                  />
                </Field>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-card p-6 shadow-card">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold">
                  Pin location
                </h2>

                <button
                  type="button"
                  onClick={useMyLocation}
                  disabled={geoLoading}
                  className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-all duration-200 hover:bg-primary/10 hover:border-primary/50 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {geoLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Navigation className="h-3.5 w-3.5" />
                  )}
                  {geoLoading ? "Detecting..." : "Use My Location"}
                </button>
              </div>

              <p className="mb-3 text-xs text-muted-foreground">
                Click on the map or use your current location to pin your
                property.
              </p>

              <PropertyMap
                properties={[]}
                selectable
                onSelect={(lat, lng) => setPoint({ lat, lng })}
                selectedPoint={point}
                userLocation={point}
                height="320px"
              />

              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />

                {point
                  ? `${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`
                  : "No location selected"}
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full gap-2"
              disabled={submitting}
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Submitting..." : "Submit listing"}
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">
        {label}
      </label>

      {children}
    </div>
  );
}

export default AddProperty;

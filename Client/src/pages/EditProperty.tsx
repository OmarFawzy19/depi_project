import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import axiosClient from "@/lib/axiosClient";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import { propertyService } from "@/services/propertyService";
import { useToast } from "@/hooks/use-toast";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    location: "",
  });

  useEffect(() => {
    if (!id) return;

    propertyService.getById(id).then((property) => {
      if (!property) {
        navigate("/my-properties");
        return;
      }

      if (property.status !== "paused") {
        toast({
          title: "You must pause this property before editing it.",
          variant: "destructive",
        });
        navigate("/my-properties");
        return;
      }

      setFormData({
        title: property.title,
        description: property.description,
        price: String(property.price),
        bedrooms: String(property.bedrooms),
        bathrooms: String(property.bathrooms),
        area: String(property.area),
        location: property.location,
      });

      setCurrentImages(
        property.images?.filter((img) => img && img !== "/placeholder.svg") ||
          [],
      );

      setLoading(false);
    });
  }, [id, navigate, toast]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    if (files.length > 10) {
      toast({
        title: "Too many images",
        description: "You can add maximum 10 pictures at once.",
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

    setNewImages(files);
  };

  const removeCurrentImage = (imageUrl: string) => {
    setCurrentImages((prev) => prev.filter((img) => img !== imageUrl));
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!id) return;

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

    if (currentImages.length === 0 && newImages.length === 0) {
      toast({
        title: "Images required",
        description: "Please keep or add at least one picture.",
        variant: "destructive",
      });
      return;
    }

    setConfirmOpen(true);
  };

  const confirmSubmit = async () => {
    if (!id) return;

    setConfirmOpen(false);

    try {
      setSaving(true);

      const updatedImages = [...currentImages];

      for (const image of newImages) {
        const imageFormData = new FormData();
        imageFormData.append("image", image);

        const uploadResponse = await axiosClient.post("/upload", imageFormData);

        if (uploadResponse.data.imageUrl) {
          updatedImages.push(uploadResponse.data.imageUrl);
        }
      }

      await propertyService.update(id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms || 0),
        bathrooms: Number(formData.bathrooms || 0),
        area: Number(formData.area || 0),
        location: formData.location.trim(),
        images: updatedImages,
      });

      toast({
        title: "Property updated successfully",
        description: "Sent for admin approval.",
        variant: "success",
      });

      navigate("/my-properties");
    } catch (err) {
      console.error(err);

      toast({
        title: "Failed to update property",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-10">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-3xl px-4 py-10">
        <h1 className="mb-6 font-heading text-3xl font-bold">Edit Property</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl bg-card p-6 shadow-card"
        >
          {currentImages.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                Current Property Pictures
              </p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {currentImages.map((image) => (
                  <div
                    key={image}
                    className="relative overflow-hidden rounded-xl"
                  >
                    <img
                      src={image}
                      alt="Property"
                      className="h-32 w-full rounded-xl object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeCurrentImage(image)}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700"
                      title="Delete image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Add More Property Pictures
            </p>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className={inputCls}
            />
          </div>

          {newImages.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                New Pictures Preview
              </p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {newImages.map((image, index) => (
                  <div
                    key={`${image.name}-${index}`}
                    className="relative overflow-hidden rounded-xl"
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`New preview ${index + 1}`}
                      className="h-32 w-full rounded-xl object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700"
                      title="Delete new image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Property Title
            </label>

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={inputCls}
              placeholder="Enter property title"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Price</label>

            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className={inputCls}
              placeholder="Enter property price"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Bedrooms</label>

            <input
              name="bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={handleChange}
              className={inputCls}
              placeholder="Number of bedrooms"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Bathrooms</label>

            <input
              name="bathrooms"
              type="number"
              value={formData.bathrooms}
              onChange={handleChange}
              className={inputCls}
              placeholder="Number of bathrooms"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Area (m²)</label>

            <input
              name="area"
              type="number"
              value={formData.area}
              onChange={handleChange}
              className={inputCls}
              placeholder="Property area"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Location</label>

            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={inputCls}
              placeholder="Location"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={inputCls}
              placeholder="Property description"
            />
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>

      <Footer />

      <Modal
        show={confirmOpen}
        title="Confirm Update"
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmSubmit}
        confirmText="Save Changes"
      >
        <p className="text-sm text-muted-foreground">
          After saving changes, this property status will return to Pending and
          will need admin approval again. Do you want to continue?
        </p>
      </Modal>
    </div>
  );
};

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export default EditProperty;

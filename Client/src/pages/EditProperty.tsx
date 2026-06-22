import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { propertyService } from "@/services/propertyService";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [newImage, setNewImage] = useState<File | null>(null);

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
        alert("You must pause this property before editing it.");
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

      setCurrentImages(property.images || []);
      setLoading(false);
    });
  }, [id, navigate]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setNewImage(e.target.files[0]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!id) return;

    const confirmUpdate = window.confirm(
      "After saving changes, this property status will return to Pending and will need admin approval again. Do you want to continue?",
    );

    if (!confirmUpdate) return;

    try {
      setSaving(true);

      let updatedImages = currentImages;

      if (newImage) {
        const imageFormData = new FormData();
        imageFormData.append("image", newImage);

        const uploadResponse = await axios.post(
          "http://localhost:5000/api/upload",
          imageFormData,
        );

        updatedImages = [uploadResponse.data.imageUrl];
      }

      await propertyService.update(id, {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        location: formData.location,
        images: updatedImages,
      });

      alert("Property updated successfully and sent for admin approval.");

      navigate("/my-properties");
    } catch {
      alert("Failed to update property");
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

  const previewImage = newImage
    ? URL.createObjectURL(newImage)
    : currentImages?.[0] && currentImages[0] !== "/placeholder.svg"
      ? currentImages[0]
      : "";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-3xl px-4 py-10">
        <h1 className="mb-6 font-heading text-3xl font-bold">Edit Property</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl bg-card p-6 shadow-card"
        >
          {previewImage && (
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                Current Image
              </p>

              <img
                src={previewImage}
                alt="Property"
                className="h-56 w-full rounded-xl object-cover"
              />
            </div>
          )}

          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Change Image
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={inputCls}
            />
          </div>

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={inputCls}
            placeholder="Title"
            required
          />

          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            className={inputCls}
            placeholder="Price"
            required
          />

          <input
            name="bedrooms"
            type="number"
            value={formData.bedrooms}
            onChange={handleChange}
            className={inputCls}
            placeholder="Bedrooms"
          />

          <input
            name="bathrooms"
            type="number"
            value={formData.bathrooms}
            onChange={handleChange}
            className={inputCls}
            placeholder="Bathrooms"
          />

          <input
            name="area"
            type="number"
            value={formData.area}
            onChange={handleChange}
            className={inputCls}
            placeholder="Area"
          />

          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={inputCls}
            placeholder="Location"
            required
          />

          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className={inputCls}
            placeholder="Description"
          />

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export default EditProperty;

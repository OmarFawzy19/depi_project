import { useEffect, useState } from "react";
import { Heart, Loader2, Trash2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import axiosClient from "@/lib/axiosClient";
import { PropertyCard } from "@/components/PropertyCard";
import type { ApiProperty, Property } from "@/services/propertyService";
import { removeFavorite } from "@/services/favoritesService";

interface FavoriteItem {
  _id: string;
  property: ApiProperty;
}

function normalize(p: ApiProperty): Property {
  return {
    id: p._id,
    title: p.title,
    description: p.description,
    price: p.price,
    priceType: p.priceType,
    type: p.type,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    area: p.area,
    location: p.location,
    lat: p.latitude,
    lng: p.longitude,
    images: p.images?.length > 0 ? p.images : ["/placeholder.svg"],
    features: p.features ?? [],
    status: p.status,
    owner: {
      id: p.owner?._id ?? "",
      name: p.owner?.name ?? "Unknown",
      avatar: "",
      phone: "",
    },
    isFeatured: true,
    createdAt: p.createdAt,
    distance: p.distance,
  };
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const loadFavorites = () => {
    setLoading(true);

    axiosClient
      .get<FavoriteItem[]>("/favorites")
      .then((res) => {
        const properties = res.data
          .filter((item) => item.property)
          .map((item) => normalize(item.property));

        setFavorites(properties);
      })
      .catch(() => {
        setFavorites([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemove = async (id: string) => {
    try {
      setRemovingId(id);

      await removeFavorite(id);

      setFavorites((prev) => prev.filter((property) => property.id !== id));
    } catch {
      alert("Failed to remove from favorites");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-2 font-heading text-3xl font-bold">Favorites</h1>
        <p className="mb-8 text-muted-foreground">Your saved properties</p>

        {loading ? (
          <div className="flex h-80 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex h-80 flex-col items-center justify-center rounded-2xl bg-card shadow-card">
            <Heart className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-1 text-lg font-semibold">
              No saved properties yet
            </p>
            <p className="mb-4 text-sm text-muted-foreground">
              Start browsing and save properties you like
            </p>
            <Link to="/properties">
              <Button>Browse Properties</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((property, index) => (
              <div key={property.id} className="space-y-3">
                <PropertyCard property={property} index={index} />

                <Button
                  variant="destructive"
                  className="w-full gap-2"
                  disabled={removingId === property.id}
                  onClick={() => handleRemove(property.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  {removingId === property.id
                    ? "Removing..."
                    : "Remove from Favorites"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Favorites;

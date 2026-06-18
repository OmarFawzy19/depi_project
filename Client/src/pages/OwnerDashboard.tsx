import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Home,
  Eye,
  MessageSquare,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Edit,
  Trash2,
  Pause,
  Play,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { propertyService, type Property } from "@/services/propertyService";

const fallbackImage =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop";

const getStatusClass = (status: string) => {
  if (status === "approved") return "bg-green-500 text-white";
  if (status === "pending") return "bg-yellow-500 text-white";
  if (status === "paused") return "bg-gray-500 text-white";

  return "";
};

const OwnerDashboard = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pausingId, setPausingId] = useState<string | null>(null);

  const loadProperties = () => {
    setLoading(true);

    propertyService
      .listMine()
      .then((data) => {
        setProperties(data);
      })
      .catch(() => {
        setProperties([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?",
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      await propertyService.remove(id);

      setProperties((prev) => prev.filter((property) => property.id !== id));
    } catch {
      alert("Failed to delete property");
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePause = async (id: string) => {
    try {
      setPausingId(id);

      const updatedProperty = await propertyService.togglePause(id);

      setProperties((prev) =>
        prev.map((property) =>
          property.id === id ? updatedProperty : property,
        ),
      );
    } catch {
      alert("Failed to update property status");
    } finally {
      setPausingId(null);
    }
  };

  const stats = [
    { icon: Home, label: "My listings", value: properties.length },
    { icon: Eye, label: "Total views", value: "1,284" },
    { icon: MessageSquare, label: "Inquiries", value: 12 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-3xl font-bold">Owner Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your listings and inquiries
            </p>
          </div>

          <Link to="/add-property">
            <Button>
              <Plus className="h-4 w-4" /> Add Property
            </Button>
          </Link>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {s.label}
                </CardTitle>
                <s.icon className="h-4 w-4 text-primary" />
              </CardHeader>

              <CardContent>
                <div className="text-3xl font-bold text-gradient">
                  {s.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="mb-4 font-heading text-xl font-bold">My listings</h2>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : properties.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border bg-card text-muted-foreground">
            You haven't listed any properties yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => {
              const propertyImage =
                property.images?.[0] &&
                property.images[0] !== "/placeholder.svg"
                  ? property.images[0]
                  : fallbackImage;

              const isPaused = property.status === "paused";

              return (
                <Card
                  key={property.id}
                  className={`overflow-hidden ${isPaused ? "opacity-70" : ""}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={propertyImage}
                      alt={property.title}
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute left-3 top-3">
                      <Badge>
                        For {property.priceType === "rent" ? "Rent" : "Sale"}
                      </Badge>
                    </div>

                    <div className="absolute right-3 top-3">
                      <Badge className={getStatusClass(property.status)}>
                        {property.status}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-1 flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="text-xs">{property.location}</span>
                    </div>

                    <h3 className="mb-2 font-heading text-lg font-semibold line-clamp-1">
                      {property.title}
                    </h3>

                    <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        {property.bedrooms}
                      </span>

                      <span className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        {property.bathrooms}
                      </span>

                      <span className="flex items-center gap-1">
                        <Maximize className="h-4 w-4" />
                        {property.area}m²
                      </span>
                    </div>

                    <p className="mb-4 font-heading text-xl font-bold text-primary">
                      ${property.price.toLocaleString()}
                      {property.priceType === "rent" && (
                        <span className="text-sm font-normal text-muted-foreground">
                          /mo
                        </span>
                      )}
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      <Link to={`/property/${property.id}`}>
                        <Button variant="outline" className="w-full">
                          View
                        </Button>
                      </Link>

                      <Link to={`/edit-property/${property.id}`}>
                        <Button variant="outline" className="w-full gap-1">
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </Link>

                      <Button
                        variant="outline"
                        className="w-full gap-1"
                        disabled={pausingId === property.id}
                        onClick={() => handleTogglePause(property.id)}
                      >
                        {isPaused ? (
                          <Play className="h-4 w-4" />
                        ) : (
                          <Pause className="h-4 w-4" />
                        )}

                        {pausingId === property.id
                          ? "..."
                          : isPaused
                            ? "Resume"
                            : "Pause"}
                      </Button>

                      <Button
                        variant="destructive"
                        className="w-full gap-1"
                        disabled={deletingId === property.id}
                        onClick={() => handleDelete(property.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        {deletingId === property.id ? "..." : "Delete"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OwnerDashboard;

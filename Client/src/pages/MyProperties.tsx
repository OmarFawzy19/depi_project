import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Home,
  Eye,
  Mail,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Edit,
  Trash2,
  Pause,
  Play,
  Building2,
  ArrowRight,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { propertyService, type Property } from "@/services/propertyService";

const fallbackImage =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop";

type OwnerProperty = Property & {
  views?: number;
  inquiriesCount?: number;
};

const getStatusClass = (status: string) => {
  if (status === "approved") return "bg-green-500 text-white";
  if (status === "pending") return "bg-yellow-500 text-white";
  if (status === "paused") return "bg-gray-500 text-white";
  if (status === "rejected") return "bg-red-500 text-white";

  return "";
};

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-card/60 px-6 py-20 text-center backdrop-blur-sm"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent">
        <Building2 className="h-10 w-10 text-primary" />
      </div>

      <h3 className="mb-2 font-heading text-xl font-bold">No properties yet</h3>

      <p className="mx-auto mb-8 max-w-sm text-muted-foreground">
        You haven't listed any properties. Start by adding your first property
        and reach thousands of potential buyers and renters.
      </p>

      <Link to="/add-property">
        <Button size="lg" className="gap-2 rounded-xl shadow-glow">
          <Plus className="h-5 w-5" />
          Add Your First Property
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div className="aspect-[4/3] bg-muted" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-1/2 rounded bg-muted" />
            <div className="h-4 w-3/4 rounded bg-muted" />
            <div className="h-3 w-1/3 rounded bg-muted" />
            <div className="h-8 w-full rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  delay,
}: {
  icon: typeof Home;
  label: string;
  value: string | number;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className="overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {label}
          </CardTitle>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>

        <CardContent>
          <div className="text-3xl font-bold text-gradient">{value}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PropertyManagementCard({
  property,
  deletingId,
  pausingId,
  onDelete,
  onTogglePause,
}: {
  property: OwnerProperty;
  deletingId: string | null;
  pausingId: string | null;
  onDelete: (id: string) => void;
  onTogglePause: (id: string) => void;
}) {
  const propertyImage =
    property.images?.[0] && property.images[0] !== "/placeholder.svg"
      ? property.images[0]
      : fallbackImage;

  const isPaused = property.status === "paused";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <Card
        className={`overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover ${
          isPaused ? "opacity-70" : ""
        }`}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={propertyImage}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute left-3 top-3">
            <Badge>For {property.priceType === "rent" ? "Rent" : "Sale"}</Badge>
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
              <Button variant="outline" className="w-full gap-1">
                <Eye className="h-4 w-4" />
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
              onClick={() => onTogglePause(property.id)}
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
              onClick={() => onDelete(property.id)}
            >
              <Trash2 className="h-4 w-4" />
              {deletingId === property.id ? "..." : "Delete"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const MyProperties = () => {
  const [properties, setProperties] = useState<OwnerProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pausingId, setPausingId] = useState<string | null>(null);

  const loadProperties = () => {
    setLoading(true);

    propertyService
      .listMine()
      .then((data) => {
        setProperties(data as OwnerProperty[]);
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

  const totalViews = properties.reduce(
    (sum, property) => sum + (property.views || 0),
    0,
  );

  const totalInquiries = properties.reduce(
    (sum, property) => sum + (property.inquiriesCount || 0),
    0,
  );

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
          property.id === id ? (updatedProperty as OwnerProperty) : property,
        ),
      );
    } catch {
      alert("Failed to update property status");
    } finally {
      setPausingId(null);
    }
  };

  const stats = [
    {
      icon: Home,
      label: "Total Properties",
      value: properties.length,
    },
    {
      icon: Eye,
      label: "Total Views",
      value: totalViews,
    },
    {
      icon: Mail,
      label: "Total Inquiries",
      value: totalInquiries,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap items-center justify-between gap-3"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Owner Hub
            </p>
            <h1 className="font-heading text-3xl font-bold">My Properties</h1>
            <p className="text-muted-foreground">
              Manage your listings, track performance, and grow your portfolio.
            </p>
          </div>

          {properties.length > 0 && (
            <Link to="/add-property">
              <Button className="gap-2 rounded-xl shadow-glow">
                <Plus className="h-4 w-4" /> Add Property
              </Button>
            </Link>
          )}
        </motion.div>

        {!loading && properties.length > 0 && (
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {stats.map((s, i) => (
              <StatCard key={s.label} {...s} delay={i * 0.1} />
            ))}
          </div>
        )}

        {!loading && properties.length > 0 && (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 font-heading text-xl font-bold"
          >
            Your Listings
          </motion.h2>
        )}

        {loading ? (
          <LoadingSkeleton />
        ) : properties.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyManagementCard
                key={property.id}
                property={property}
                deletingId={deletingId}
                pausingId={pausingId}
                onDelete={handleDelete}
                onTogglePause={handleTogglePause}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyProperties;

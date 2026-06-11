import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, Share2, MapPin, Bed, Bath, Maximize, Phone, MessageSquare, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { propertyService, type Property } from "@/services/propertyService";
import { PropertyCard } from "@/components/PropertyCard";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PropertyMap } from "@/components/PropertyMap";
import { useGeolocation, distanceKm } from "@/hooks/useGeolocation";

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [similar, setSimilar] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const { location: userLocation, request: requestLocation } = useGeolocation();

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    // Fetch the property by ID
    propertyService.getById(id).then((p) => {
      setProperty(p ?? null);
      setLoading(false);

      // Fetch similar properties (same type)
      if (p) {
        propertyService.list({ type: p.type }).then((all) => {
          setSimilar(all.filter((s) => s.id !== p.id).slice(0, 3));
        });
      }
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex h-[60vh] items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold">Property not found</p>
            <Link to="/properties">
              <Button className="mt-4">Browse Properties</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const distance = userLocation ? distanceKm(userLocation, { lat: property.lat, lng: property.lng }) : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Back */}
        <Link to="/properties" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 overflow-hidden rounded-2xl"
        >
          <img
            src={property.images[0]}
            alt={property.title}
            width={1200}
            height={600}
            className="aspect-[2/1] w-full object-cover"
          />
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <Badge className="mb-2">
                  For {property.priceType === "rent" ? "Rent" : "Sale"}
                </Badge>
                <h1 className="font-heading text-3xl font-bold">{property.title}</h1>
                <div className="mt-1 flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{property.location}</span>
                  {distance !== null && (
                    <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                      {distance.toFixed(1)} km away
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => setLiked(!liked)}>
                  <Heart className={`h-4 w-4 ${liked ? "fill-destructive text-destructive" : ""}`} />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="mb-6 font-heading text-3xl font-bold text-primary">
              ${property.price.toLocaleString()}
              {property.priceType === "rent" && <span className="text-lg font-normal text-muted-foreground">/mo</span>}
            </p>

            {/* Stats */}
            <div className="mb-8 grid grid-cols-3 gap-4">
              {[
                { icon: Bed, label: "Bedrooms", value: property.bedrooms },
                { icon: Bath, label: "Bathrooms", value: property.bathrooms },
                { icon: Maximize, label: "Area", value: `${property.area}m²` },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-card p-4 text-center shadow-card">
                  <stat.icon className="mx-auto mb-1 h-5 w-5 text-primary" />
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="mb-3 font-heading text-xl font-semibold">About this property</h2>
              <p className="leading-relaxed text-muted-foreground">{property.description}</p>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h2 className="mb-3 font-heading text-xl font-semibold">Features</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {property.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 rounded-lg bg-accent p-3 text-sm">
                    <Check className="h-4 w-4 text-accent-foreground" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="mb-8">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-heading text-xl font-semibold">Location</h2>
                {!userLocation && (
                  <Button variant="outline" size="sm" onClick={requestLocation}>
                    Show distance from me
                  </Button>
                )}
              </div>
              <PropertyMap
                properties={[property]}
                userLocation={userLocation}
                height="320px"
                center={[property.lat, property.lng]}
                zoom={14}
              />
            </div>
          </div>

          {/* Sidebar — Owner Contact */}
          <div>
            <div className="sticky top-20 rounded-2xl bg-card p-6 shadow-card">
              <h3 className="mb-4 font-heading text-lg font-semibold">Contact Owner</h3>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  {property.owner.name[0]}
                </div>
                <div>
                  <p className="font-semibold">{property.owner.name}</p>
                  <p className="text-sm text-muted-foreground">Property Owner</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button className="w-full gap-2">
                  <MessageSquare className="h-4 w-4" /> Send Message
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Phone className="h-4 w-4" /> Call Owner
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 font-heading text-2xl font-bold">Similar Properties</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PropertyDetail;


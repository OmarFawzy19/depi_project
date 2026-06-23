import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Phone,
  Mail,
  Check,
  Loader2,
  Edit,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { propertyService, type Property } from "@/services/propertyService";
import { PropertyCard } from "@/components/PropertyCard";
import { FavoriteButton } from "@/components/FavoriteButton";
import EnquiryForm from "@/components/EnquiryForm";
import { useAuth } from "@/hooks/AuthContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PropertyMap } from "@/components/PropertyMap";
import { useGeolocation, distanceKm } from "@/hooks/useGeolocation";

const fallbackImage =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=600&fit=crop";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [similar, setSimilar] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { location: userLocation, request: requestLocation } = useGeolocation();
  const { user } = useAuth();

  const userId = user ? ((user as any)._id ?? user.id) : null;

  const isOwner = !!(
    userId &&
    property &&
    userId.toString() === property.owner.id.toString()
  );

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setActiveImageIndex(0);

    propertyService.getById(id).then((p) => {
      if (!p) {
        setProperty(null);
        setLoading(false);
        return;
      }

      const currentUserId = user ? ((user as any)._id ?? user.id) : null;

      const ownerIsCurrentUser = !!(
        currentUserId &&
        p.owner?.id &&
        currentUserId.toString() === p.owner.id.toString()
      );

      if (!ownerIsCurrentUser) {
        propertyService.incrementViews(p.id).then((updatedProperty) => {
          setProperty(updatedProperty ?? p);
        });
      } else {
        setProperty(p);
      }

      setLoading(false);

      propertyService.list({ type: p.type }).then((all) => {
        setSimilar(all.filter((s) => s.id !== p.id).slice(0, 3));
      });
    });
  }, [id, user]);

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

  const galleryImages =
    property.images?.filter((image) => image && image !== "/placeholder.svg") ??
    [];

  const displayImages =
    galleryImages.length > 0 ? galleryImages : [fallbackImage];

  const activeImage =
    displayImages[activeImageIndex] ?? displayImages[0] ?? fallbackImage;

  const hasMultipleImages = displayImages.length > 1;

  const goToPreviousImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1,
    );
  };

  const goToNextImage = () => {
    setActiveImageIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1,
    );
  };

  const distance = userLocation
    ? distanceKm(userLocation, { lat: property.lat, lng: property.lng })
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <Link
          to="/properties"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <div className="relative flex justify-center rounded-2xl bg-muted p-4">
            <img
              src={activeImage}
              alt={property.title}
              width={1200}
              height={600}
              className="max-h-[500px] w-full rounded-2xl object-contain"
            />

            {hasMultipleImages && (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={goToPreviousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={goToNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>

                <div className="absolute bottom-4 right-4 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                  {activeImageIndex + 1} / {displayImages.length}
                </div>
              </>
            )}
          </div>

          {hasMultipleImages && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {displayImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl border-2 bg-muted ${
                    activeImageIndex === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${property.title} ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <Badge className="mb-2">
                  For {property.priceType === "rent" ? "Rent" : "Sale"}
                </Badge>

                <h1 className="font-heading text-3xl font-bold">
                  {property.title}
                </h1>

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
                <FavoriteButton propertyId={property.id} />
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="mb-6 font-heading text-3xl font-bold text-primary">
              ${property.price.toLocaleString()}
              {property.priceType === "rent" && (
                <span className="text-lg font-normal text-muted-foreground">
                  /mo
                </span>
              )}
            </p>

            <div className="mb-8 grid grid-cols-3 gap-4">
              {[
                { icon: Bed, label: "Bedrooms", value: property.bedrooms },
                { icon: Bath, label: "Bathrooms", value: property.bathrooms },
                { icon: Maximize, label: "Area", value: `${property.area}m²` },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-card p-4 text-center shadow-card"
                >
                  <stat.icon className="mx-auto mb-1 h-5 w-5 text-primary" />
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <h2 className="mb-3 font-heading text-xl font-semibold">
                About this property
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                {property.description}
              </p>
            </div>

            {property.features.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-3 font-heading text-xl font-semibold">
                  Features
                </h2>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {property.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 rounded-lg bg-accent p-3 text-sm"
                    >
                      <Check className="h-4 w-4 text-accent-foreground" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

          <div>
            <div className="sticky top-20 rounded-2xl bg-card p-6 shadow-card">
              <h3 className="mb-4 font-heading text-lg font-semibold">
                {isOwner ? "Manage Listing" : "Contact Owner"}
              </h3>

              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  {property.owner.name[0]}
                </div>

                <div>
                  <p className="font-semibold">{property.owner.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {isOwner ? "You own this listing" : "Property Owner"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {isOwner ? (
                  <div className="flex flex-col gap-3 rounded-xl border border-border bg-accent/40 p-4 text-center">
                    <p className="text-xs text-muted-foreground font-medium">
                      This is your property listing. You cannot contact
                      yourself.
                    </p>

                    <Link
                      to={`/edit-property/${property.id}`}
                      className="w-full"
                    >
                      <Button className="w-full gap-2">
                        <Edit className="h-4 w-4" /> Edit Listing
                      </Button>
                    </Link>

                    <Link to="/my-properties" className="w-full">
                      <Button variant="outline" className="w-full gap-2">
                        <Home className="h-4 w-4" /> Go to My Properties
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    {user ? (
                      <EnquiryForm propertyId={property.id} />
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => navigate("/login")}
                      >
                        <Mail className="h-4 w-4" /> Login to send inquiry
                      </Button>
                    )}

                    <Button variant="outline" className="w-full gap-2">
                      <Phone className="h-4 w-4" /> Call Owner
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 font-heading text-2xl font-bold">
              Similar Properties
            </h2>

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

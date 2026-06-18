import { Heart, MapPin, Bed, Bath, Maximize, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Property } from "@/services/propertyService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  property: Property;
  index?: number;
  isOwner?: boolean;
  onDelete?: (id: string) => void;
}

export function PropertyCard({
  property,
  index = 0,
  isOwner = false,
  onDelete,
}: PropertyCardProps) {
  const [liked, setLiked] = useState(false);

  const propertyImage =
    property.images?.[0] && property.images[0] !== "/placeholder.svg"
      ? property.images[0]
      : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop";

  const propertyId = property.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="overflow-hidden rounded-2xl bg-card shadow-card transition-all duration-300 hover:shadow-card-hover"
    >
      <Link to={`/property/${propertyId}`} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={propertyImage}
            alt={property.title}
            loading="lazy"
            width={800}
            height={600}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute left-3 top-3">
            <Badge
              variant={property.priceType === "rent" ? "default" : "secondary"}
              className="font-semibold"
            >
              For {property.priceType === "rent" ? "Rent" : "Sale"}
            </Badge>
          </div>

          {!isOwner && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setLiked(!liked);
              }}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm transition-colors hover:bg-card"
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  liked
                    ? "fill-destructive text-destructive"
                    : "text-muted-foreground"
                }`}
              />
            </button>
          )}
        </div>

        <div className="p-4">
          <div className="mb-1 flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="text-xs">{property.location}</span>
          </div>

          <h3 className="mb-2 font-heading text-lg font-semibold text-foreground line-clamp-1">
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

          <div className="flex items-baseline justify-between">
            <p className="font-heading text-xl font-bold text-primary">
              ${property.price.toLocaleString()}
              {property.priceType === "rent" && (
                <span className="text-sm font-normal text-muted-foreground">
                  /mo
                </span>
              )}
            </p>

            <span className="text-xs capitalize text-muted-foreground">
              {property.type}
            </span>
          </div>
        </div>
      </Link>

      {isOwner && (
        <div className="flex gap-2 border-t border-border p-4">
          <Link to={`/edit-property/${propertyId}`} className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </Link>

          <Button
            variant="destructive"
            className="flex-1 gap-2"
            onClick={() => onDelete?.(propertyId)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      )}
    </motion.div>
  );
}

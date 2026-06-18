import { MapPin, Bed, Bath, Maximize, Navigation2, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Property } from "@/services/propertyService";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  property: Property;
  index?: number;
  distance?: number | null;
  isOwner?: boolean;
  onDelete?: (id: string) => void;
}

export function PropertyCard({ property, index = 0, distance, isOwner = false, onDelete }: PropertyCardProps) {
  const propertyId = property.id;
  const propertyImage = property.images?.[0] ?? "/placeholder.svg";
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
          <FavoriteButton propertyId={propertyId} className="absolute right-3 top-3 h-12 w-12" />
        </div>

        <div className="p-4">
          <div className="mb-1 flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-xs truncate">{property.location}</span>
            {distance != null && (
              <span className="ml-auto flex items-center gap-0.5 flex-shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                <Navigation2 className="h-3 w-3" />
                {distance.toFixed(1)} km
              </span>
            )}
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

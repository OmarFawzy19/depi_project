import { Heart } from "lucide-react";
import { useState } from "react";
import { favoritesService } from "@/services/favoritesService";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  propertyId: string;
  className?: string;
}

export function FavoriteButton({ propertyId, className }: FavoriteButtonProps) {
  const [active, setActive] = useState(() => favoritesService.has(propertyId));
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        setActive(favoritesService.toggle(propertyId));
      }}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm transition-colors hover:bg-card",
        className,
      )}
      aria-label="Toggle favorite"
    >
      <Heart className={cn("h-4 w-4 transition-colors", active ? "fill-destructive text-destructive" : "text-muted-foreground")} />
    </button>
  );
}
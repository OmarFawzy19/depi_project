import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addFavorite, removeFavorite } from "@/services/favoritesService";
import { useAuth } from "@/hooks/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import useFavorites from "@/hooks/useFavourities";

interface FavoriteButtonProps {
  propertyId: string;
  className?: string;
}

export function FavoriteButton({ propertyId, className }: FavoriteButtonProps) {
  const { user } = useAuth();
  const isAuthed = Boolean(user);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { favorites, loadFavorites } = useFavorites();
  const isFavorite = favorites.some((fav) => fav.property._id === propertyId);

  return (
    <button
      onClick={async (e) => {
        e.preventDefault();

        if (!isAuthed) {
          toast({
            title: "Login required",
            description: "You should login first.",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }

        try {
          if (!isFavorite) {
            await addFavorite(propertyId);
          } else {
            await removeFavorite(propertyId);
          }
          await loadFavorites();
        } catch (error) {
          console.error("Failed to update favorites", error);
        }
      }}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm transition-colors hover:bg-card",
        className,
      )}
      aria-label="Toggle favorite"
    >
      <Heart className={cn(
        "transition-colors",
        isFavorite ? "h-6 w-6 fill-destructive text-destructive" : "h-5 w-5 text-muted-foreground",
      )} />
    </button>
  );
}
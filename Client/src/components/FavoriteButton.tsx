import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "@/services/favoritesService";
import { useAuth } from "@/hooks/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  propertyId: string;
  className?: string;
}

interface FavoriteItem {
  _id: string;
  property: {
    _id: string;
  };
}

export function FavoriteButton({ propertyId, className }: FavoriteButtonProps) {
  const { user } = useAuth();
  const isAuthed = Boolean(user);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthed) {
      setIsFavorite(false);
      return;
    }

    getFavorites()
      .then((res) => {
        const favorites = res.data as FavoriteItem[];

        const exists = favorites.some(
          (fav) => fav.property?._id === propertyId,
        );

        setIsFavorite(exists);
      })
      .catch(() => {
        setIsFavorite(false);
      });
  }, [isAuthed, propertyId]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
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
      setLoading(true);

      if (isFavorite) {
        await removeFavorite(propertyId);
        setIsFavorite(false);
      } else {
        await addFavorite(propertyId);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Failed to update favorites", error);

      toast({
        title: "Something went wrong",
        description: "Failed to update favorites.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm transition-colors hover:bg-card",
        loading && "opacity-60",
        className,
      )}
      aria-label="Toggle favorite"
    >
      <Heart
        className={cn(
          "transition-colors",
          isFavorite
            ? "h-6 w-6 fill-destructive text-destructive"
            : "h-5 w-5 text-muted-foreground",
        )}
      />
    </button>
  );
}

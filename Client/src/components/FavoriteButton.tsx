import { Heart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavoritesContext } from "@/hooks/FavoritesContext";
import { useAuth } from "@/hooks/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  propertyId: string;
  className?: string;
}

export function FavoriteButton({ propertyId, className }: FavoriteButtonProps) {
  const { user } = useAuth();
  const isAuthed = Boolean(user);

  if (user?.role === "admin") return null;

  const { toast } = useToast();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const [loading, setLoading] = useState(false);

  const isFav = isFavorite(propertyId);

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
      await toggleFavorite(propertyId);
    } catch {
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
          isFav
            ? "h-6 w-6 fill-destructive text-destructive"
            : "h-5 w-5 text-muted-foreground",
        )}
      />
    </button>
  );
}

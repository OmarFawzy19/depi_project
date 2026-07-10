import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { getFavorites, addFavorite, removeFavorite } from "@/services/favoritesService";

interface FavoritesContextType {
  favoriteIds: Set<string>;
  toggleFavorite: (propertyId: string) => Promise<void>;
  isFavorite: (propertyId: string) => boolean;
  loading: boolean;
  refresh: () => void;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favoriteIds: new Set(),
  toggleFavorite: async () => { },
  isFavorite: () => false,
  loading: false,
  refresh: () => { },
});

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setFavoriteIds(new Set());
      return;
    }
    try {
      setLoading(true);
      const res = await getFavorites();
      const ids = new Set<string>(
        res.data
          .map((fav: { property?: { _id: string } }) => fav.property?._id)
          .filter(Boolean)
      );
      setFavoriteIds(ids);
    } catch {
      setFavoriteIds(new Set());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleFavorite = async (propertyId: string) => {
    const isAlreadyFav = favoriteIds.has(propertyId);

    // Optimistic update
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      isAlreadyFav ? next.delete(propertyId) : next.add(propertyId);
      return next;
    });

    try {
      if (isAlreadyFav) {
        await removeFavorite(propertyId);
      } else {
        await addFavorite(propertyId);
      }
    } catch {
      // Revert on failure
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        isAlreadyFav ? next.add(propertyId) : next.delete(propertyId);
        return next;
      });
      throw new Error("Failed to update favorites");
    }
  };

  const isFavorite = (propertyId: string) => favoriteIds.has(propertyId);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite, loading, refresh: load }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavoritesContext = () => useContext(FavoritesContext);

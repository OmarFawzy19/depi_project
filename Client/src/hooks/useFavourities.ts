import { useEffect, useState } from "react";
import * as favoriteService from "../services/favoritesService";
import type { ApiProperty } from "@/services/propertyService";

interface Favorite {
    _id: string;
    property: ApiProperty;
}

export default function useFavorites() {
    const [favorites, setFavorites] = useState<Favorite[]>([]);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async (): Promise<void> => {
        const res = await favoriteService.getFavorites();
        setFavorites(res.data);
    };

    return {
        favorites,
        loadFavorites,
    };
}
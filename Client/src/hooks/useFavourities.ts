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
        if (!localStorage.getItem("token")) {
            setFavorites([]);
            return;
        }

        loadFavorites();
    }, []);

    const loadFavorites = async (): Promise<void> => {
        if (!localStorage.getItem("token")) {
            setFavorites([]);
            return;
        }

        try {
            const res = await favoriteService.getFavorites();
            setFavorites(res.data);
        } catch (error) {
            console.warn("Unable to load favorites", error);
            setFavorites([]);
        }
    };

    return {
        favorites,
        loadFavorites,
    };
}
import axiosClient from "@/lib/axiosClient";

export const getFavorites = () => {
    return axiosClient.get("/favorites");
};

export const addFavorite = (id: string) => {
    return axiosClient.post(`/favorites/${id}`);
};

export const removeFavorite = (id: string) => {
    return axiosClient.delete(`/favorites/${id}`);
};
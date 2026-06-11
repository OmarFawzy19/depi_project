import { useEffect, useState } from "react";
import { propertyService, type Property } from "@/services/propertyService";
import type { PropertyFilters } from "@/types/Property";
import { distanceKm, type UserLocation } from "@/hooks/useGeolocation";

export function useProperties(filters: PropertyFilters = {}, userLocation?: UserLocation | null) {
  const [data, setData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    // Build filter params for the API
    const params: Record<string, string | number> = {};
    if (filters.query) params.query = filters.query;
    if (filters.type && filters.type !== "all") params.type = filters.type;
    if (filters.priceType && filters.priceType !== "all") params.priceType = filters.priceType;
    if (filters.minPrice != null) params.minPrice = filters.minPrice;
    if (filters.maxPrice != null) params.maxPrice = filters.maxPrice;
    if (filters.bedrooms != null) params.bedrooms = filters.bedrooms;

    propertyService.list(params).then((results) => {
      if (!alive) return;
      setData(results);
      setLoading(false);
    }).catch(() => {
      if (!alive) return;
      setData([]);
      setLoading(false);
    });

    return () => {
      alive = false;
    };
  }, [filters.query, filters.type, filters.priceType, filters.minPrice, filters.maxPrice, filters.bedrooms]);

  // Client-side radius filtering (when user shares location)
  const filtered = data.filter((p) => {
    if (filters.radiusKm != null && userLocation) {
      if (distanceKm(userLocation, { lat: p.lat, lng: p.lng }) > filters.radiusKm) return false;
    }
    return true;
  });

  return { properties: filtered, all: data, loading };
}
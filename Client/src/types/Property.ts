export type { Property } from "@/services/propertyService";

export interface PropertyFilters {
  query?: string;
  type?: string;
  priceType?: "rent" | "sale" | "all";
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  radiusKm?: number;
}
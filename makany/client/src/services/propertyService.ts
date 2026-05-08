import { ENDPOINTS } from "../config/apiConfig";
import { apiClient } from "./apiClient";
import { mockProperties } from "./mockData";

export type Property = {
  id: string;
  title: string;
  price: number;
  location: string;
  image: string;
  description: string;
};

export const propertyService = {
  async getProperties(): Promise<Property[]> {
    try {
      const { data } = await apiClient.get(ENDPOINTS.properties.list);
      return Array.isArray(data) ? data : data.properties;
    } catch {
      return mockProperties;
    }
  },
};

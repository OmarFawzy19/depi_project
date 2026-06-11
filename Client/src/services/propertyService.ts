import axiosClient from "@/lib/axiosClient";

/**
 * Property interface matching the backend Property model.
 * The _id comes from MongoDB, and we alias it as `id` for convenience.
 */
export interface ApiProperty {
  _id: string;
  title: string;
  description: string;
  price: number;
  priceType: "rent" | "sale";
  type: "apartment" | "villa" | "studio" | "penthouse" | "house" | "loft";
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: string;
  latitude: number;
  longitude: number;
  images: string[];
  features: string[];
  status: "pending" | "approved" | "rejected";
  owner: { _id: string; name: string; email: string };
  createdAt: string;
  distance?: number; // only present in /nearby responses
}

/** Normalized property — maps MongoDB _id to id, and lat/lng field names */
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  priceType: "rent" | "sale";
  type: "apartment" | "villa" | "studio" | "penthouse" | "house" | "loft";
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: string;
  lat: number;
  lng: number;
  images: string[];
  features: string[];
  status: string;
  owner: { name: string; avatar: string; phone: string };
  isFeatured: boolean;
  createdAt: string;
  distance?: number;
}

/** Convert API response to the frontend Property shape */
function normalize(p: ApiProperty): Property {
  return {
    id: p._id,
    title: p.title,
    description: p.description,
    price: p.price,
    priceType: p.priceType,
    type: p.type,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    area: p.area,
    location: p.location,
    lat: p.latitude,
    lng: p.longitude,
    images: p.images.length > 0 ? p.images : ["/placeholder.svg"],
    features: p.features,
    status: p.status,
    owner: {
      name: p.owner?.name ?? "Unknown",
      avatar: "",
      phone: "",
    },
    isFeatured: true,
    createdAt: p.createdAt,
    distance: p.distance,
  };
}

export const propertyService = {
  /**
   * List properties with optional filters.
   * Maps to GET /api/properties?type=...&minPrice=...&maxPrice=...&bedrooms=...&query=...
   */
  async list(filters: Record<string, string | number> = {}): Promise<Property[]> {
    // Build query string from non-empty filters
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== "" && val !== undefined && val !== null) {
        params.append(key, String(val));
      }
    });

    const query = params.toString();
    const url = `/properties${query ? `?${query}` : ""}`;
    const { data } = await axiosClient.get<ApiProperty[]>(url);
    return data.map(normalize);
  },

  /**
   * Find properties near a location.
   * Maps to GET /api/properties/nearby?lat=...&lng=...&radius=...
   */
  async nearby(lat: number, lng: number, radius: number): Promise<Property[]> {
    const { data } = await axiosClient.get<ApiProperty[]>(
      `/properties/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
    );
    return data.map(normalize);
  },

  /**
   * Get a single property by ID.
   * Maps to GET /api/properties/:id
   */
  async getById(id: string): Promise<Property | undefined> {
    try {
      const { data } = await axiosClient.get<ApiProperty>(`/properties/${id}`);
      return normalize(data);
    } catch {
      return undefined;
    }
  },

  /**
   * Create a new property (requires auth).
   * Maps to POST /api/properties
   */
  async create(payload: Partial<Property>): Promise<Property> {
    const body = {
      title: payload.title,
      description: payload.description,
      type: payload.type,
      price: payload.price,
      priceType: payload.priceType,
      bedrooms: payload.bedrooms,
      bathrooms: payload.bathrooms,
      area: payload.area,
      location: payload.location,
      latitude: payload.lat,
      longitude: payload.lng,
      images: payload.images,
      features: payload.features,
    };
    const { data } = await axiosClient.post<ApiProperty>("/properties", body);
    return normalize(data);
  },

  async remove(_id: string): Promise<void> {
    return;
  },
};
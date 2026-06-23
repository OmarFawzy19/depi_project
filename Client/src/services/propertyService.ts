import axiosClient from "@/lib/axiosClient";

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
  status: "pending" | "approved" | "rejected" | "paused";
  rejectionReason?: string;
  owner: { _id: string; name: string; email: string };
  views?: number;
  inquiriesCount?: number;
  createdAt: string;
  distance?: number;
}

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
  rejectionReason?: string;
  owner: { id: string; name: string; avatar: string; phone: string };
  isFeatured: boolean;
  views: number;
  inquiriesCount: number;
  createdAt: string;
  distance?: number;
}

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
    images: p.images?.length > 0 ? p.images : ["/placeholder.svg"],
    features: p.features ?? [],
    status: p.status,
    rejectionReason: p.rejectionReason,
    owner: {
      id: p.owner?._id ?? "",
      name: p.owner?.name ?? "Unknown",
      avatar: "",
      phone: "",
    },
    isFeatured: true,
    views: p.views ?? 0,
    inquiriesCount: p.inquiriesCount ?? 0,
    createdAt: p.createdAt,
    distance: p.distance,
  };
}

export const propertyService = {
  async list(
    filters: Record<string, string | number> = {},
  ): Promise<Property[]> {
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

  async listAll(): Promise<Property[]> {
    const { data } = await axiosClient.get<ApiProperty[]>("/properties/all");
    return data.map(normalize);
  },

  async nearby(lat: number, lng: number, radius: number): Promise<Property[]> {
    const { data } = await axiosClient.get<ApiProperty[]>(
      `/properties/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
    );

    return data.map(normalize);
  },

  async getById(id: string): Promise<Property | undefined> {
    try {
      const { data } = await axiosClient.get<ApiProperty>(`/properties/${id}`);
      return normalize(data);
    } catch {
      return undefined;
    }
  },

  async incrementViews(id: string): Promise<Property | undefined> {
    try {
      const { data } = await axiosClient.patch<ApiProperty>(
        `/properties/${id}/view`,
      );
      return normalize(data);
    } catch {
      return undefined;
    }
  },

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

  async update(id: string, payload: Partial<Property>): Promise<Property> {
    const body = {
      title: payload.title,
      description: payload.description,
      price: payload.price,
      priceType: payload.priceType,
      type: payload.type,
      bedrooms: payload.bedrooms,
      bathrooms: payload.bathrooms,
      area: payload.area,
      location: payload.location,
      latitude: payload.lat,
      longitude: payload.lng,
      images: payload.images,
      features: payload.features,
    };

    const { data } = await axiosClient.put<ApiProperty>(
      `/properties/${id}`,
      body,
    );

    return normalize(data);
  },

  async togglePause(id: string): Promise<Property> {
    const { data } = await axiosClient.patch<ApiProperty>(
      `/properties/${id}/pause`,
    );

    return normalize(data);
  },

  async remove(id: string): Promise<void> {
    await axiosClient.delete(`/properties/${id}`);
  },

  async listMine(): Promise<Property[]> {
    const { data } = await axiosClient.get<ApiProperty[]>(
      "/properties/my/listings",
    );
    return data.map(normalize);
  },
};

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";

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
  owner: {
    name: string;
    avatar: string;
    phone: string;
  };
  isFeatured: boolean;
  createdAt: string;
}

export const properties: Property[] = [
  {
    id: "1",
    title: "Modern City Apartment",
    description: "Bright and spacious apartment with panoramic city views. Floor-to-ceiling windows flood the space with natural light. Open-plan living area with modern kitchen.",
    price: 2500,
    priceType: "rent",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    location: "Downtown, City Center",
    lat: 30.0444,
    lng: 31.2357,
    images: [property1],
    features: ["Parking", "Gym", "Pool", "Concierge", "Balcony"],
    owner: { name: "Ahmed Hassan", avatar: "", phone: "+20 100 123 4567" },
    isFeatured: true,
    createdAt: "2026-04-01",
  },
  {
    id: "2",
    title: "Luxury Villa with Pool",
    description: "Stunning modern villa with private pool and lush garden. Perfect for families seeking luxury living in a quiet neighborhood.",
    price: 850000,
    priceType: "sale",
    type: "villa",
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    location: "New Cairo, Fifth Settlement",
    lat: 30.0131,
    lng: 31.4089,
    images: [property2],
    features: ["Pool", "Garden", "Garage", "Smart Home", "Security"],
    owner: { name: "Sara Mohamed", avatar: "", phone: "+20 101 234 5678" },
    isFeatured: true,
    createdAt: "2026-03-28",
  },
  {
    id: "3",
    title: "Cozy Studio Apartment",
    description: "Charming studio with wooden floors and modern furnishing. Ideal for singles or couples looking for a comfortable space.",
    price: 1200,
    priceType: "rent",
    type: "studio",
    bedrooms: 1,
    bathrooms: 1,
    area: 55,
    location: "Zamalek, Cairo",
    lat: 30.0609,
    lng: 31.2194,
    images: [property3],
    features: ["Furnished", "AC", "Laundry", "Pet Friendly"],
    owner: { name: "Omar Ali", avatar: "", phone: "+20 102 345 6789" },
    isFeatured: true,
    createdAt: "2026-04-03",
  },
  {
    id: "4",
    title: "Skyline Penthouse",
    description: "Breathtaking penthouse with double-height ceilings and unobstructed city skyline views. Premium finishes throughout.",
    price: 1200000,
    priceType: "sale",
    type: "penthouse",
    bedrooms: 3,
    bathrooms: 3,
    area: 280,
    location: "Nile Corniche, Garden City",
    lat: 30.0377,
    lng: 31.2311,
    images: [property4],
    features: ["Terrace", "Private Elevator", "Smart Home", "Panoramic View"],
    owner: { name: "Nadia Kamel", avatar: "", phone: "+20 103 456 7890" },
    isFeatured: true,
    createdAt: "2026-03-25",
  },
  {
    id: "5",
    title: "Family Home with Garden",
    description: "Spacious family home in a quiet suburban neighborhood. Beautiful garden and large backyard for the kids.",
    price: 3500,
    priceType: "rent",
    type: "house",
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    location: "6th of October City",
    lat: 29.9285,
    lng: 30.9188,
    images: [property5],
    features: ["Garden", "Garage", "Playground", "BBQ Area", "Storage"],
    owner: { name: "Khaled Youssef", avatar: "", phone: "+20 104 567 8901" },
    isFeatured: true,
    createdAt: "2026-04-05",
  },
  {
    id: "6",
    title: "Industrial Chic Loft",
    description: "Unique loft space with exposed brick walls and industrial character. High ceilings and abundant natural light.",
    price: 1800,
    priceType: "rent",
    type: "loft",
    bedrooms: 1,
    bathrooms: 1,
    area: 95,
    location: "Maadi, Cairo",
    lat: 29.9602,
    lng: 31.2569,
    images: [property6],
    features: ["High Ceilings", "Open Plan", "Rooftop Access", "Pet Friendly"],
    owner: { name: "Layla Ibrahim", avatar: "", phone: "+20 105 678 9012" },
    isFeatured: true,
    createdAt: "2026-04-06",
  },
];

import type { Property } from "@/types/Property";

export function boundsFor(properties: Property[]): [[number, number], [number, number]] | null {
  if (!properties.length) return null;
  const lats = properties.map((p) => p.lat);
  const lngs = properties.map((p) => p.lng);
  return [
    [Math.min(...lats), Math.min(...lngs)],
    [Math.max(...lats), Math.max(...lngs)],
  ];
}

export function centerOf(properties: Property[]): [number, number] {
  if (!properties.length) return [30.0444, 31.2357];
  const lat = properties.reduce((s, p) => s + p.lat, 0) / properties.length;
  const lng = properties.reduce((s, p) => s + p.lng, 0) / properties.length;
  return [lat, lng];
}
import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import type { Property } from "@/services/propertyService";

interface PropertyMapProps {
  properties: Property[];
  userLocation?: { lat: number; lng: number } | null;
  height?: string;
  zoom?: number;
  center?: [number, number];
  selectable?: boolean;
  onSelect?: (lat: number, lng: number) => void;
  selectedPoint?: { lat: number; lng: number } | null;
  className?: string;
}

const isValidPoint = (lat?: number, lng?: number) => {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    !Number.isNaN(lat) &&
    !Number.isNaN(lng)
  );
};

const priceIcon = (price: number, type: "rent" | "sale") =>
  L.divIcon({
    className: "",
    html: `<div style="background:linear-gradient(135deg,hsl(222 89% 32%),hsl(217 91% 50%));color:white;padding:6px 10px;border-radius:999px;font-weight:700;font-size:12px;box-shadow:0 6px 16px hsl(217 91% 30% / .35);white-space:nowrap;border:2px solid white;">$${price >= 1000 ? (price / 1000).toFixed(price >= 10000 ? 0 : 1) + "k" : price}${type === "rent" ? "/mo" : ""}</div>`,
    iconSize: [60, 28],
    iconAnchor: [30, 14],
  });

const userIcon = L.divIcon({
  className: "",
  html: `<div style="position:relative;width:18px;height:18px;"><div style="position:absolute;inset:0;border-radius:9999px;background:hsl(217 91% 50%);border:3px solid white;box-shadow:0 0 0 4px hsl(217 91% 50% / .3);"></div></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export function PropertyMap({
  properties,
  userLocation,
  height = "500px",
  zoom = 11,
  center,
  selectable = false,
  onSelect,
  selectedPoint,
  className,
}: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userCircleRef = useRef<L.Circle | null>(null);
  const pickMarkerRef = useRef<L.Marker | null>(null);

  const validProperties = useMemo(() => {
    return properties.filter((p) => isValidPoint(p.lat, p.lng));
  }, [properties]);

  const initialCenter: [number, number] = useMemo(() => {
    if (center) return center;

    if (userLocation && isValidPoint(userLocation.lat, userLocation.lng)) {
      return [userLocation.lat, userLocation.lng];
    }

    if (validProperties.length > 0) {
      return [validProperties[0].lat, validProperties[0].lng];
    }

    return [30.0444, 31.2357];
  }, [center, userLocation, validProperties]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView(initialCenter, zoom);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution: "&copy; OpenStreetMap &copy; CARTO",
        maxZoom: 19,
      },
    ).addTo(map);

    mapRef.current = map;

    const cluster = (L as any).markerClusterGroup({
      showCoverageOnHover: false,
    });

    cluster.addTo(map);
    clusterRef.current = cluster;

    if (selectable) {
      map.on("click", (e: L.LeafletMouseEvent) => {
        onSelect?.(e.latlng.lat, e.latlng.lng);
      });
    }

    return () => {
      map.remove();
      mapRef.current = null;
      clusterRef.current = null;
    };
  }, []);

  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;

    cluster.clearLayers();

    validProperties.forEach((p) => {
      const image =
        p.images?.[0] && p.images[0] !== "/placeholder.svg"
          ? p.images[0]
          : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop";

      const marker = L.marker([p.lat, p.lng], {
        icon: priceIcon(p.price, p.priceType),
      });

      const html = `
        <div style="width:200px;font-family:'DM Sans',sans-serif;">
          <img src="${image}" alt="" style="width:100%;height:100px;object-fit:cover;border-radius:8px;margin-bottom:6px;" />
          <div style="font-weight:700;font-size:14px;color:hsl(215 25% 15%);margin-bottom:2px;">${p.title}</div>
          <div style="font-size:12px;color:hsl(215 16% 47%);margin-bottom:6px;">${p.location || "No location"}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="font-weight:700;color:hsl(217 91% 45%);">$${p.price.toLocaleString()}${p.priceType === "rent" ? "/mo" : ""}</div>
            <a href="/property/${p.id}" style="font-size:12px;color:hsl(217 91% 45%);font-weight:600;">View →</a>
          </div>
        </div>`;

      marker.bindPopup(html);
      cluster.addLayer(marker);
    });
  }, [validProperties]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userCircleRef.current) {
      userCircleRef.current.remove();
      userCircleRef.current = null;
    }

    if (userLocation && isValidPoint(userLocation.lat, userLocation.lng)) {
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
      }).addTo(map);

      userCircleRef.current = L.circle([userLocation.lat, userLocation.lng], {
        radius: 5000,
        color: "hsl(217 91% 50%)",
        fillColor: "hsl(217 91% 50%)",
        fillOpacity: 0.06,
        weight: 1,
      }).addTo(map);

      map.setView([userLocation.lat, userLocation.lng], 12);
    }
  }, [userLocation]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (pickMarkerRef.current) {
      pickMarkerRef.current.remove();
    }

    if (selectedPoint && isValidPoint(selectedPoint.lat, selectedPoint.lng)) {
      pickMarkerRef.current = L.marker([
        selectedPoint.lat,
        selectedPoint.lng,
      ]).addTo(map);
    }
  }, [selectedPoint]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.on("popupopen", () => {
      const popup = document.querySelector(".leaflet-popup-content a");

      if (popup) {
        popup.addEventListener("click", (ev: Event) => {
          const href = (popup as HTMLAnchorElement).getAttribute("href");

          if (href) {
            ev.preventDefault();
            window.history.pushState({}, "", href);
            window.dispatchEvent(new PopStateEvent("popstate"));
          }
        });
      }
    });

    return () => {
      map.off("popupopen");
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        height,
        width: "100%",
        borderRadius: "1rem",
        overflow: "hidden",
        zIndex: 0,
      }}
    />
  );
}

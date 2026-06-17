import { useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PropertyMap } from "@/components/PropertyMap";
import { FilterPanel } from "@/components/FilterPanel";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Locate, Loader2, X, MapPin, List, ChevronUp, ChevronDown } from "lucide-react";
import { useGeolocation, distanceKm } from "@/hooks/useGeolocation";
import { useProperties } from "@/hooks/useProperties";
import { propertyService, type Property } from "@/services/propertyService";
import type { PropertyFilters } from "@/types/Property";
import { motion, AnimatePresence } from "framer-motion";

const MapSearch = () => {
  const defaultFilters: PropertyFilters = { priceType: "all", radiusKm: 25 };
  const [filters, setFilters] = useState<PropertyFilters>(defaultFilters);
  const { location, request, loading: geoLoading } = useGeolocation();
  const { properties, loading: propertiesLoading } = useProperties(filters, location);

  // Map-pan driven data: merge into a combined list
  const [panProperties, setPanProperties] = useState<Property[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // Merge hook results + pan-fetched results (deduplicated)
  const mergedProperties = (() => {
    const map = new Map<string, Property>();
    properties.forEach((p) => map.set(p.id, p));
    panProperties.forEach((p) => map.set(p.id, p));
    return Array.from(map.values());
  })();

  // Handle map bounds change — fetch nearby properties for the visible area
  const handleBoundsChange = useCallback(
    (
      center: { lat: number; lng: number },
      radiusKm: number,
      _bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }
    ) => {
      const queryRadius = Math.max(1, Math.min(radiusKm, 50));
      propertyService
        .nearby(center.lat, center.lng, queryRadius)
        .then((results) => {
          setPanProperties(results);
        })
        .catch(() => {});
    },
    []
  );

  // Active filter chips
  const chips: { label: string; onRemove: () => void }[] = [];
  if (filters.priceType && filters.priceType !== "all") {
    chips.push({
      label: `Listing: ${filters.priceType}`,
      onRemove: () => setFilters({ ...filters, priceType: "all" }),
    });
  }
  if (filters.type && filters.type !== "all") {
    chips.push({
      label: `Type: ${filters.type}`,
      onRemove: () => setFilters({ ...filters, type: undefined }),
    });
  }
  if (filters.minPrice != null) {
    chips.push({
      label: `Min: $${filters.minPrice.toLocaleString()}`,
      onRemove: () => setFilters({ ...filters, minPrice: undefined }),
    });
  }
  if (filters.maxPrice != null) {
    chips.push({
      label: `Max: $${filters.maxPrice.toLocaleString()}`,
      onRemove: () => setFilters({ ...filters, maxPrice: undefined }),
    });
  }
  if (filters.bedrooms != null) {
    chips.push({
      label: `${filters.bedrooms}+ beds`,
      onRemove: () => setFilters({ ...filters, bedrooms: undefined }),
    });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      {/* Toolbar */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <h1 className="font-heading text-xl font-bold">Map Search</h1>
              <p className="text-xs text-muted-foreground">
                {propertiesLoading ? "Loading..." : `${mergedProperties.length} properties found`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={request}
              disabled={geoLoading}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {geoLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Locate className="h-4 w-4" />
              )}
              {location ? "Located" : "Use my location"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 lg:hidden"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <List className="h-4 w-4" />
              {showSidebar ? "Hide panel" : "Show panel"}
            </Button>
          </div>
        </div>

        {/* Filter chips bar */}
        {chips.length > 0 && (
          <div className="container mx-auto flex flex-wrap items-center gap-2 border-t border-border/50 px-4 py-2">
            {chips.map((c) => (
              <span
                key={c.label}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {c.label}
                <button
                  onClick={c.onRemove}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20 transition-colors"
                  aria-label={`Remove filter: ${c.label}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <button
              onClick={() => setFilters(defaultFilters)}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main content — sidebar + map */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: filters + property list */}
        <AnimatePresence>
          {showSidebar && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col overflow-hidden border-r border-border bg-card"
              style={{ minWidth: 0 }}
            >
              <div className="flex-1 overflow-y-auto p-4" style={{ width: 360 }}>
                {/* Filter panel */}
                <FilterPanel
                  value={filters}
                  onChange={setFilters}
                  onReset={() => setFilters(defaultFilters)}
                />

                {/* Property list */}
                <div className="mt-5">
                  <h3 className="mb-3 font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Results ({mergedProperties.length})
                  </h3>

                  {propertiesLoading && (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  )}

                  {!propertiesLoading && mergedProperties.length === 0 && (
                    <div className="rounded-xl border border-dashed border-border p-6 text-center">
                      <MapPin className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium text-muted-foreground">
                        No properties found
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Try adjusting your filters or pan the map
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {mergedProperties.map((property) => (
                      <div
                        key={property.id}
                        className={`cursor-pointer rounded-xl transition-all ${
                          selectedPropertyId === property.id
                            ? "ring-2 ring-primary ring-offset-2"
                            : "hover:ring-1 hover:ring-border"
                        }`}
                        onClick={() => setSelectedPropertyId(property.id)}
                      >
                        <PropertyCard
                          property={property}
                          distance={
                            location
                              ? distanceKm(location, {
                                  lat: property.lat,
                                  lng: property.lng,
                                })
                              : null
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Map */}
        <div className="relative flex-1">
          {propertiesLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 rounded-xl bg-card px-5 py-3 shadow-lg">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm font-medium">Loading properties…</span>
              </div>
            </div>
          )}
          <PropertyMap
            properties={mergedProperties}
            userLocation={location}
            height="100%"
            onBoundsChange={handleBoundsChange}
          />

          {/* Toggle sidebar button — always visible on desktop */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="absolute left-3 top-3 z-10 hidden items-center gap-1 rounded-lg bg-card px-3 py-2 text-xs font-medium shadow-lg hover:bg-accent transition-colors lg:flex"
          >
            {showSidebar ? (
              <>
                <ChevronUp className="h-3.5 w-3.5 -rotate-90" /> Hide
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5 -rotate-90" /> Show
              </>
            )}
          </button>

          {/* Property count overlay */}
          <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-card/90 px-4 py-2 text-xs font-semibold shadow-lg backdrop-blur-sm">
            {mergedProperties.length} properties on map
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MapSearch;
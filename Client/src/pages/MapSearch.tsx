import { useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PropertyMap } from "@/components/PropertyMap";
import { FilterPanel } from "@/components/FilterPanel";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import {
  Locate,
  Loader2,
  X,
  MapPin,
  List,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  CheckCircle2,
  Search,
} from "lucide-react";
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
    <div className="flex min-h-screen flex-col bg-[hsl(210_33%_97%)] dark:bg-background">
      <Navbar />

      {/* ── Premium Page Header ──────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-border/60 bg-white/90 backdrop-blur-xl dark:bg-card/80">
        {/* Subtle gradient accent */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ background: "var(--gradient-primary)" }}
        />

        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left: Title + count */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-400 shadow-[0_4px_14px_hsl(217_91%_50%_/_0.35)]">
                <Search className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold leading-none text-foreground">
                  Map Search
                </h1>
                <div className="mt-1 flex items-center gap-2">
                  {propertiesLoading ? (
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Finding properties…
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      <MapPin className="h-3 w-3" />
                      {mergedProperties.length} properties found
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Geo button */}
              <button
                onClick={request}
                disabled={geoLoading}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-60 ${
                  location
                    ? "border-green-300 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "border-border/70 bg-background text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary dark:bg-card"
                }`}
                aria-label="Use my current location"
              >
                {geoLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : location ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Locate className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {location ? "Location active" : "Use my location"}
                </span>
              </button>

              {/* Mobile sidebar toggle */}
              <button
                className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary lg:hidden dark:bg-card"
                onClick={() => setShowSidebar(!showSidebar)}
                aria-label="Toggle filters panel"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {showSidebar ? "Hide panel" : "Show panel"}
                </span>
                <List className="h-4 w-4 sm:hidden" />
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          <AnimatePresence>
            {chips.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap items-center gap-2 border-t border-border/40 pt-3 mt-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Active:
                  </span>
                  {chips.map((c) => (
                    <motion.span
                      key={c.label}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                    >
                      {c.label}
                      <button
                        onClick={c.onRemove}
                        className="ml-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full transition-colors hover:bg-primary/25"
                        aria-label={`Remove filter: ${c.label}`}
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </motion.span>
                  ))}
                  <button
                    onClick={() => setFilters(defaultFilters)}
                    className="rounded-full px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-destructive"
                  >
                    Clear all
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Main Layout: Sidebar + Map ───────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 372, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex flex-col overflow-hidden border-r border-border/60 bg-[hsl(210_33%_97%)] dark:bg-background"
              style={{ minWidth: 0 }}
            >
              <div
                className="flex h-full flex-col overflow-y-auto"
                style={{ width: 372 }}
              >
                {/* Inner scroll container with padding */}
                <div className="flex flex-col gap-4 p-4">

                  {/* Filter Panel */}
                  <FilterPanel
                    value={filters}
                    onChange={setFilters}
                    onReset={() => setFilters(defaultFilters)}
                  />

                  {/* Results Section */}
                  <div className="overflow-hidden rounded-2xl border border-border/60 bg-white/95 shadow-[0_4px_24px_-4px_hsl(217_91%_40%_/_0.08)] dark:bg-card/95">
                    {/* Results header */}
                    <div className="flex items-center justify-between border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="font-heading text-sm font-bold text-foreground">
                          Results
                        </span>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                        {mergedProperties.length}
                      </span>
                    </div>

                    <div className="p-3">
                      {/* Loading state */}
                      {propertiesLoading && (
                        <div className="flex flex-col items-center justify-center gap-3 py-14">
                          <div className="relative flex h-10 w-10 items-center justify-center">
                            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          </div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Finding properties…
                          </p>
                        </div>
                      )}

                      {/* Empty state */}
                      {!propertiesLoading && mergedProperties.length === 0 && (
                        <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                            <MapPin className="h-7 w-7 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-heading text-sm font-semibold text-foreground">
                              No properties found
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Try adjusting filters or panning the map
                            </p>
                          </div>
                          <button
                            onClick={() => setFilters(defaultFilters)}
                            className="mt-1 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                          >
                            Reset filters
                          </button>
                        </div>
                      )}

                      {/* Property cards */}
                      <div className="space-y-3">
                        {mergedProperties.map((property) => (
                          <motion.div
                            key={property.id}
                            layout
                            className={`cursor-pointer rounded-xl outline outline-2 outline-offset-1 transition-all duration-200 ${
                              selectedPropertyId === property.id
                                ? "outline-primary shadow-[0_0_0_3px_hsl(217_91%_50%_/_0.15)]"
                                : "outline-transparent hover:outline-border hover:shadow-sm"
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
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── Map Area ─────────────────────────────────────────────────── */}
        <div className="relative flex flex-1 items-stretch p-3 lg:p-4">
          {/* Map container — elevated card feel */}
          <div className="relative flex-1 overflow-hidden rounded-2xl shadow-[0_8px_40px_-8px_hsl(217_91%_30%_/_0.2),_0_2px_8px_hsl(217_91%_30%_/_0.08)] ring-1 ring-border/50">

            {/* Loading overlay */}
            {propertiesLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-sm dark:bg-background/60">
                <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-white/95 px-5 py-3.5 shadow-xl dark:bg-card">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Loading properties…
                  </span>
                </div>
              </div>
            )}

            {/* The actual map */}
            <PropertyMap
              properties={mergedProperties}
              userLocation={location}
              height="100%"
              onBoundsChange={handleBoundsChange}
            />

            {/* Desktop sidebar toggle — pill button on map edge */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="absolute left-3 top-3 z-10 hidden items-center gap-1.5 rounded-xl border border-white/80 bg-white/95 px-3.5 py-2 text-xs font-semibold text-foreground shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-primary hover:text-white hover:shadow-[0_4px_14px_hsl(217_91%_50%_/_0.4)] lg:flex dark:border-border/60 dark:bg-card/95 dark:text-foreground"
              aria-label={showSidebar ? "Hide sidebar" : "Show sidebar"}
            >
              {showSidebar ? (
                <>
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Hide
                </>
              ) : (
                <>
                  <ChevronRight className="h-3.5 w-3.5" />
                  Show
                </>
              )}
            </button>

            {/* Property count pill — bottom center */}
            <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/95 px-4 py-2 text-xs font-bold text-foreground shadow-[0_4px_20px_hsl(0_0%_0%_/_0.12)] backdrop-blur-md dark:border-border/60 dark:bg-card/95">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                {mergedProperties.length} properties on map
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MapSearch;
import { useState, useEffect, useMemo } from "react";
import { Search, SlidersHorizontal, Grid3X3, Map, Navigation, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { propertyService, type Property } from "@/services/propertyService";
import { motion } from "framer-motion";
import { PropertyMap } from "@/components/PropertyMap";
import { useGeolocation, distanceKm } from "@/hooks/useGeolocation";
import { useDebounce } from "@/hooks/useDebounce";

type SortOption = "newest" | "price-low" | "price-high";
type ViewMode = "grid" | "map";

const Properties = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [bedroomsFilter, setBedroomsFilter] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [radius, setRadius] = useState<string>("");
  const { location, loading: geoLoading, request: requestLocation } = useGeolocation();
  const [mapPosition, setMapPosition] = useState<{ lat: number; lng: number; radiusKm: number } | null>(null);

  // Debounce search input — waits 300ms after user stops typing
  const debouncedSearch = useDebounce(search, 300);

  // Fetch properties from API whenever filters change
  const [apiData, setApiData] = useState<Property[]>([]);
  const [apiLoading, setApiLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setApiLoading(true);

    const params: Record<string, string | number> = {};
    if (debouncedSearch) params.query = debouncedSearch;
    if (typeFilter) params.type = typeFilter;
    if (bedroomsFilter) params.bedrooms = Number(bedroomsFilter);
    if (priceFilter) {
      const [min, max] = priceFilter.split("-").map(Number);
      if (min) params.minPrice = min;
      if (max) params.maxPrice = max;
    }

    propertyService.list(params).then((results) => {
      if (!alive) return;
      setApiData(results);
      setApiLoading(false);
    }).catch(() => {
      if (!alive) return;
      setApiData([]);
      setApiLoading(false);
    });

    return () => { alive = false; };
  }, [debouncedSearch, typeFilter, priceFilter, bedroomsFilter]);

  // Dynamically load properties in the visible map area as the user pans/zooms
  useEffect(() => {
    if (viewMode !== "map" || !mapPosition) return;

    let alive = true;
    // Cap query radius between 1km and 50km
    const queryRadius = Math.max(1, Math.min(mapPosition.radiusKm, 50));
    propertyService
      .nearby(mapPosition.lat, mapPosition.lng, queryRadius)
      .then((results) => {
        if (!alive) return;
        setApiData((prev) => {
          const propertyMap = new Map<string, Property>();
          prev.forEach((p) => propertyMap.set(p.id, p));
          results.forEach((p) => propertyMap.set(p.id, p));
          return Array.from(propertyMap.values());
        });
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, [mapPosition, viewMode]);

  // Client-side: radius filter + sorting
  const filtered = useMemo(() => {
    let result = [...apiData];

    if (location && radius) {
      const r = parseInt(radius);
      result = result.filter((p) => distanceKm(location, { lat: p.lat, lng: p.lng }) <= r);
    }

    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    else if (location) {
      // default sort: by distance when location is available
      result.sort(
        (a, b) =>
          distanceKm(location, { lat: a.lat, lng: a.lng }) -
          distanceKm(location, { lat: b.lat, lng: b.lng }),
      );
    }

    return result;
  }, [apiData, sortBy, location, radius]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 font-heading text-3xl font-bold">Browse Properties</h1>
          <p className="text-muted-foreground">
            {filtered.length} properties available
          </p>
        </div>

        {/* Search & Controls */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-card px-4 py-3 shadow-card">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={requestLocation}
              disabled={geoLoading}
            >
              {geoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
              {location ? "Near me" : "Use my location"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
            <div className="flex rounded-lg border border-border">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className="h-9 w-9 rounded-r-none"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "ghost"}
                size="icon"
                className="h-9 w-9 rounded-l-none"
                onClick={() => setViewMode("map")}
              >
                <Map className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="mb-6 overflow-hidden rounded-xl bg-card p-4 shadow-card"
          >
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="studio">Studio</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="house">House</option>
                  <option value="loft">Loft</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Price Range</label>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Any Price</option>
                  <option value="0-1500">Up to $1,500</option>
                  <option value="1500-3000">$1,500 - $3,000</option>
                  <option value="3000-10000">$3,000 - $10,000</option>
                  <option value="10000-99999999">$10,000+</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Bedrooms</label>
                <select
                  value={bedroomsFilter}
                  onChange={(e) => setBedroomsFilter(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Radius</label>
                <select
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  disabled={!location}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                >
                  <option value="">Any distance</option>
                  <option value="5">Within 5 km</option>
                  <option value="10">Within 10 km</option>
                  <option value="25">Within 25 km</option>
                  <option value="50">Within 50 km</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Active filter chips */}
        {(() => {
          const chips: { label: string; onRemove: () => void }[] = [];
          if (typeFilter) chips.push({ label: `Type: ${typeFilter}`, onRemove: () => setTypeFilter("") });
          if (priceFilter) {
            const [min, max] = priceFilter.split("-").map(Number);
            const label = max >= 99999999 ? `$${(min/1000).toFixed(0)}k+` : `$${(min/1000).toFixed(0)}k – $${(max/1000).toFixed(0)}k`;
            chips.push({ label: `Price: ${label}`, onRemove: () => setPriceFilter("") });
          }
          if (bedroomsFilter) chips.push({ label: `${bedroomsFilter}+ beds`, onRemove: () => setBedroomsFilter("") });
          if (radius && location) chips.push({ label: `Within ${radius} km`, onRemove: () => setRadius("") });
          if (debouncedSearch) chips.push({ label: `"${debouncedSearch}"`, onRemove: () => setSearch("") });

          if (chips.length === 0) return null;
          return (
            <div className="mb-6 flex flex-wrap gap-2">
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
                onClick={() => { setTypeFilter(""); setPriceFilter(""); setBedroomsFilter(""); setRadius(""); setSearch(""); }}
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all
              </button>
            </div>
          );
        })()}

        {/* Results */}
        {viewMode === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((property, i) => (
              <PropertyCard
                key={property.id}
                property={property}
                index={i}
                distance={
                  location
                    ? distanceKm(location, { lat: property.lat, lng: property.lng })
                    : null
                }
              />
            ))}
          </div>
        ) : (
          <PropertyMap
            properties={filtered}
            userLocation={location}
            height="70vh"
            onBoundsChange={(center, radiusKm) => setMapPosition({ lat: center.lat, lng: center.lng, radiusKm })}
          />
          )}

        {filtered.length === 0 && (
          <div className="flex h-60 items-center justify-center">
            <div className="text-center">
              <Search className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <p className="font-semibold">No properties found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Properties;

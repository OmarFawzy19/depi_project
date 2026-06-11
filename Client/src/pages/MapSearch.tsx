import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PropertyMap } from "@/components/PropertyMap";
import { FilterPanel } from "@/components/FilterPanel";
import { Button } from "@/components/ui/button";
import { Locate } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useProperties } from "@/hooks/useProperties";
import type { PropertyFilters } from "@/types/Property";

const MapSearch = () => {
  const [filters, setFilters] = useState<PropertyFilters>({ priceType: "all", radiusKm: 25 });
  const { location, request, loading } = useGeolocation();
  const { properties } = useProperties(filters, location);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold">Map Search</h1>
            <p className="text-sm text-muted-foreground">{properties.length} properties on map</p>
          </div>
          <Button onClick={request} disabled={loading} variant="outline">
            <Locate className="h-4 w-4" /> {loading ? "Locating..." : "Use my location"}
          </Button>
        </div>
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <FilterPanel value={filters} onChange={setFilters} onReset={() => setFilters({ priceType: "all", radiusKm: 25 })} />
          <PropertyMap properties={properties} userLocation={location} height="70vh" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MapSearch;
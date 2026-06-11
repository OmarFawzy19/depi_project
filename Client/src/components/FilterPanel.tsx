import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { PropertyFilters } from "@/types/Property";

interface FilterPanelProps {
  value: PropertyFilters;
  onChange: (next: PropertyFilters) => void;
  onReset?: () => void;
}

const types = ["all", "apartment", "villa", "studio", "penthouse", "house", "loft"];

export function FilterPanel({ value, onChange, onReset }: FilterPanelProps) {
  const set = (patch: Partial<PropertyFilters>) => onChange({ ...value, ...patch });

  return (
    <aside className="space-y-5 rounded-2xl bg-card p-5 shadow-card">
      <h3 className="font-heading text-lg font-semibold">Filters</h3>

      <div className="space-y-2">
        <Label>Listing</Label>
        <div className="flex gap-2">
          {(["all", "rent", "sale"] as const).map((t) => (
            <Button
              key={t}
              size="sm"
              variant={value.priceType === t ? "default" : "outline"}
              onClick={() => set({ priceType: t })}
              className="flex-1 capitalize"
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Property type</Label>
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <Button
              key={t}
              size="sm"
              variant={value.type === t || (!value.type && t === "all") ? "default" : "outline"}
              onClick={() => set({ type: t })}
              className="capitalize"
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Min price</Label>
          <Input
            type="number"
            value={value.minPrice ?? ""}
            onChange={(e) => set({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
        <div className="space-y-1">
          <Label>Max price</Label>
          <Input
            type="number"
            value={value.maxPrice ?? ""}
            onChange={(e) => set({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label>Min bedrooms</Label>
        <Input
          type="number"
          min={0}
          value={value.bedrooms ?? ""}
          onChange={(e) => set({ bedrooms: e.target.value ? Number(e.target.value) : undefined })}
        />
      </div>

      {onReset && (
        <Button variant="outline" className="w-full" onClick={onReset}>
          Reset filters
        </Button>
      )}
    </aside>
  );
}
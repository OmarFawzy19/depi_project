import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { PropertyFilters } from "@/types/Property";
import { Home, Building2, LayoutPanelLeft, TrendingUp, Warehouse, Hotel, RotateCcw, DollarSign, BedDouble, Tag } from "lucide-react";

interface FilterPanelProps {
  value: PropertyFilters;
  onChange: (next: PropertyFilters) => void;
  onReset?: () => void;
}

const types = ["all", "apartment", "villa", "studio", "penthouse", "house", "loft"];

const typeIcons: Record<string, React.ReactNode> = {
  all: <LayoutPanelLeft className="h-3.5 w-3.5" />,
  apartment: <Building2 className="h-3.5 w-3.5" />,
  villa: <Home className="h-3.5 w-3.5" />,
  studio: <Hotel className="h-3.5 w-3.5" />,
  penthouse: <TrendingUp className="h-3.5 w-3.5" />,
  house: <Home className="h-3.5 w-3.5" />,
  loft: <Warehouse className="h-3.5 w-3.5" />,
};

export function FilterPanel({ value, onChange, onReset }: FilterPanelProps) {
  const set = (patch: Partial<PropertyFilters>) => onChange({ ...value, ...patch });

  return (
    <aside className="space-y-0 overflow-hidden rounded-2xl border border-border/60 bg-white/95 shadow-[0_4px_24px_-4px_hsl(217_91%_40%_/_0.12),_0_1px_4px_hsl(217_91%_40%_/_0.06)] backdrop-blur-xl dark:bg-card/95">

      {/* Panel Header */}
      <div className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
            <Tag className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold text-foreground">Filters</h3>
            <p className="text-[11px] text-muted-foreground">Refine your search</p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        {/* Listing Type */}
        <div className="space-y-2.5">
          <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Listing Type
          </Label>
          <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-muted/60 p-1">
            {(["all", "rent", "sale"] as const).map((t) => (
              <button
                key={t}
                onClick={() => set({ priceType: t })}
                className={`relative flex items-center justify-center rounded-lg py-2 text-xs font-semibold capitalize transition-all duration-200 ${
                  value.priceType === t
                    ? "bg-white text-primary shadow-sm dark:bg-card"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "all" && "All"}
                {t === "rent" && "For Rent"}
                {t === "sale" && "For Sale"}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/50" />

        {/* Property Type */}
        <div className="space-y-2.5">
          <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Property Type
          </Label>
          <div className="flex flex-wrap gap-1.5">
            {types.map((t) => {
              const isActive = value.type === t || (!value.type && t === "all");
              return (
                <button
                  key={t}
                  onClick={() => set({ type: t })}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-all duration-200 hover:scale-105 active:scale-100 ${
                    isActive
                      ? "border-primary/30 bg-primary text-white shadow-[0_2px_8px_hsl(217_91%_50%_/_0.35)]"
                      : "border-border/70 bg-background text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  {typeIcons[t]}
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/50" />

        {/* Price Range */}
        <div className="space-y-2.5">
          <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <DollarSign className="h-3.5 w-3.5" />
            Price Range
          </Label>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="group space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">Min Price</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                <Input
                  type="number"
                  placeholder="0"
                  value={value.minPrice ?? ""}
                  onChange={(e) => set({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-9 rounded-xl border-border/60 pl-6 text-xs transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>
            <div className="group space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">Max Price</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                <Input
                  type="number"
                  placeholder="Any"
                  value={value.maxPrice ?? ""}
                  onChange={(e) => set({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-9 rounded-xl border-border/60 pl-6 text-xs transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/50" />

        {/* Bedrooms */}
        <div className="space-y-2.5">
          <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <BedDouble className="h-3.5 w-3.5" />
            Min Bedrooms
          </Label>
          <div className="flex gap-1.5">
            {[null, 1, 2, 3, 4, 5].map((n) => (
              <button
                key={n ?? "any"}
                onClick={() => set({ bedrooms: n ?? undefined })}
                className={`flex h-9 flex-1 items-center justify-center rounded-xl border text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-100 ${
                  (n === null ? value.bedrooms === undefined : value.bedrooms === n)
                    ? "border-primary/30 bg-primary text-white shadow-[0_2px_8px_hsl(217_91%_50%_/_0.3)]"
                    : "border-border/60 bg-background text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                }`}
              >
                {n === null ? "Any" : n === 5 ? "5+" : n}
              </button>
            ))}
          </div>
        </div>

        {/* Reset */}
        {onReset && (
          <button
            onClick={onReset}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 py-2.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset all filters
          </button>
        )}
      </div>
    </aside>
  );
}
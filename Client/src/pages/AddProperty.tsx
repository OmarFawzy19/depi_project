import { useState } from "react";
import { Upload, MapPin, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PropertyMap } from "@/components/PropertyMap";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AddProperty = () => {
  const [point, setPoint] = useState<{ lat: number; lng: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!point) {
      toast({ title: "Pick a location on the map", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast({ title: "Listing submitted", description: "Your property is now under review." });
      navigate("/properties");
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">For owners</p>
          <h1 className="font-heading text-3xl font-bold">List your property</h1>
          <p className="text-muted-foreground">Reach buyers and renters near your location.</p>
        </div>

        <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl bg-card p-6 shadow-card">
              <h2 className="mb-4 font-heading text-lg font-semibold">Photos</h2>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/40 p-10 text-center transition hover:bg-muted">
                <Upload className="mb-2 h-8 w-8 text-primary" />
                <p className="font-semibold">Click to upload images</p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                <input type="file" accept="image/*" multiple className="hidden" />
              </label>
            </div>

            <div className="rounded-2xl bg-card p-6 shadow-card">
              <h2 className="mb-4 font-heading text-lg font-semibold">Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Title"><input required className={inputCls} placeholder="Modern City Apartment" /></Field>
                <Field label="Type">
                  <select className={inputCls} defaultValue="apartment">
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="studio">Studio</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="house">House</option>
                    <option value="loft">Loft</option>
                  </select>
                </Field>
                <Field label="Price (USD)"><input required type="number" className={inputCls} placeholder="2500" /></Field>
                <Field label="Listing">
                  <select className={inputCls} defaultValue="rent">
                    <option value="rent">For rent</option>
                    <option value="sale">For sale</option>
                  </select>
                </Field>
                <Field label="Bedrooms"><input type="number" min={0} className={inputCls} placeholder="2" /></Field>
                <Field label="Bathrooms"><input type="number" min={0} className={inputCls} placeholder="2" /></Field>
                <Field label="Area (m²)" full><input type="number" className={inputCls} placeholder="120" /></Field>
                <Field label="Description" full>
                  <textarea rows={4} className={inputCls} placeholder="Bright apartment with city views…" />
                </Field>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-card p-6 shadow-card">
              <h2 className="mb-2 font-heading text-lg font-semibold">Pin location</h2>
              <p className="mb-3 text-xs text-muted-foreground">Click on the map to place your property.</p>
              <PropertyMap
                properties={[]}
                selectable
                onSelect={(lat, lng) => setPoint({ lat, lng })}
                selectedPoint={point}
                height="320px"
              />
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                {point ? `${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}` : "No location selected"}
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full gap-2" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit listing
            </Button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

export default AddProperty;
import { motion } from "framer-motion";
import { MapPin, Search, MessageSquare, Heart, ArrowRight, Loader2, Navigation } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { SearchBar } from "@/components/SearchBar";
import { useProperties } from "@/hooks/useProperties";
import { PropertyMap } from "@/components/PropertyMap";
import { useGeolocation } from "@/hooks/useGeolocation";
import heroBg from "@/assets/hero-bg.jpg";

const steps = [
  {
    icon: Search,
    title: "Search Nearby",
    description: "Find properties near your current location with our smart geolocation search.",
  },
  {
    icon: Heart,
    title: "Save Favorites",
    description: "Bookmark the properties you love and compare them side by side.",
  },
  {
    icon: MessageSquare,
    title: "Contact Owner",
    description: "Chat directly with property owners — no agents, no fees.",
  },
];

const Index = () => {
  const { properties: allProperties, loading: propertiesLoading } = useProperties();
  const featured = allProperties.slice(0, 6);
  const { location, loading, error, request } = useGeolocation();

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Modern building" width={1920} height={1080} className="h-full w-full object-cover" />
        </div>
        <div className="container relative z-10 mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <h1 className="mb-4 font-heading text-4xl font-extrabold leading-tight text-primary-foreground md:text-6xl">
              Find Your Perfect <br />
              <span className="bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent">Place Nearby</span>
            </h1>
            <p className="mb-8 text-lg text-primary-foreground/80">
              Discover properties for rent or sale near your location. Connect directly with owners — no intermediaries.
            </p>
            <SearchBar />
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 rounded-xl"
                onClick={request}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                {location ? "Location detected" : "Use my location"}
              </Button>
              {error && <span className="text-sm text-primary-foreground/80">{error}</span>}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-primary">Nearby</p>
              <h2 className="font-heading text-3xl font-bold">Properties around you</h2>
              <p className="text-muted-foreground">Live map of available listings on the platform.</p>
            </div>
            <Button variant="outline" className="gap-2" onClick={request} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
              {location ? "Recenter" : "Use my location"}
            </Button>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-card">
            <PropertyMap properties={allProperties} userLocation={location} height="460px" />
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-primary">Featured</p>
              <h2 className="font-heading text-3xl font-bold">Popular Properties</h2>
            </div>
            <Link to="/properties">
              <Button variant="ghost" className="gap-1 text-primary">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-primary">Simple & Fast</p>
            <h2 className="font-heading text-3xl font-bold">How Makany Works</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="rounded-2xl bg-card p-8 text-center shadow-card"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent">
                  <step.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="mb-2 font-heading text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Preview CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="overflow-hidden rounded-2xl bg-gradient-primary p-8 shadow-glow md:flex md:items-center md:justify-between md:p-12">
            <div className="mb-6 md:mb-0">
              <h2 className="mb-2 font-heading text-2xl font-bold text-primary-foreground md:text-3xl">
                Explore on the Map
              </h2>
              <p className="text-primary-foreground/80">
                See all available properties near you with our interactive map view.
              </p>
            </div>
            <Link to="/properties">
              <Button size="lg" variant="secondary" className="gap-2">
                <MapPin className="h-5 w-5" /> Open Map View
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

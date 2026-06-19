import { motion } from "framer-motion";
import { ArrowRight, Heart, Loader2, MapPin, Navigation, Search, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { useProperties } from "@/hooks/useProperties";
import { PropertyMap } from "@/components/PropertyMap";
import { useGeolocation } from "@/hooks/useGeolocation";
import heroBg from "@/assets/hero-bg.jpg";

const steps = [
  {
    icon: Search,
    title: "Explore Listings",
    description: "Browse apartments, villas, and homes with a clean, location-aware discovery experience.",
  },
  {
    icon: Heart,
    title: "Save Favorites",
    description: "Keep the places you love close by and compare your shortlist with less friction.",
  },
  {
    icon: ShieldCheck,
    title: "Move With Confidence",
    description: "Review verified listings and connect directly with property owners when you are ready.",
  },
];

const HomeLanding = () => {
  const { properties: allProperties } = useProperties();
  const featured = allProperties.slice(0, 6);
  const { location, loading, request } = useGeolocation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative isolate flex min-h-[78vh] items-center overflow-hidden">
        <img
          src={heroBg}
          alt="Modern building"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-slate-950/20" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="container relative z-10 mx-auto flex w-full px-4 py-24 sm:py-28 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mx-auto flex max-w-3xl flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left"
          >
            <h1 className="max-w-3xl font-heading text-4xl font-extrabold leading-[1.08] tracking-normal text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              Find Your Perfect Place
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
              Discover apartments, villas, and homes available for rent or sale near you. Connect directly with
              property owners and explore verified listings.
            </p>

            <div className="mt-9 flex justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="group h-auto rounded-xl px-7 py-4 text-base font-semibold shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <Link to="/properties">
                  Browse Properties
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-sm font-semibold uppercase tracking-normal text-primary">Nearby</p>
              <h2 className="font-heading text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
                Properties around you
              </h2>
              <p className="mt-2 text-muted-foreground">A live map of available listings across Makany.</p>
            </div>
            <Button variant="outline" className="w-fit gap-2 rounded-xl" onClick={request} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
              {location ? "Recenter" : "Use my location"}
            </Button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-card p-2 shadow-card">
            <PropertyMap properties={allProperties} userLocation={location} height="min(64vh, 520px)" />
          </div>
        </div>
      </section>

      <section className="bg-gradient-soft py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-normal text-primary">Featured</p>
              <h2 className="font-heading text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
                Popular Properties
              </h2>
            </div>
            <Button asChild variant="ghost" className="w-fit gap-1 rounded-xl text-primary">
              <Link to="/properties">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-normal text-primary">Simple and Fast</p>
            <h2 className="font-heading text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
              How Makany Works
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="rounded-2xl border border-border/70 bg-card p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                  <step.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="mb-2 font-heading text-lg font-semibold tracking-normal">{step.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 pt-4">
        <div className="container mx-auto px-4">
          <div className="overflow-hidden rounded-2xl bg-gradient-primary p-8 shadow-glow sm:p-10 md:flex md:items-center md:justify-between md:gap-8">
            <div className="mb-6 max-w-2xl md:mb-0">
              <h2 className="mb-2 font-heading text-2xl font-bold tracking-normal text-primary-foreground md:text-3xl">
                Explore on the Map
              </h2>
              <p className="text-primary-foreground/80">
                See available properties in context and discover neighborhoods that fit your lifestyle.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary" className="w-fit gap-2 rounded-xl">
              <Link to="/properties">
                <MapPin className="h-5 w-5" /> Open Map View
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomeLanding;

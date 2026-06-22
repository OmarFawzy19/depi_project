import { motion } from "framer-motion";
import { useCallback } from "react";
import { ArrowRight, Building2, ChevronDown, Heart, Loader2, MapPin, Navigation, Search, ShieldCheck, Star, Users } from "lucide-react";
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

const stats = [
  { icon: Building2, value: "2,400+", label: "Active Listings" },
  { icon: Users, value: "18,000+", label: "Happy Renters" },
  { icon: MapPin, value: "30+", label: "Cities Covered" },
  { icon: Star, value: "4.9", label: "Average Rating" },
];

const values = [
  {
    title: "Transparency First",
    description: "Every listing is verified by our team. No hidden fees, no surprises — just honest information you can trust.",
    gradient: "from-blue-500/10 to-cyan-500/10",
    accent: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  },
  {
    title: "Owner Direct",
    description: "We cut out the middleman. Contact landlords and sellers directly for faster, smoother conversations.",
    gradient: "from-violet-500/10 to-purple-500/10",
    accent: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  },
  {
    title: "Built for Egypt",
    description: "Makany is designed around local neighborhoods, Arabic-speaking communities, and Egyptian real-estate norms.",
    gradient: "from-emerald-500/10 to-teal-500/10",
    accent: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
];

const HomeLanding = () => {
  const { properties: allProperties } = useProperties();
  const featured = allProperties.slice(0, 6);
  const { location, loading, request } = useGeolocation();

  const scrollToAbout = useCallback(() => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

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

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
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

              <Button
                variant="outline"
                size="lg"
                onClick={scrollToAbout}
                className="group h-auto rounded-xl border-white/30 bg-white/10 px-7 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20 hover:-translate-y-0.5"
              >
                Our Story
                <ChevronDown className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-0.5" />
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

      {/* ── About Section ── */}
      <section id="about" className="py-16 sm:py-24 overflow-hidden">
        <div className="container mx-auto px-4">

          {/* Heading block */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="mx-auto mb-10 max-w-3xl text-center"
          >
            {/* Decorative pill badge */}
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Who We Are
            </span>

            <h2 className="mt-3 font-heading text-3xl font-bold tracking-normal text-foreground sm:text-5xl">
              About{" "}
              <span className="text-gradient">Makany</span>
            </h2>

            <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Makany — Arabic for <em>&ldquo;My Place&rdquo;</em> — is Egypt&rsquo;s modern real-estate marketplace
              born out of one simple frustration: finding a home felt harder than it should be.
              We set out to change that.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Launched in 2026, we bring verified listings, map-first discovery, and direct
              owner contact together in one beautifully simple platform — serving renters,
              buyers, and landlords across 30+ Egyptian cities.
            </p>
          </motion.div>

          {/* Pull-quote strip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-14 overflow-hidden rounded-2xl bg-gradient-primary p-px shadow-glow"
          >
            <div className="rounded-[calc(1rem-1px)] bg-card/95 px-8 py-7 backdrop-blur-sm sm:px-12 sm:py-8">
              <p className="text-center font-heading text-xl font-semibold leading-relaxed text-foreground sm:text-2xl">
                &ldquo;We believe every Egyptian deserves to find their perfect place —
                without the hassle, without the middlemen, and without the guesswork.&rdquo;
              </p>
              <p className="mt-3 text-center text-sm text-muted-foreground">— The Makany Team</p>
            </div>
          </motion.div>

          {/* Stats strip */}
          <div className="mb-16 grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-3 rounded-2xl border border-border/70 bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
                  <stat.icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <p className="font-heading text-3xl font-extrabold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Mission + Values side-by-side */}
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">

            {/* Left — mission copy */}
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            >
              <p className="mb-2 text-sm font-semibold uppercase tracking-normal text-primary">Our Mission</p>
              <h3 className="mb-5 font-heading text-2xl font-bold tracking-normal text-foreground sm:text-3xl">
                Making home-finding human again
              </h3>
              <p className="mb-4 text-base leading-7 text-muted-foreground">
                We believe finding a home should feel exciting, not exhausting. That&rsquo;s why we built a platform
                that puts people first — transparent listings, real owners, and a map-driven discovery experience
                that lets you explore neighborhoods the way you actually live in them.
              </p>
              <p className="text-base leading-7 text-muted-foreground">
                Whether you&rsquo;re a first-time renter or a seasoned investor, Makany gives you the tools to search
                smarter, compare faster, and move with complete confidence.
              </p>
            </motion.div>

            {/* Right — value cards */}
            <div className="flex flex-col gap-4">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, x: 28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.55, ease: "easeOut" }}
                  className={`rounded-2xl border border-border/70 bg-gradient-to-br ${v.gradient} p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover`}
                >
                  <span className={`mb-3 inline-block rounded-lg px-2.5 py-1 text-xs font-semibold ${v.accent}`}>
                    {v.title}
                  </span>
                  <p className="text-sm leading-6 text-muted-foreground">{v.description}</p>
                </motion.div>
              ))}
            </div>
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

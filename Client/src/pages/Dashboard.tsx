import { motion } from "framer-motion";
import {
  Heart,
  MessageSquare,
  Search,
  Plus,
  Navigation,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PropertyMap } from "@/components/PropertyMap";
import { useProperties } from "@/hooks/useProperties";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAuth } from "@/hooks/AuthContext";

const recentSearches = [
  "Apartments in Zamalek",
  "Villas under $1M",
  "Studios in Maadi",
];

const Dashboard = () => {
  const { user } = useAuth();
  const { properties: allProperties } = useProperties();
  const saved = allProperties.slice(0, 3);
  const { location, loading, request } = useGeolocation();

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Welcome back
            </p>
            <h1 className="font-heading text-3xl font-bold">
              Hi, {user?.name || "User"} 👋
            </h1>
            <p className="text-muted-foreground">
              Your nearby properties and activity at a glance.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={request}
              disabled={loading}
              className="gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
              {location ? "Recenter" : "Use my location"}
            </Button>

            <Link to="/add-property">
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add property
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Heart,
              label: "Saved",
              value: saved.length,
              to: "/favorites",
            },
            {
              icon: MessageSquare,
              label: "Messages",
              value: 4,
              to: "/messages",
            },
            {
              icon: Search,
              label: "Searches",
              value: recentSearches.length,
              to: "/properties",
            },
          ].map((s) => (
            <Link
              key={s.label}
              to={s.to}
              className="rounded-2xl bg-card p-5 shadow-card transition hover:shadow-card-hover"
            >
              <s.icon className="mb-3 h-6 w-6 text-primary" />
              <p className="font-heading text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </Link>
          ))}
        </div>

        <div className="mb-10">
          <h2 className="mb-4 font-heading text-xl font-semibold">
            Nearby properties
          </h2>
          <PropertyMap
            properties={allProperties}
            userLocation={location}
            height="380px"
          />
        </div>

        <div>
          <h2 className="mb-4 font-heading text-xl font-semibold">
            Recent searches
          </h2>

          <div className="flex flex-wrap gap-2">
            {recentSearches.map((q) => (
              <Link
                key={q}
                to="/properties"
                className="rounded-full bg-card px-4 py-2 text-sm shadow-card hover:shadow-card-hover"
              >
                {q}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;

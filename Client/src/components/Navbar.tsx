import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MapPin, Menu, X, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/AuthContext";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Properties", path: "/properties" },
  { label: "Map", path: "/map" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Messages", path: "/messages" },
  { label: "Favorites", path: "/favorites" },
];

export function Navbar({ hideAuth = false }: { hideAuth?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isOwner = user?.role === "owner";

  const links = isOwner
    ? [...navLinks, { label: "Owner Dashboard", path: "/owner-dashboard" }]
    : navLinks;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold text-gradient">
            Makany
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                location.pathname === link.path
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {!hideAuth && (
          <div className="hidden items-center gap-3 md:flex">
            <Link to="/favorites">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm">
                Log in
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>
    </nav>
  );
}

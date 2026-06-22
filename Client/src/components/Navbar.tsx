import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/AuthContext";
import { UserDropdown } from "@/components/UserDropdown";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Properties", path: "/properties" },
  { label: "Map", path: "/map" },
  { label: "Favorites", path: "/favorites" },
];

const isActivePath = (pathname: string, path: string) => {
  if (path === "/") return pathname === "/" || pathname === "/home";
  if (path === "/properties")
    return pathname === "/properties" || pathname.startsWith("/property/");
  if (path === "/my-properties")
    return pathname === "/my-properties" || pathname.startsWith("/edit-property/");
  return pathname === path;
};

export function Navbar({ hideAuth = false }: { hideAuth?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const links = user
    ? [...navLinks, { label: "My Properties", path: "/my-properties" }]
    : navLinks;

  return (
    <nav className="sticky top-0 z-50 border-b border-border/80 bg-card/90 shadow-sm backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold text-gradient">
            Makany
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {links.map((link) => {
            const active = isActivePath(location.pathname, link.path);

            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {!hideAuth && (
          <div className="hidden items-center gap-3 md:flex">
            {!user ? (
              <>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                >
                  <Link to="/login">Log in</Link>
                </Button>

                <Button asChild size="sm" className="rounded-xl">
                  <Link to="/register">Sign up</Link>
                </Button>
              </>
            ) : (
              <UserDropdown />
            )}
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border/80 bg-card/95 shadow-card backdrop-blur-xl md:hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="grid gap-1">
                {links.map((link) => {
                  const active = isActivePath(location.pathname, link.path);

                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {!hideAuth && (
                <div className="mt-4 border-t border-border pt-4">
                  {!user ? (
                    <div className="grid gap-2">
                      <Button asChild variant="outline" className="rounded-xl">
                        <Link to="/login" onClick={() => setMobileOpen(false)}>
                          Log in
                        </Link>
                      </Button>

                      <Button asChild className="rounded-xl">
                        <Link
                          to="/register"
                          onClick={() => setMobileOpen(false)}
                        >
                          Sign up
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      <Link
                        to="/account-settings"
                        onClick={() => setMobileOpen(false)}
                        className="rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        Account Settings
                      </Link>

                      <Button
                        variant="destructive"
                        className="rounded-xl"
                        onClick={() => {
                          logout();
                          setMobileOpen(false);
                        }}
                      >
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

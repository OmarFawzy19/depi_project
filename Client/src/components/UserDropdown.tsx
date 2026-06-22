import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  User,
  Settings,
  Shield,
  Home,
  Heart,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/hooks/AuthContext";

export function UserDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const menuItems = [
    {
      label: "My Profile",
      icon: User,
      path: "/account-settings",
      section: "profile",
    },
    {
      label: "Account Settings",
      icon: Settings,
      path: "/account-settings",
      section: "profile",
    },
    {
      label: "Security Settings",
      icon: Shield,
      path: "/account-settings?tab=security",
      section: "profile",
    },
    { type: "divider" as const },
    {
      label: "My Properties",
      icon: Home,
      path: "/my-properties",
      section: "nav",
    },
    {
      label: "Favorites",
      icon: Heart,
      path: "/favorites",
      section: "nav",
    },
  ];

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-sm font-semibold transition-all duration-200 hover:bg-accent"
        aria-expanded={open}
        aria-haspopup="true"
        id="user-dropdown-trigger"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-white">
          {initials}
        </div>
        <span className="hidden lg:inline">{user.name}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-card-hover backdrop-blur-xl"
            id="user-dropdown-menu"
          >
            {/* User Info Header */}
            <div className="border-b border-border/60 px-4 py-3">
              <p className="font-heading text-sm font-bold">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {menuItems.map((item, i) => {
                if ("type" in item && item.type === "divider") {
                  return (
                    <div
                      key={`divider-${i}`}
                      className="my-1 border-t border-border/60"
                    />
                  );
                }

                const menuItem = item as {
                  label: string;
                  icon: typeof User;
                  path: string;
                };

                return (
                  <Link
                    key={menuItem.label}
                    to={menuItem.path}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 transition-colors duration-150 hover:bg-accent hover:text-accent-foreground"
                  >
                    <menuItem.icon className="h-4 w-4 text-muted-foreground" />
                    {menuItem.label}
                  </Link>
                );
              })}
            </div>

            {/* Logout */}
            <div className="border-t border-border/60 py-1">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-destructive transition-colors duration-150 hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

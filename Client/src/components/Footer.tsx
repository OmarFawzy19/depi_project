import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <MapPin className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-heading text-lg font-bold">Makany</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Find your perfect property nearby. Connect directly with owners, no intermediaries.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-heading text-sm font-semibold">Explore</h4>
            <div className="flex flex-col gap-2">
              <Link to="/properties" className="text-sm text-muted-foreground hover:text-foreground">Properties</Link>
              <Link to="/map" className="text-sm text-muted-foreground hover:text-foreground">Map</Link>
              <Link to="/favorites" className="text-sm text-muted-foreground hover:text-foreground">Favorites</Link>
              <Link to="/my-properties" className="text-sm text-muted-foreground hover:text-foreground">My Properties</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-heading text-sm font-semibold">Company</h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">About Us</span>
              <span className="text-sm text-muted-foreground">Contact</span>
              <span className="text-sm text-muted-foreground">Careers</span>
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-heading text-sm font-semibold">Legal</h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Privacy Policy</span>
              <span className="text-sm text-muted-foreground">Terms of Service</span>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          © 2026 Makany. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

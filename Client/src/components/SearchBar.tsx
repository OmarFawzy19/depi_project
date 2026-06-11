import { Search, MapPin, DollarSign, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SearchBar() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");

  return (
    <div className="w-full max-w-3xl rounded-2xl bg-card p-2 shadow-card-hover">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-muted px-4 py-3">
          <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-muted px-4 py-3 sm:w-36">
          <Home className="h-4 w-4 shrink-0 text-muted-foreground" />
          <select className="w-full bg-transparent text-sm text-foreground focus:outline-none">
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="studio">Studio</option>
            <option value="house">House</option>
          </select>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-muted px-4 py-3 sm:w-36">
          <DollarSign className="h-4 w-4 shrink-0 text-muted-foreground" />
          <select className="w-full bg-transparent text-sm text-foreground focus:outline-none">
            <option value="">Any Price</option>
            <option value="0-1000">$0 - $1,000</option>
            <option value="1000-3000">$1K - $3K</option>
            <option value="3000-5000">$3K - $5K</option>
            <option value="5000+">$5K+</option>
          </select>
        </div>
        <Button
          size="lg"
          className="gap-2 rounded-xl px-6"
          onClick={() => navigate("/properties")}
        >
          <Search className="h-4 w-4" />
          <span className="sm:hidden lg:inline">Search</span>
        </Button>
      </div>
    </div>
  );
}

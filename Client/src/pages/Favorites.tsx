import { Heart } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Favorites = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-2 font-heading text-3xl font-bold">Favorites</h1>
        <p className="mb-8 text-muted-foreground">Your saved properties</p>

        <div className="flex h-80 flex-col items-center justify-center rounded-2xl bg-card shadow-card">
          <Heart className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-1 text-lg font-semibold">No saved properties yet</p>
          <p className="mb-4 text-sm text-muted-foreground">Start browsing and save properties you like</p>
          <Link to="/properties">
            <Button>Browse Properties</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Favorites;

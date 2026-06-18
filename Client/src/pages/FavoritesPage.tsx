import { Link } from "react-router-dom";
import { Heart, MapPin, Bed, Bath, Maximize, Trash2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import useFavorites from "../hooks/useFavourities";
import { removeFavorite } from "@/services/favoritesService";

function FavoritesPage() {
    const { favorites, loadFavorites } = useFavorites();

    const handleRemove = async (favoriteId: string) => {
        try {
            await removeFavorite(favoriteId);
            loadFavorites();
        } catch (error) {
            console.error("Failed to remove favorite", error);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="mb-2 font-heading text-3xl font-bold">Favorites</h1>
                    <p className="text-muted-foreground">Your saved properties.</p>
                </div>

                {favorites.length === 0 ? (
                    <div className="flex h-80 flex-col items-center justify-center rounded-2xl bg-card shadow-card">
                        <Heart className="mb-4 h-12 w-12 text-muted-foreground" />
                        <p className="mb-1 text-lg font-semibold">No saved properties yet</p>
                        <p className="mb-4 text-sm text-muted-foreground">Start browsing and save properties you like.</p>
                        <Link to="/properties">
                            <Button>Browse Properties</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {favorites.map((fav) => {
                            const property = fav.property;

                            return (
                                <article key={fav._id} className="overflow-hidden rounded-3xl bg-card shadow-card transition hover:-translate-y-1">
                                    <Link to={`/property/${property._id}`} className="block">
                                        <div className="relative h-56 overflow-hidden">
                                            <img
                                                src={property.images?.[0] ?? "/placeholder.svg"}
                                                alt={property.title}
                                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                            />
                                            <div className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground">
                                                {property.priceType === "rent" ? "Rent" : "Sale"}
                                            </div>
                                        </div>
                                    </Link>

                                    <div className="p-5">
                                        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            <span>{property.location}</span>
                                        </div>
                                        <Link to={`/property/${property._id}`} className="mb-3 block text-xl font-semibold text-foreground hover:text-primary">
                                            {property.title}
                                        </Link>
                                        <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">{property.description}</p>

                                        <div className="mb-4 grid gap-3 sm:grid-cols-2 text-sm text-muted-foreground">
                                            <span className="inline-flex items-center gap-2 rounded-2xl bg-muted px-3 py-2">
                                                <Bed className="h-4 w-4" /> {property.bedrooms} Beds
                                            </span>
                                            <span className="inline-flex items-center gap-2 rounded-2xl bg-muted px-3 py-2">
                                                <Bath className="h-4 w-4" /> {property.bathrooms} Baths
                                            </span>
                                            <span className="inline-flex items-center gap-2 rounded-2xl bg-muted px-3 py-2">
                                                <Maximize className="h-4 w-4" /> {property.area} m²
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-lg font-semibold text-foreground">
                                                    ${property.price.toLocaleString()}
                                                    {property.priceType === "rent" && <span className="ml-1 text-sm font-medium text-muted-foreground">/mo</span>}
                                                </p>
                                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{property.type}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link to={`/property/${property._id}`}>
                                                    <Button size="sm">View details</Button>
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleRemove(property._id)}
                                                    className="gap-2"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default FavoritesPage;
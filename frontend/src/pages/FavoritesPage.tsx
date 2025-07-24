import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Heart, Star } from "lucide-react";
import { useFavorites, useToggleFavorite } from "../hooks/useApi";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import StarRating from "../components/ui/StarRating";

const FavoritesPage: React.FC = () => {
  const { data: favorites, isLoading } = useFavorites();
  const toggleFavorite = useToggleFavorite();

  const handleUnfavorite = async (hotelId: string, favoriteId: string) => {
    try {
      await toggleFavorite(hotelId, true, favoriteId);
    } catch (error) {
      console.error("Failed to remove from favorites:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
            <p className="mt-2 text-gray-600">
              Hotels and accommodations you've saved for later
            </p>
          </div>
        </div>

        {favorites && favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav: any) => (
              <Card
                key={fav.id}
                hover
                className="overflow-hidden transition-all duration-200"
              >
                <div className="relative h-48">
                  <img
                    src={
                      fav.hotel.images?.[0]?.image || "/placeholder-hotel.jpg"
                    }
                    alt={fav.hotel.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleUnfavorite(fav.hotel.id, fav.id)}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors group"
                    title="Remove from wishlist"
                  >
                    <Heart className="w-6 h-6 text-red-500 fill-current group-hover:scale-110 transition-transform" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {fav.hotel.name}
                    </h3>
                    <span className="text-blue-600 font-bold">
                      ${fav.hotel.price_per_night}
                      <span className="text-sm text-gray-500">/night</span>
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {fav.hotel.address}
                  </div>
                  <div className="flex items-center mb-4">
                    <StarRating
                      rating={fav.hotel.stars || 0}
                      starClassName="h-4 w-4"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      ({fav.hotel.reviews?.length || 0} reviews)
                    </span>
                  </div>
                  <Link to={`/hotel/search/${fav.hotel.id}`}>
                    <Button className="w-full" variant="outline">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Start saving your favorite hotels for future trips
            </p>
            <Link to="/search">
              <Button>Discover Hotels</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;

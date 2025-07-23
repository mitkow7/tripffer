import { MapPin, Star, DollarSign, Heart, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Hotel } from "../../types/api";
import { useFavorites, useToggleFavorite } from "../../hooks/useApi";

interface SearchResultsProps {
  hotel: Hotel;
  nights: number;
}

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    );
  }
  return <div className="flex items-center">{stars}</div>;
};

const HotelImage = ({
  hotelName,
  photoUrl,
  hotelId,
}: {
  hotelName: string;
  photoUrl: string | null;
  hotelId: string;
}) => {
  const { data: favoritesData } = useFavorites();
  const toggleFavorite = useToggleFavorite();
  const favorites = favoritesData || [];
  const isFavorited = favorites.some((fav: any) => fav.hotel.id === hotelId);
  const favoriteId = favorites.find((fav: any) => fav.hotel.id === hotelId)?.id;

  return (
    <div className="relative h-56 w-full overflow-hidden">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={`Image of ${hotelName}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      ) : (
        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No Image Available</span>
        </div>
      )}
      <button
        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg hover:bg-red-100 transition-colors"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(hotelId, isFavorited, favoriteId);
        }}
      >
        <Heart
          className={`h-5 w-5 ${
            isFavorited ? "text-red-500 fill-current" : "text-gray-400"
          }`}
        />
      </button>
    </div>
  );
};

const SearchResults = ({ hotel, nights }: SearchResultsProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl group">
      <Link to={`/hotel/search/${hotel.id}`} className="block">
        <HotelImage
          hotelName={hotel.name}
          photoUrl={hotel.photo_url}
          hotelId={hotel.id}
        />
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-2xl font-bold text-gray-900 leading-tight">
              {hotel.name}
            </h3>
            {renderStars(hotel.stars)}
          </div>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="h-4 w-4 mr-2" />
            <p className="text-sm">
              {hotel.address || "Address not available"}
            </p>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div>
              <p className="text-sm text-gray-600">Price per night</p>
              <div className="flex items-center text-2xl font-bold text-gray-900">
                <DollarSign className="h-6 w-6 mr-1 text-green-500" />
                <span>{parseFloat(hotel.price_per_night).toFixed(2)}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Total for {nights} night{nights > 1 ? "s" : ""}
              </p>
              <div className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-800">
                View Details
                <ChevronRight className="ml-1 h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SearchResults;

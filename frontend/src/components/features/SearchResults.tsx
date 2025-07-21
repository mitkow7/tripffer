import {
  MapPin,
  Star,
  DollarSign,
  BedDouble,
  Users,
  Sparkles,
  Navigation,
} from "lucide-react";
import { Hotel } from "../../types/api";

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
}: {
  hotelName: string;
  photoUrl: string | null;
}) => (
  <div className="relative h-48 w-full overflow-hidden">
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
  </div>
);

const SearchResults = ({ hotel, nights }: SearchResultsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl group">
      <HotelImage hotelName={hotel.name} photoUrl={hotel.photo_url} />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
            <div className="flex items-center mt-1">
              <MapPin className="h-4 w-4 text-gray-500 mr-1" />
              <p className="text-sm text-gray-600">
                {hotel.address || "Address not available"}
              </p>
            </div>
            {hotel.distance_to_center && (
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <Navigation className="h-4 w-4 mr-1" />
                <span>{hotel.distance_to_center.toFixed(1)} km to center</span>
              </div>
            )}
          </div>
          <div className="flex-shrink-0 ml-4">
            {hotel.stars && renderStars(hotel.stars)}
          </div>
        </div>

        <div className="mt-2 flex items-center">
          {hotel.guestScore && (
            <div className="bg-blue-500 text-white rounded-full px-2 py-1 text-sm font-bold">
              {hotel.guestScore.toFixed(1)}
            </div>
          )}
        </div>

        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="mt-4 pt-2 border-t">
            <h4 className="font-semibold text-gray-800 mb-2">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities.slice(0, 5).map((amenity, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                >
                  {amenity.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-4 border-t">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-lg font-bold text-gray-800">
              <DollarSign className="h-5 w-5 mr-1 text-green-500" />
              <span>{hotel.price.toFixed(2)}</span>
            </div>
            <div className="text-sm text-gray-600">
              Total for {nights} night{nights > 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;

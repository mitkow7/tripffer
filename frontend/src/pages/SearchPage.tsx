import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Hotel } from "../types/api";
import HotelSearch from "../components/features/HotelSearch";
import HotelCardSkeleton from "../components/features/HotelCardSkeleton";
import SearchResults from "../components/features/SearchResults";

const SearchPage: React.FC = () => {
  const location = useLocation();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [nights, setNights] = useState(0);

  const handleSearch = async (searchParams: {
    city: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    rooms: number;
    currency: string;
    nights: number;
  }) => {
    setIsLoading(true);
    setError(null);
    setHotels([]);
    setHasSearched(true);
    setNights(searchParams.nights);

    try {
      const response = await axios.get("/api/hotels/search/", {
        params: {
          city: searchParams.city,
          check_in: searchParams.checkIn,
          check_out: searchParams.checkOut,
          adults: searchParams.adults,
        },
      });
      setHotels(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Failed to fetch hotel offers. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const destination = params.get("destination");
    const checkIn = params.get("checkIn");
    const checkOut = params.get("checkOut");
    const adults = params.get("adults");

    if (destination && checkIn && checkOut && adults) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nights = Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24)
      );
      handleSearch({
        city: destination,
        checkIn,
        checkOut,
        adults: parseInt(adults, 10),
        rooms: 1, // Default value, can be adjusted
        currency: "EUR", // Default value
        nights,
      });
    }
  }, [location.search]);

  return (
    <div className="flex-grow bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <HotelSearch onSearch={handleSearch} loading={isLoading} />
        </div>

        {hasSearched && (
          <div className="mt-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <HotelCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">
                {error}
              </div>
            ) : hotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {hotels.map((hotel) => (
                  <SearchResults key={hotel.id} hotel={hotel} nights={nights} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p>No hotels found for the selected criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

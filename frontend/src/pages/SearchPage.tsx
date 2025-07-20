import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { HotelOffer } from "../types/api";
import HotelSearch from "../components/features/HotelSearch";
import HotelCardSkeleton from "../components/features/HotelCardSkeleton";
import SearchResults from "../components/features/SearchResults";

const SearchPage: React.FC = () => {
  const location = useLocation();
  const [hotels, setHotels] = useState<HotelOffer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [nights, setNights] = useState(0);

  const handleSearch = async (searchParams: {
    cityCode: string;
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
          city_code: searchParams.cityCode,
          check_in: searchParams.checkIn,
          check_out: searchParams.checkOut,
          adults: searchParams.adults,
          rooms: searchParams.rooms,
          currency: searchParams.currency,
          roomQuantity: 1, // Defaulting to 1 room
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
      const calculatedNights = calculateNights(checkIn, checkOut);
      handleSearch({
        cityCode: destination,
        checkIn: checkIn,
        checkOut: checkOut,
        adults: parseInt(adults),
        rooms: 1,
        currency: "EUR",
        nights: calculatedNights,
      });
    }
  }, [location.search]);

  const initialSearchValues = () => {
    const params = new URLSearchParams(location.search);
    return {
      cityCode: params.get("destination") || "",
      checkIn: params.get("checkIn") || "",
      checkOut: params.get("checkOut") || "",
      adults: parseInt(params.get("adults") || "1"),
    };
  };

  return (
    <div>
      <HotelSearch
        onSearch={handleSearch}
        initialValues={initialSearchValues()}
        loading={isLoading}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <HotelCardSkeleton />
            <HotelCardSkeleton />
            <HotelCardSkeleton />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-600">
              Something went wrong
            </h2>
            <p className="mt-2 text-gray-600">{error}</p>
          </div>
        )}

        {!isLoading && !error && hotels.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <SearchResults key={hotel.id} hotel={hotel} nights={nights} />
            ))}
          </div>
        )}

        {!isLoading && !error && hasSearched && hotels.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-700">
              No hotels found
            </h2>
            <p className="mt-2 text-gray-500">
              We couldn't find any hotels matching your criteria. Please try a
              different search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const calculateNights = (checkIn: string, checkOut: string): number => {
  if (!checkIn || !checkOut) {
    return 0;
  }
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
    return 0;
  }
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

export default SearchPage;

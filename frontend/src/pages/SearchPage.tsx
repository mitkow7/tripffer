import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../config/api";
import { Hotel } from "../types/api";
import HotelSearch from "../components/features/HotelSearch";
import HotelCardSkeleton from "../components/features/HotelCardSkeleton";
import SearchResults from "../components/features/SearchResults";

const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    city: "",
    checkIn: "",
    checkOut: "",
    adults: 1,
    beds: 1,
    currency: "USD",
  });
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const city = params.get("destination") || "";
    const checkIn = params.get("checkIn") || "";
    const checkOut = params.get("checkOut") || "";
    const adults = parseInt(params.get("adults") || "1", 10);
    const beds = parseInt(params.get("beds") || "1", 10);
    const currency = params.get("currency") || "USD";

    setSearchParams({ city, checkIn, checkOut, adults, beds, currency });

    const fetchHotels = async () => {
      setIsLoading(true);
      setError(null);
      setHotels([]);

      const apiParams = {
        city,
        check_in: checkIn,
        check_out: checkOut,
        adults,
        beds,
      };

      try {
        const response = await api.get("hotels/search/", { params: apiParams });
        setHotels(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.error ||
            "Failed to fetch hotels. Please try again."
        );
      } finally {
        setIsLoading(false);
        setHasSearched(true);
      }
    };

    if (city) {
      fetchHotels();
    } else {
      setHotels([]);
      setHasSearched(false);
    }
  }, [location.search]);

  const handleSearchParamChange = (
    param: keyof typeof searchParams,
    value: string | number
  ) => {
    setSearchParams((prev) => ({ ...prev, [param]: value }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("destination", searchParams.city);
    if (searchParams.checkIn) {
      params.set("checkIn", searchParams.checkIn);
    }
    if (searchParams.checkOut) {
      params.set("checkOut", searchParams.checkOut);
    }
    params.set("adults", searchParams.adults.toString());
    params.set("beds", searchParams.beds.toString());
    params.set("currency", searchParams.currency);
    navigate({ search: params.toString() });
  };

  const nights =
    searchParams.checkIn && searchParams.checkOut
      ? Math.ceil(
          (new Date(searchParams.checkOut).getTime() -
            new Date(searchParams.checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Search Again</h2>
                <HotelSearch
                  searchParams={searchParams}
                  onSearchParamChange={handleSearchParamChange}
                  onSearch={handleSearch}
                  loading={isLoading}
                />
              </div>
            </div>
          </aside>
          <main className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...Array(6)].map((_, i) => (
                  <HotelCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">
                {error}
              </div>
            ) : hotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {hotels.map((hotel) => (
                  <SearchResults key={hotel.id} hotel={hotel} nights={nights} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-16">
                <h3 className="text-2xl font-semibold">
                  {hasSearched ? "No hotels found" : "No hotels available"}
                </h3>
                <p>
                  {hasSearched
                    ? "Try adjusting your search criteria."
                    : "Please check back later."}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

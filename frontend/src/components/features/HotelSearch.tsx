import { FormEvent, useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import { Building2, Calendar, Users, Search, Loader2 } from "lucide-react";

interface HotelSearchProps {
  onSearch: (params: {
    city: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    rooms: number;
    currency: string;
    nights: number;
  }) => void;
  initialValues?: {
    city: string;
    checkIn: string;
    checkOut: string;
    adults: number;
  };
  loading?: boolean;
}

export default function HotelSearch({
  onSearch,
  initialValues,
  loading = false,
}: HotelSearchProps) {
  const [city, setCity] = useState(initialValues?.city || "");
  const [checkIn, setCheckIn] = useState(
    initialValues?.checkIn || format(addDays(new Date(), 1), "yyyy-MM-dd")
  );
  const [checkOut, setCheckOut] = useState(
    initialValues?.checkOut || format(addDays(new Date(), 8), "yyyy-MM-dd")
  );
  const [adults, setAdults] = useState(initialValues?.adults || 1);
  const [rooms, setRooms] = useState(1);
  const [currency, setCurrency] = useState("EUR");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialValues) {
      setCity(initialValues.city);
      setCheckIn(initialValues.checkIn);
      setCheckOut(initialValues.checkOut);
      setAdults(initialValues.adults);
    }
  }, [initialValues]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!city) {
      setError("Please enter a city");
      return;
    }

    onSearch({
      city: city.toUpperCase(),
      checkIn,
      checkOut,
      adults,
      rooms,
      currency,
      nights: calculateNights(),
    });
  };

  const calculateNights = () => {
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

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end"
        >
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., London"
                className="pl-10 w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-in
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={format(new Date(), "yyyy-MM-dd")}
                className="pl-10 w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-out
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn}
                className="pl-10 w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guests
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={adults}
                onChange={(e) => setAdults(parseInt(e.target.value))}
                className="pl-10 w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {[1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Guest" : "Guests"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

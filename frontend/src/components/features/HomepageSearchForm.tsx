import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";
import { Building2, Calendar, Users, Search } from "lucide-react";

export default function HomepageSearchForm() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState(
    format(addDays(new Date(), 1), "yyyy-MM-dd")
  );
  const [checkOut, setCheckOut] = useState(
    format(addDays(new Date(), 8), "yyyy-MM-dd")
  );
  const [adults, setAdults] = useState(1);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("destination", city);
    params.set("checkIn", checkIn);
    params.set("checkOut", checkOut);
    params.set("adults", adults.toString());
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Search for Hotels
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
      >
        <div className="md:col-span-2">
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="text-gray-400 h-5 w-5" />
            </div>
            <input
              type="text"
              name="city"
              id="city"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-12"
              placeholder="e.g. London"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="checkin-date"
            className="block text-sm font-medium text-gray-700"
          >
            Check-in
          </label>
          <input
            type="date"
            name="checkin-date"
            id="checkin-date"
            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md h-12"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="checkout-date"
            className="block text-sm font-medium text-gray-700"
          >
            Check-out
          </label>
          <input
            type="date"
            name="checkout-date"
            id="checkout-date"
            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md h-12"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="adults"
            className="block text-sm font-medium text-gray-700"
          >
            Adults
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users className="text-gray-400 h-5 w-5" />
            </div>
            <input
              type="number"
              name="adults"
              id="adults"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-12"
              min="1"
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="md:col-span-4">
          <button
            type="submit"
            className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 h-12"
          >
            <Search className="h-5 w-5 mr-2" />
            Search
          </button>
        </div>
      </form>
    </div>
  );
}

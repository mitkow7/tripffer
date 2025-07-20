import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";
import { Building2, Calendar, Users, Search } from "lucide-react";

export default function HomepageSearchForm() {
  const navigate = useNavigate();
  const [cityCode, setCityCode] = useState("");
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
    params.set("destination", cityCode);
    params.set("checkIn", checkIn);
    params.set("checkOut", checkOut);
    params.set("adults", adults.toString());
    navigate(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
    >
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Destination
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={cityCode}
            onChange={(e) => setCityCode(e.target.value.toUpperCase())}
            placeholder="Enter city code (e.g., LON)"
            className="pl-10 w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
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
            className="pl-10 w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
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
            className="pl-10 w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Guests
        </label>
        <select
          value={adults}
          onChange={(e) => setAdults(parseInt(e.target.value))}
          className="pl-10 w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
        >
          {[1, 2, 3, 4].map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? "Guest" : "Guests"}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-4">
        <button
          type="submit"
          className="w-full h-12 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Search className="h-5 w-5" />
          <span>Search Hotels</span>
        </button>
      </div>
    </form>
  );
}

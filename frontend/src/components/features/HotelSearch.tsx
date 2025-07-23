import React from "react";
import { MapPin, Calendar, Users, Bed, DollarSign, Search } from "lucide-react";

interface SearchParams {
  city: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  beds: number;
  currency: string;
}

interface HotelSearchProps {
  searchParams: SearchParams;
  onSearchParamChange: (
    param: keyof SearchParams,
    value: string | number
  ) => void;
  onSearch: () => void;
  loading: boolean;
}

const InputGroup: React.FC<{
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ icon, children }) => (
  <div className="flex items-center bg-gray-100 p-3 rounded-lg border border-gray-200">
    {icon}
    {children}
  </div>
);

const HotelSearch: React.FC<HotelSearchProps> = ({
  searchParams,
  onSearchParamChange,
  onSearch,
  loading,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Destination
        </label>
        <InputGroup icon={<MapPin className="text-gray-500 mr-3" />}>
          <input
            type="text"
            value={searchParams.city}
            onChange={(e) => onSearchParamChange("city", e.target.value)}
            placeholder="e.g. New York"
            className="bg-transparent focus:outline-none w-full"
          />
        </InputGroup>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Dates
        </label>
        <div className="grid grid-cols-2 gap-4">
          <InputGroup icon={<Calendar className="text-gray-500 mr-3" />}>
            <input
              type="date"
              value={searchParams.checkIn}
              onChange={(e) => onSearchParamChange("checkIn", e.target.value)}
              className="bg-transparent focus:outline-none w-full"
            />
          </InputGroup>
          <InputGroup icon={<Calendar className="text-gray-500 mr-3" />}>
            <input
              type="date"
              value={searchParams.checkOut}
              onChange={(e) => onSearchParamChange("checkOut", e.target.value)}
              className="bg-transparent focus:outline-none w-full"
            />
          </InputGroup>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Guests & Beds
        </label>
        <div className="grid grid-cols-2 gap-4">
          <InputGroup icon={<Users className="text-gray-500 mr-3" />}>
            <input
              type="number"
              value={searchParams.adults}
              min={1}
              onChange={(e) =>
                onSearchParamChange("adults", parseInt(e.target.value))
              }
              className="bg-transparent focus:outline-none w-full"
            />
          </InputGroup>
          <InputGroup icon={<Bed className="text-gray-500 mr-3" />}>
            <input
              type="number"
              value={searchParams.beds}
              min={1}
              onChange={(e) =>
                onSearchParamChange("beds", parseInt(e.target.value))
              }
              className="bg-transparent focus:outline-none w-full"
            />
          </InputGroup>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Currency
        </label>
        <InputGroup icon={<DollarSign className="text-gray-500 mr-3" />}>
          <select
            value={searchParams.currency}
            onChange={(e) => onSearchParamChange("currency", e.target.value)}
            className="bg-transparent focus:outline-none w-full"
          >
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
          </select>
        </InputGroup>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center"
      >
        {loading ? "Searching..." : "Search"}
        {!loading && <Search className="ml-2" />}
      </button>
    </form>
  );
};

export default HotelSearch;

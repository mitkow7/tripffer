import React, { useState } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Building2,
} from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { SearchFilters } from "../../types/api";

interface SearchFormProps {
  onSearch: (
    filters: SearchFilters & { searchType: "trips" | "hotels" }
  ) => void;
  initialFilters?: Partial<SearchFilters>;
  loading?: boolean;
  searchType: "trips" | "hotels";
}

const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  initialFilters = {},
  loading = false,
  searchType,
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    destination: initialFilters.destination || "",
    startDate: initialFilters.startDate || "",
    endDate: initialFilters.endDate || "",
    budget: {
      min: initialFilters.budget?.min || 0,
      max: initialFilters.budget?.max || 5000,
    },
    duration: {
      min: initialFilters.duration?.min || 1,
      max: initialFilters.duration?.max || 30,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ ...filters, searchType });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-lg p-6 space-y-6"
    >
      {/* Destination */}
      <div>
        <Input
          label={searchType === "hotels" ? "City" : "Destination"}
          icon={
            searchType === "hotels" ? (
              <Building2 className="w-5 h-5 text-gray-400" />
            ) : (
              <MapPin className="w-5 h-5 text-gray-400" />
            )
          }
          placeholder={
            searchType === "hotels"
              ? "Enter city code (e.g., LON, NYC)"
              : "Where do you want to go?"
          }
          value={filters.destination}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              destination:
                searchType === "hotels"
                  ? e.target.value.toUpperCase()
                  : e.target.value,
            }))
          }
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={searchType === "hotels" ? "Check-in Date" : "Start Date"}
          type="date"
          icon={<Calendar className="w-5 h-5 text-gray-400" />}
          value={filters.startDate}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, startDate: e.target.value }))
          }
        />
        <Input
          label={searchType === "hotels" ? "Check-out Date" : "End Date"}
          type="date"
          icon={<Calendar className="w-5 h-5 text-gray-400" />}
          value={filters.endDate}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, endDate: e.target.value }))
          }
        />
      </div>

      {/* Budget Range - Only show for trips */}
      {searchType === "trips" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget Range (${filters.budget.min} - ${filters.budget.max})
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Min budget"
              icon={<DollarSign className="w-5 h-5 text-gray-400" />}
              value={filters.budget.min}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  budget: { ...prev.budget, min: Number(e.target.value) },
                }))
              }
            />
            <Input
              type="number"
              placeholder="Max budget"
              icon={<DollarSign className="w-5 h-5 text-gray-400" />}
              value={filters.budget.max}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  budget: { ...prev.budget, max: Number(e.target.value) },
                }))
              }
            />
          </div>
        </div>
      )}

      {/* Duration - Only show for trips */}
      {searchType === "trips" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration ({filters.duration.min} - {filters.duration.max} days)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Min days"
              value={filters.duration.min}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  duration: { ...prev.duration, min: Number(e.target.value) },
                }))
              }
            />
            <Input
              type="number"
              placeholder="Max days"
              value={filters.duration.max}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  duration: { ...prev.duration, max: Number(e.target.value) },
                }))
              }
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" size="lg" className="w-full" loading={loading}>
        <Search className="w-5 h-5 mr-2" />
        Search {searchType === "hotels" ? "Hotels" : "Trips"}
      </Button>
    </form>
  );
};

export default SearchForm;

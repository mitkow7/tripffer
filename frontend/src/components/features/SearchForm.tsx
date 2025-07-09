import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { SearchFilters } from '../../types/api';

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
  loading?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  initialFilters = {},
  loading = false
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    destination: initialFilters.destination || '',
    startDate: initialFilters.startDate || '',
    endDate: initialFilters.endDate || '',
    budget: {
      min: initialFilters.budget?.min || 0,
      max: initialFilters.budget?.max || 5000,
    },
    travelType: initialFilters.travelType || [],
    duration: {
      min: initialFilters.duration?.min || 1,
      max: initialFilters.duration?.max || 30,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const travelTypes = [
    { value: 'adventure', label: 'Adventure' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'relaxation', label: 'Relaxation' },
    { value: 'family', label: 'Family' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'budget', label: 'Budget' },
  ];

  const handleTravelTypeChange = (type: string) => {
    setFilters(prev => ({
      ...prev,
      travelType: prev.travelType.includes(type)
        ? prev.travelType.filter(t => t !== type)
        : [...prev.travelType, type]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Destination */}
      <div>
        <Input
          label="Destination"
          icon={<MapPin className="w-5 h-5 text-gray-400" />}
          placeholder="Where do you want to go?"
          value={filters.destination}
          onChange={(e) => setFilters(prev => ({ ...prev, destination: e.target.value }))}
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          icon={<Calendar className="w-5 h-5 text-gray-400" />}
          value={filters.startDate}
          onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
        />
        <Input
          label="End Date"
          type="date"
          icon={<Calendar className="w-5 h-5 text-gray-400" />}
          value={filters.endDate}
          onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
        />
      </div>

      {/* Budget Range */}
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
            onChange={(e) => setFilters(prev => ({
              ...prev,
              budget: { ...prev.budget, min: Number(e.target.value) }
            }))}
          />
          <Input
            type="number"
            placeholder="Max budget"
            icon={<DollarSign className="w-5 h-5 text-gray-400" />}
            value={filters.budget.max}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              budget: { ...prev.budget, max: Number(e.target.value) }
            }))}
          />
        </div>
      </div>

      {/* Travel Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Travel Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {travelTypes.map(type => (
            <label key={type.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.travelType.includes(type.value)}
                onChange={() => handleTravelTypeChange(type.value)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Duration ({filters.duration.min} - {filters.duration.max} days)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            placeholder="Min days"
            value={filters.duration.min}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              duration: { ...prev.duration, min: Number(e.target.value) }
            }))}
          />
          <Input
            type="number"
            placeholder="Max days"
            value={filters.duration.max}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              duration: { ...prev.duration, max: Number(e.target.value) }
            }))}
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        loading={loading}
      >
        <Search className="w-5 h-5 mr-2" />
        Search Trips
      </Button>
    </form>
  );
};

export default SearchForm;
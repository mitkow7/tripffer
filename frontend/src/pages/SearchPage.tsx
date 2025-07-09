import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, SortAsc, SortDesc } from 'lucide-react';
import SearchForm from '../components/features/SearchForm';
import TripGrid from '../components/features/TripGrid';
import Button from '../components/ui/Button';
import { SearchFilters } from '../types/api';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'duration'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Parse URL params to get initial filters
  const getInitialFilters = (): SearchFilters => {
    const params = new URLSearchParams(location.search);
    return {
      destination: params.get('destination') || '',
      startDate: params.get('startDate') || '',
      endDate: params.get('endDate') || '',
      budget: {
        min: Number(params.get('budgetMin')) || 0,
        max: Number(params.get('budgetMax')) || 5000,
      },
      travelType: params.get('travelType')?.split(',') || [],
      duration: {
        min: Number(params.get('durationMin')) || 1,
        max: Number(params.get('durationMax')) || 30,
      },
    };
  };

  const [filters, setFilters] = useState<SearchFilters>(getInitialFilters());

  // Replace these with your actual API calls
  const trips = [];
  const favorites = [];
  const isLoading = false;
  const error = null;

  // Sort trips based on selected criteria
  const sortedTrips = [...trips].sort((a, b) => {
    let aValue: number;
    let bValue: number;

    switch (sortBy) {
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'rating':
        aValue = a.rating;
        bValue = b.rating;
        break;
      case 'duration':
        aValue = a.duration;
        bValue = b.duration;
        break;
      default:
        aValue = a.price;
        bValue = b.price;
    }

    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.destination) params.set('destination', newFilters.destination);
    if (newFilters.startDate) params.set('startDate', newFilters.startDate);
    if (newFilters.endDate) params.set('endDate', newFilters.endDate);
    if (newFilters.budget.min) params.set('budgetMin', newFilters.budget.min.toString());
    if (newFilters.budget.max) params.set('budgetMax', newFilters.budget.max.toString());
    if (newFilters.travelType.length) params.set('travelType', newFilters.travelType.join(','));
    if (newFilters.duration.min) params.set('durationMin', newFilters.duration.min.toString());
    if (newFilters.duration.max) params.set('durationMax', newFilters.duration.max.toString());
    
    navigate(`/search?${params.toString()}`, { replace: true });
  };

  const handleSortChange = (newSortBy: 'price' | 'rating' | 'duration') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-8">Please try again later</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
          <p className="text-gray-600">
            {trips.length} trips found{filters.destination && ` for "${filters.destination}"`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide' : 'Show'} Filters
                </Button>
              </div>
              
              <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
                <SearchForm
                  onSearch={handleSearch}
                  initialFilters={filters}
                  loading={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Sort Controls */}
            <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                <div className="flex space-x-2">
                  {['price', 'rating', 'duration'].map((option) => (
                    <Button
                      key={option}
                      variant={sortBy === option ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleSortChange(option as 'price' | 'rating' | 'duration')}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                      {sortBy === option && (
                        sortOrder === 'asc' ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Trip Grid */}
            <TripGrid trips={sortedTrips} loading={isLoading} favorites={favorites} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
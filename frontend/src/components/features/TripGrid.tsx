import React from 'react';
import TripCard from './TripCard';
import SkeletonLoader from '../ui/SkeletonLoader';
import { Trip } from '../../types/api';

interface TripGridProps {
  trips: Trip[];
  loading?: boolean;
  favorites?: string[];
}

const TripGrid: React.FC<TripGridProps> = ({ trips, loading = false, favorites = [] }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4">
            <SkeletonLoader className="h-48 w-full mb-4 rounded-lg" />
            <SkeletonLoader className="h-6 w-3/4 mb-2" />
            <SkeletonLoader className="h-4 w-1/2 mb-3" />
            <SkeletonLoader className="h-16 w-full mb-3" />
            <div className="flex justify-between items-center">
              <SkeletonLoader className="h-6 w-20" />
              <SkeletonLoader className="h-10 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No trips found</div>
        <p className="text-gray-400">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          isFavorite={favorites.includes(trip.id)}
        />
      ))}
    </div>
  );
};

export default TripGrid;
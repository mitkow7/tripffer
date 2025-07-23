import React from "react";

const HotelCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="h-56 w-full bg-gray-200 animate-pulse"></div>
      <div className="p-6">
        <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-6"></div>
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default HotelCardSkeleton;

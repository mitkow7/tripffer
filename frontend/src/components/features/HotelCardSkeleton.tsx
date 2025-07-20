import React from "react";
import { Building2, MapPin, Star } from "lucide-react";

const HotelCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <div className="h-48 w-full object-cover md:w-48 bg-gray-300 flex items-center justify-center">
            <Building2 className="h-16 w-16 text-gray-400" />
          </div>
        </div>
        <div className="p-6 flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </div>
              <div className="mt-2 h-8 bg-gray-300 rounded w-48"></div>
              <div className="mt-3 flex items-center">
                {[...Array(4)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-gray-300 fill-current"
                  />
                ))}
                <div className="ml-2 h-4 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="h-6 bg-gray-300 rounded w-32"></div>
            <div className="mt-4 space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="p-4 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="h-5 bg-gray-300 rounded w-1/2"></div>
                      <div className="mt-2 h-4 bg-gray-300 rounded w-3/4"></div>
                    </div>
                    <div className="text-right pl-4">
                      <div className="h-7 bg-gray-300 rounded w-20"></div>
                      <div className="mt-2 h-4 bg-gray-300 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCardSkeleton;

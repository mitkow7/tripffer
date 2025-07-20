import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Users, Star, Heart } from "lucide-react";
import { Trip } from "../../types/api";
import Card from "../ui/Card";
import Button from "../ui/Button";

interface TripCardProps {
  trip: Trip;
  isFavorite?: boolean;
}

const TripCard: React.FC<TripCardProps> = ({ trip, isFavorite = false }) => {
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    // Replace with your actual API call
  };

  const discountPercentage = trip.originalPrice
    ? Math.round(((trip.originalPrice - trip.price) / trip.originalPrice) * 100)
    : 0;

  return (
    <Card hover className="overflow-hidden group">
      <div className="relative">
        <img
          src={
            trip.images[0] ||
            "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop"
          }
          alt={trip.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
            {discountPercentage}% OFF
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-1">
              {trip.title}
            </h3>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              {trip.destination}
            </div>
          </div>
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 text-sm text-gray-600">
              {trip.rating} ({trip.reviewCount})
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {trip.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {trip.duration} days
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {trip.availableSpots} spots left
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">
              ${trip.price}
            </span>
            {trip.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${trip.originalPrice}
              </span>
            )}
          </div>
          <Link to={`/trips/${trip.id}`}>
            <Button size="sm">View Details</Button>
          </Link>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Provided by</span>
            <div className="flex items-center space-x-2">
              <img
                src={
                  trip.provider.logo ||
                  "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=30&h=30&fit=crop"
                }
                alt={trip.provider.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="font-medium">{trip.provider.name}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TripCard;

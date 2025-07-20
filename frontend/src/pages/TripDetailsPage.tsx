import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Users,
  Star,
  Heart,
  Clock,
  Shield,
  Award,
  Camera,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Input from "../components/ui/Input";

const TripDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [travelers, setTravelers] = useState(2);
  const [specialRequests, setSpecialRequests] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Replace these with your actual API calls
  const trip = null;
  const favorites = [];
  const isLoading = false;
  const error = null;
  const isFavorite = false;

  const handleToggleFavorite = () => {
    // Replace with your actual API call
  };

  const handleBooking = async () => {
    // Replace with your actual API call
    setShowBookingForm(false);
  };

  const nextImage = () => {
    if (trip) {
      setCurrentImageIndex((prev) => (prev + 1) % trip.images.length);
    }
  };

  const prevImage = () => {
    if (trip) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + trip.images.length) % trip.images.length
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Trip not found
          </h2>
          <p className="text-gray-600 mb-8">
            The trip you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/search">
            <Button>Browse Other Trips</Button>
          </Link>
        </div>
      </div>
    );
  }

  const discountPercentage = trip.originalPrice
    ? Math.round(((trip.originalPrice - trip.price) / trip.originalPrice) * 100)
    : 0;

  const totalPrice = trip.price * travelers;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            to="/search"
            className="text-blue-600 hover:text-blue-700 flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Search Results
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <Card className="mb-8 overflow-hidden">
              <div className="relative">
                <img
                  src={
                    trip.images[currentImageIndex] ||
                    "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop"
                  }
                  alt={trip.title}
                  className="w-full h-96 object-cover"
                />

                {/* Image Navigation */}
                {trip.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image Indicators */}
                {trip.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {trip.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "bg-white"
                            : "bg-white bg-opacity-50"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  onClick={handleToggleFavorite}
                  className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                    }`}
                  />
                </button>

                {/* Discount Badge */}
                {discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md font-medium">
                    {discountPercentage}% OFF
                  </div>
                )}

                {/* Photo Count */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md flex items-center">
                  <Camera className="w-4 h-4 mr-1" />
                  {trip.images.length} photos
                </div>
              </div>
            </Card>

            {/* Trip Info */}
            <Card className="p-6 mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {trip.title}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-5 h-5 mr-2" />
                    {trip.destination}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {trip.duration} days
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {trip.availableSpots} spots available
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                      {trip.rating} ({trip.reviewCount} reviews)
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {trip.description}
              </p>

              {/* Trip Highlights */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  What's Included
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {trip.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Provider Info */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Travel Provider
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        trip.provider.logo ||
                        "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop"
                      }
                      alt={trip.provider.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {trip.provider.name}
                      </h4>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                        <span className="text-sm text-gray-600">
                          {trip.provider.rating} provider rating
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Verified Provider</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-bold text-blue-600">
                        ${trip.price}
                      </span>
                      {trip.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          ${trip.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">per person</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(trip.departureDate).toLocaleDateString()} -{" "}
                    {new Date(trip.returnDate).toLocaleDateString()}
                  </div>
                </div>

                {!showBookingForm ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Travelers</span>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() =>
                            setTravelers(Math.max(1, travelers - 1))
                          }
                          className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="font-medium">{travelers}</span>
                        <button
                          onClick={() => setTravelers(travelers + 1)}
                          className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">
                          Subtotal ({travelers} travelers)
                        </span>
                        <span className="font-medium">
                          ${totalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-blue-600">
                          ${totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="w-full"
                      onClick={() => setShowBookingForm(true)}
                    >
                      Book Now
                    </Button>

                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span>Free cancellation up to 24 hours</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Complete Your Booking
                    </h3>

                    <Input
                      label="Special Requests (Optional)"
                      placeholder="Dietary restrictions, accessibility needs, etc."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                    />

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">
                          Total for {travelers} travelers
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                          ${totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        size="lg"
                        className="w-full"
                        onClick={handleBooking}
                        loading={createBooking.isPending}
                      >
                        Confirm Booking
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowBookingForm(false)}
                      >
                        Back
                      </Button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Trust Indicators */}
              <Card className="p-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Why Book with Tripffer?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700">
                      Secure payment processing
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-700">
                      Best price guarantee
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-purple-500" />
                    <span className="text-sm text-gray-700">
                      24/7 customer support
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsPage;

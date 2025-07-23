import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Heart,
  Settings,
  CreditCard,
  MapPin,
  Clock,
  User as UserIcon,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useCurrentUser, useUserBookings, useFavorites } from "../hooks/useApi";
import { Booking, FavoriteHotel } from "../types/api";

const DashboardPage: React.FC = () => {
  const { data: userData, isLoading: userLoading } = useCurrentUser();
  const { data: bookingsData, isLoading: bookingsLoading } = useUserBookings();
  const { data: favoritesData, isLoading: favoritesLoading } = useFavorites();
  const user = userData?.data;
  const bookings: Booking[] = bookingsData?.data || [];
  const favorites: FavoriteHotel[] = favoritesData || [];

  const upcomingBookings = bookings.filter((booking) => {
    if (booking.type === "trip" && booking.trip) {
      return (
        new Date(booking.trip.departureDate) > new Date() &&
        (booking.status === "confirmed" || booking.status === "pending")
      );
    }
    if (booking.type === "hotel" && booking.room && booking.start_date) {
      return (
        new Date(booking.start_date) > new Date() &&
        (booking.status === "confirmed" || booking.status === "pending")
      );
    }
    return false;
  });

  const pastBookings = bookings.filter((booking) => {
    if (booking.type === "trip" && booking.trip) {
      return (
        new Date(booking.trip.returnDate) < new Date() &&
        booking.status === "confirmed"
      );
    }
    if (booking.type === "hotel" && booking.room && booking.end_date) {
      return (
        new Date(booking.end_date) < new Date() &&
        booking.status === "confirmed"
      );
    }
    return false;
  });

  const StatCard = ({
    icon,
    title,
    value,
    color,
  }: {
    icon: React.ReactElement;
    title: string;
    value: string | number | React.ReactElement;
    color: string;
  }) => (
    <Card className="p-6 transform transition-transform duration-300 hover:scale-105">
      <div className="flex items-center">
        <div className={`p-3 bg-${color}-100 rounded-full`}>
          {React.cloneElement(icon, { className: `w-6 h-6 text-${color}-600` })}
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome back, {user?.first_name || "there"}!
            </h1>
            <p className="text-gray-600">
              Here's your travel summary at a glance.
            </p>
          </div>
          <div className="flex items-center">
            <Link to="/settings" className="mr-4">
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-gray-500" />
                </div>
              )}
            </Link>
            <Link to="/search">
              <Button>Explore Trips</Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={<Calendar />}
            title="Upcoming Trips"
            value={
              userLoading || bookingsLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                upcomingBookings.length
              )
            }
            color="blue"
          />
          <StatCard
            icon={<MapPin />}
            title="Completed Trips"
            value={
              userLoading || bookingsLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                pastBookings.length
              )
            }
            color="green"
          />
          <StatCard
            icon={<Heart />}
            title="Saved Trips"
            value={
              userLoading || favoritesLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                favorites.length
              )
            }
            color="red"
          />
          <StatCard
            icon={<CreditCard />}
            title="Total Spent"
            value={
              userLoading || bookingsLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                `$${bookings
                  .filter((booking) => booking.status !== "cancelled")
                  .reduce((sum, booking) => sum + booking.totalPrice, 0)
                  .toLocaleString()}`
              )
            }
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Trips */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Upcoming Adventures
              </h2>
              <Link to="/bookings">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            {bookingsLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.slice(0, 3).map((booking: any) => (
                  <Card
                    key={booking.id}
                    hover
                    className="p-4 transition-shadow"
                  >
                    {booking.type === "trip" && booking.trip ? (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-800">
                            {booking.trip.title}
                          </h3>
                          <span className="text-sm text-blue-600 font-bold">
                            ${booking.totalPrice}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <MapPin className="w-4 h-4 mr-2" />
                          {booking.trip.destination}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-2" />
                          {new Date(
                            booking.trip.departureDate
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(
                            booking.trip.returnDate
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    ) : booking.type === "hotel" && booking.room ? (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-800">
                            {booking.room.hotel_name}
                          </h3>
                          <span className="text-sm text-blue-600 font-bold">
                            ${booking.totalPrice}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <MapPin className="w-4 h-4 mr-2" />
                          {booking.room.hotel_address}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-2" />
                          {booking.start_date &&
                            new Date(
                              booking.start_date
                            ).toLocaleDateString()}{" "}
                          -{" "}
                          {booking.end_date &&
                            new Date(booking.end_date).toLocaleDateString()}
                        </div>
                      </div>
                    ) : null}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold">No upcoming trips</h3>
                <p className="mb-4">It's time to plan your next journey!</p>
                <Link to="/search">
                  <Button>Browse Trips</Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Favorite Trips */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Wishlist</h2>
              <Link to="/favorites">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            {favoritesLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : favorites.length > 0 ? (
              <div className="space-y-4">
                {favorites.slice(0, 3).map((fav: FavoriteHotel) => (
                  <Card key={fav.id} hover className="p-4 transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">
                        {fav.hotel.name}
                      </h3>
                      <span className="text-sm text-blue-600 font-bold">
                        ${fav.hotel.price_per_night}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      {fav.hotel.address}
                    </div>
                    <Link to={`/hotel/search/${fav.hotel.id}`}>
                      <Button size="sm" variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold">
                  Your wishlist is empty
                </h3>
                <p className="mb-4">Add trips you'd like to book someday.</p>
                <Link to="/search">
                  <Button>Discover Trips</Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

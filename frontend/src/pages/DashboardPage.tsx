import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Heart, Settings, CreditCard, MapPin, Clock } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const DashboardPage: React.FC = () => {
  // Replace these with your actual API calls
  const user = null;
  const bookings = [];
  const favorites = [];
  const bookingsLoading = false;
  const favoritesLoading = false;

  const upcomingBookings = bookings.filter(booking => 
    new Date(booking.trip.departureDate) > new Date() && booking.status === 'confirmed'
  );

  const pastBookings = bookings.filter(booking => 
    new Date(booking.trip.returnDate) < new Date() && booking.status === 'completed'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-600">Manage your trips and explore new destinations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Upcoming Trips</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingBookings.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Completed Trips</p>
                <p className="text-2xl font-bold text-gray-900">{pastBookings.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Saved Trips</p>
                <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${bookings.reduce((sum, booking) => sum + booking.totalPrice, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Trips */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Trips</h2>
              <Link to="/bookings">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>

            {bookingsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{booking.trip.title}</h3>
                      <span className="text-sm text-blue-600 font-medium">${booking.totalPrice}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {booking.trip.destination}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(booking.trip.departureDate).toLocaleDateString()} - {new Date(booking.trip.returnDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No upcoming trips</p>
                <Link to="/search">
                  <Button className="mt-4">Browse Trips</Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Favorite Trips */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Saved Trips</h2>
              <Link to="/favorites">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>

            {favoritesLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : favorites.length > 0 ? (
              <div className="space-y-4">
                {favorites.slice(0, 3).map((trip) => (
                  <div key={trip.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{trip.title}</h3>
                      <span className="text-sm text-blue-600 font-medium">${trip.price}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {trip.destination}
                    </div>
                    <Link to={`/trips/${trip.id}`}>
                      <Button size="sm" variant="outline">View Details</Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No saved trips yet</p>
                <Link to="/search">
                  <Button className="mt-4">Discover Trips</Button>
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/search">
              <Card hover className="p-6 text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-medium text-gray-900">Search Trips</h3>
                <p className="text-sm text-gray-600">Find your next adventure</p>
              </Card>
            </Link>

            <Link to="/bookings">
              <Card hover className="p-6 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-medium text-gray-900">Manage Bookings</h3>
                <p className="text-sm text-gray-600">View and update your trips</p>
              </Card>
            </Link>

            <Link to="/settings">
              <Card hover className="p-6 text-center">
                <Settings className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <h3 className="font-medium text-gray-900">Account Settings</h3>
                <p className="text-sm text-gray-600">Update your preferences</p>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Calendar, X } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import {
  useUserBookings,
  useRescheduleBooking,
  useCancelBooking,
} from "../hooks/useApi";
import { Booking } from "../types/api";
import Modal from "../components/ui/Modal";

const BookingsPage: React.FC = () => {
  const { data: bookingsData, isLoading: bookingsLoading } = useUserBookings();
  const rescheduleBooking = useRescheduleBooking();
  const cancelBooking = useCancelBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);

  const bookings: Booking[] = bookingsData?.data || [];

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

  const handleRescheduleClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleCancelClick = (bookingId: string) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      cancelBooking.mutate(bookingId);
    }
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    if (selectedBooking) {
      rescheduleBooking.mutate(
        {
          bookingId: selectedBooking.id,
          startDate,
          endDate,
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
          },
          onError: (error: any) => {
            setModalError(
              error.response?.data?.detail ||
                "An unexpected error occurred. Please try again."
            );
          },
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Upcoming Trips</h1>
          <p className="text-gray-600">
            All of your upcoming adventures in one place.
          </p>
        </div>

        {bookingsLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : upcomingBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingBookings.map((booking: any) => (
              <Card key={booking.id} hover className="p-4 transition-shadow">
                {booking.type === "hotel" && booking.room ? (
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
                        new Date(booking.start_date).toLocaleDateString()}{" "}
                      -{" "}
                      {booking.end_date &&
                        new Date(booking.end_date).toLocaleDateString()}
                    </div>
                    <Link to={`/hotel/search/${booking.room.hotel_id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-4"
                      >
                        View Details
                      </Button>
                    </Link>
                    <div className="flex justify-between mt-4">
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleCancelClick(booking.id)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleRescheduleClick(booking)}
                      >
                        Change Dates
                      </Button>
                    </div>
                  </div>
                ) : null}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <h3 className="text-lg font-semibold">No upcoming trips</h3>
            <p className="mb-4">It's time to plan your next journey!</p>
            <Link to="/search">
              <Button>Browse Trips</Button>
            </Link>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleModalSubmit}>
          <h2 className="text-xl font-bold mb-4">Reschedule Booking</h2>
          {modalError && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {modalError}
            </div>
          )}
          <div className="mb-4">
            <label
              htmlFor="start-date"
              className="block text-sm font-medium text-gray-700"
            >
              New Start Date
            </label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="end-date"
              className="block text-sm font-medium text-gray-700"
            >
              New End Date
            </label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Button type="submit" className="w-full">
            Confirm Reschedule
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default BookingsPage;

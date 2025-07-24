import React, { useState, useEffect } from "react";
import {
  useMyHotel,
  useHotelBookings,
  useUpdateBookingStatus,
} from "../hooks/useApi";
import {
  MapPin,
  Globe,
  Star,
  Building,
  FileText,
  DollarSign,
  Calendar,
  CheckSquare,
  Wifi,
  ParkingCircle,
  Utensils,
  Wind,
  Plus,
  Edit,
  Users,
  Check,
  X,
  Clock,
  Bed,
  TrendingUp,
  Activity,
  Mail,
  Phone,
} from "lucide-react";
import AddRoomForm from "../features/rooms/AddRoomForm";
import EditRoomForm from "../features/rooms/EditRoomForm";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Carousel from "../components/ui/Carousel";
import { Room } from "../types/api";

const featureIcons: { [key: string]: React.ReactElement } = {
  "free wifi": <Wifi className="w-5 h-5 mr-2" />,
  pool: <Utensils className="w-5 h-5 mr-2" />,
  gym: <Building className="w-5 h-5 mr-2" />,
  "free parking": <ParkingCircle className="w-5 h-5 mr-2" />,
  "air conditioning": <Wind className="w-5 h-5 mr-2" />,
  restaurant: <Utensils className="w-5 h-5 mr-2" />,
  spa: <Wind className="w-5 h-5 mr-2" />,
  "room service": <Users className="w-5 h-5 mr-2" />,
};

const InfoCard: React.FC<{
  title: string;
  children: React.ReactNode;
  icon: React.ReactElement;
}> = ({ title, children, icon }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center mb-4">
      {React.cloneElement(icon, { className: "w-6 h-6 text-blue-500 mr-3" })}
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    {children}
  </div>
);

const BookingStatusBadge: React.FC<{
  status: "pending" | "confirmed" | "cancelled" | "completed";
}> = ({ status }) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
  } as const;

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const HotelDashboardPage: React.FC = () => {
  const { data: hotel, isLoading, error, refetch } = useMyHotel();
  const { data: bookings, isLoading: bookingsLoading } = useHotelBookings();
  const updateBookingStatus = useUpdateBookingStatus();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (hotel?.images?.length > 0) {
      setSelectedImage(hotel.images[0].image);
    }
  }, [hotel]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Hotel Dashboard
          </h1>
          <p className="text-gray-600 mb-4">
            {error instanceof Error
              ? error.message
              : "There was an error loading your hotel data. Please try again later."}
          </p>
          {!localStorage.getItem("auth_token") && (
            <p className="text-gray-500">
              Please make sure you are logged in to access your hotel dashboard.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            No Hotel Found
          </h1>
          <p className="text-gray-600 mb-2">
            You haven't created a hotel profile yet.
          </p>
          <p className="text-gray-500">
            Please complete your hotel registration to manage your dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="w-full md:w-1/3">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={hotel.name}
                  className="w-full h-48 rounded-lg object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg">
                  <Building className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="flex mt-2 space-x-2">
                {hotel.images?.map((image: any) => (
                  <img
                    key={image.id}
                    src={image.image}
                    alt={hotel.name}
                    className={`w-16 h-16 rounded-lg object-cover cursor-pointer ${
                      selectedImage === image.image
                        ? "border-2 border-blue-500"
                        : ""
                    }`}
                    onClick={() => setSelectedImage(image.image)}
                  />
                ))}
              </div>
            </div>
            <div className="flex-grow md:pl-6">
              <h1 className="text-4xl font-bold text-gray-800">{hotel.name}</h1>
              <p className="text-gray-600 mt-1">
                Manage your hotel profile and bookings.
              </p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < hotel.stars ? "text-yellow-400" : "text-gray-300"
                  }`}
                  fill="currentColor"
                />
              ))}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <InfoCard title="Description" icon={<FileText />}>
              <p className="text-gray-600">{hotel.description}</p>
            </InfoCard>

            <InfoCard title="Features" icon={<CheckSquare />}>
              <div className="flex flex-wrap gap-4">
                {[
                  ...(Array.isArray(hotel.features)
                    ? hotel.features
                    : typeof hotel.features === "string"
                    ? hotel.features.split(",")
                    : []),
                  ...(hotel.amenities || []),
                ]
                  .filter((item) => item && item.trim())
                  .map((item: string, index: number) => {
                    const formattedItem = item
                      .trim()
                      .split("_")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(" ");
                    return (
                      <div
                        key={index}
                        className="flex items-center bg-gray-200 text-gray-800 px-4 py-2 rounded-full"
                      >
                        {featureIcons[item.trim().toLowerCase()] || (
                          <CheckSquare className="w-5 h-5 mr-2" />
                        )}
                        <span>{formattedItem}</span>
                      </div>
                    );
                  })}
              </div>
            </InfoCard>

            <InfoCard title="Rooms" icon={<Building />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {hotel.rooms?.map((room: Room) => (
                  <div
                    key={room.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out"
                  >
                    <div className="relative">
                      <Carousel
                        images={room.images}
                        altText={`Image of ${room.room_type}`}
                      />
                      <div className="absolute top-0 right-0 bg-blue-500 text-white py-1 px-3 rounded-bl-lg font-bold">
                        ${room.price}
                      </div>
                      <div className="absolute bottom-0 right-0 p-2">
                        <Button size="sm" onClick={() => setEditingRoom(room)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-2xl font-semibold text-gray-800 mb-2">
                        {room.room_type}
                      </h4>
                      <p className="text-gray-600 mb-4">{room.description}</p>
                      <div className="flex justify-between">
                        <div className="flex items-center text-gray-700">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                            ></path>
                          </svg>
                          <span>
                            {room.bed_count} Bed
                            {room.bed_count > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Users className="w-5 h-5 mr-2" />
                          <span>
                            {room.max_adults} Adult
                            {room.max_adults > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => setShowAddRoomForm(!showAddRoomForm)}
                className="mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                {showAddRoomForm ? "Cancel" : "Add Room"}
              </Button>
              {showAddRoomForm && (
                <div className="mt-4">
                  <AddRoomForm
                    onSuccess={() => {
                      setShowAddRoomForm(false);
                      if (refetch) {
                        refetch();
                      }
                    }}
                  />
                </div>
              )}
            </InfoCard>

            <InfoCard title="Bookings" icon={<Calendar />}>
              {bookingsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : bookings?.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  No bookings yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {bookings?.map((booking: any) => (
                    <div
                      key={booking.id}
                      className="bg-white rounded-lg shadow p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">
                            {booking.user.email}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.start_date).toLocaleDateString()}{" "}
                            - {new Date(booking.end_date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Room: {booking.room.room_type}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <BookingStatusBadge status={booking.status} />
                          {booking.status === "pending" && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() =>
                                  updateBookingStatus.mutate({
                                    bookingId: booking.id,
                                    status: "confirmed",
                                  })
                                }
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() =>
                                  updateBookingStatus.mutate({
                                    bookingId: booking.id,
                                    status: "cancelled",
                                  })
                                }
                                className="bg-red-500 hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </InfoCard>
          </div>

          <div className="space-y-8">
            <InfoCard title="Details" icon={<Building />}>
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 mr-3" />
                  <span>{hotel.address}</span>
                </div>
                {hotel.website && (
                  <div className="flex items-center text-gray-700">
                    <Globe className="w-5 h-5 mr-3" />
                    <a
                      href={hotel.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {hotel.website}
                    </a>
                  </div>
                )}
              </div>
            </InfoCard>

            <InfoCard title="Pricing & Availability" icon={<DollarSign />}>
              <div className="space-y-4">
                {hotel.price_per_night && (
                  <div className="flex items-center text-gray-700">
                    <DollarSign className="w-5 h-5 mr-3 text-green-500" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        ${hotel.price_per_night}
                      </p>
                      <p className="text-sm text-gray-600">per night</p>
                    </div>
                  </div>
                )}
                {hotel.availability_start_date &&
                  hotel.availability_end_date && (
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                      <div>
                        <p className="font-semibold text-gray-900">Available</p>
                        <p className="text-sm text-gray-600">
                          {new Date(
                            hotel.availability_start_date
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(
                            hotel.availability_end_date
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </InfoCard>
          </div>
        </div>
        {editingRoom && (
          <Modal isOpen={!!editingRoom} onClose={() => setEditingRoom(null)}>
            <h2 className="text-2xl font-bold mb-4">{`Edit Room - ${editingRoom.room_type}`}</h2>
            <EditRoomForm
              room={editingRoom}
              onSuccess={() => {
                setEditingRoom(null);
                refetch();
              }}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default HotelDashboardPage;

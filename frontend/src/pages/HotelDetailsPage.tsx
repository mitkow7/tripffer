import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  MapPin,
  Star,
  Users,
  BedDouble,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  Heart,
  Wifi,
  Wind,
  ParkingCircle,
  Utensils,
  Check,
  ChevronDown,
  Loader2,
  Clock,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  useFavorites,
  useToggleFavorite,
  useHotelDetails,
} from "../hooks/useApi";
import Carousel from "../components/ui/Carousel";
import ReviewSection from "../features/reviews/ReviewSection";
import ImageGrid from "../components/features/ImageGrid";
import ImageViewer from "../components/features/ImageViewer";
import RoomWidget from "../components/features/RoomWidget";
import StarRating from "../components/ui/StarRating";

const amenityIcons: { [key: string]: React.ReactElement } = {
  wifi: <Wifi size={20} />,
  air_conditioning: <Wind size={20} />,
  free_parking: <ParkingCircle size={20} />,
  restaurant: <Utensils size={20} />,
  default: <Check size={20} />,
};

const HotelDetailsPage = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const { data: hotel, isLoading, error } = useHotelDetails(hotelId || "");
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const { data: favoritesData } = useFavorites();
  const [isSaving, setIsSaving] = useState(false);
  const toggleFavorite = useToggleFavorite();

  const favorites = favoritesData || [];
  const isFavorited = favorites.some((fav: any) => fav.hotel.id === hotelId);
  const favoriteId = favorites.find((fav: any) => fav.hotel.id === hotelId)?.id;

  const handleSave = async () => {
    if (!hotelId || isSaving) return;

    try {
      setIsSaving(true);
      await toggleFavorite(hotelId, isFavorited, favoriteId);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 bg-red-100 p-4 rounded-md">
          Failed to fetch hotel details.
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>No hotel data found.</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gray-900">
        <div className="absolute inset-0">
          {hotel.images?.[0]?.image && (
            <img
              src={hotel.images[0].image}
              alt={hotel.name}
              className="w-full h-full object-cover opacity-60"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {hotel.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center">
                <StarRating rating={hotel.stars} />
                <span className="ml-2">{hotel.stars}.0</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{hotel.address}</span>
              </div>
              {hotel.guest_score && (
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {hotel.guest_score} Guest rating
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Photo Gallery */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <ImageGrid
                images={hotel.images || []}
                onShowAll={() => setShowAllPhotos(true)}
              />
            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About this hotel
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {hotel.description || "No description available."}
              </p>

              {/* Check-in/Check-out Times */}
              {(hotel.check_in_time || hotel.check_out_time) && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hotel.check_in_time && (
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Check-in time</p>
                        <p className="font-medium text-gray-900">
                          {new Date(
                            `2000-01-01T${hotel.check_in_time}`
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                  {hotel.check_out_time && (
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Check-out time</p>
                        <p className="font-medium text-gray-900">
                          {new Date(
                            `2000-01-01T${hotel.check_out_time}`
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Amenities Section */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  What this place offers
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {Array.isArray(hotel.amenities) &&
                    hotel.amenities.map((amenity: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="text-blue-500">
                          {amenityIcons[amenity.toLowerCase()] ||
                            amenityIcons["default"]}
                        </div>
                        <span className="ml-3 text-gray-700 capitalize">
                          {amenity.replace(/_/g, " ")}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Rooms Section */}
            {hotel.rooms && hotel.rooms.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Available Rooms
                </h2>
                <div className="space-y-6">
                  {hotel.rooms.map((room: any) => (
                    <div
                      key={room.id}
                      className="bg-gray-50 rounded-xl overflow-hidden hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/3 h-48 md:h-auto">
                          <Carousel
                            images={room.images}
                            altText={`Image of ${room.room_type}`}
                          />
                        </div>
                        <div className="w-full md:w-2/3 p-6">
                          <div className="flex flex-col h-full">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 capitalize">
                                {room.room_type.replace(/_/g, " ")}
                              </h3>
                              <p className="text-gray-600 mt-2">
                                {room.description ||
                                  "No description available."}
                              </p>
                              <div className="flex flex-wrap gap-4 mt-4">
                                <div className="flex items-center text-gray-600">
                                  <BedDouble className="w-5 h-5 mr-2" />
                                  <span>{room.bed_count} Bed(s)</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <Users className="w-5 h-5 mr-2" />
                                  <span>Up to {room.max_adults} guest(s)</span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <DollarSign className="w-6 h-6 text-green-500" />
                                <span className="text-2xl font-bold text-gray-900">
                                  {room.price}
                                </span>
                                <span className="text-gray-600 ml-1">
                                  / night
                                </span>
                              </div>
                              <Link
                                to={`/hotel/${hotelId}/room/${room.id}/book`}
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                Book Now
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Contact Information
              </h2>
              <div className="space-y-4">
                {hotel.contact_phone && (
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-500 mr-3" />
                    <a
                      href={`tel:${hotel.contact_phone}`}
                      className="text-blue-500 hover:underline"
                    >
                      {hotel.contact_phone}
                    </a>
                  </div>
                )}
                {hotel.contact_email && (
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-500 mr-3" />
                    <a
                      href={`mailto:${hotel.contact_email}`}
                      className="text-blue-500 hover:underline"
                    >
                      {hotel.contact_email}
                    </a>
                  </div>
                )}
                {hotel.website && (
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-gray-500 mr-3" />
                    <a
                      href={hotel.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            {hotel.reviews && hotel.id && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <ReviewSection reviews={hotel.reviews} hotelId={hotel.id} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Save Button */}
              <button
                onClick={handleSave}
                className={`w-full flex items-center justify-center font-semibold py-3 px-5 rounded-lg transition-all duration-200 ${
                  isFavorited
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } shadow-lg relative group disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Heart
                    className={`w-5 h-5 mr-2 transition-all duration-200 ${
                      isFavorited
                        ? "text-red-500 fill-current scale-110"
                        : "text-gray-400 hover:scale-110"
                    }`}
                  />
                )}
                <span className={isFavorited ? "text-red-500" : ""}>
                  {isSaving ? "Saving..." : isFavorited ? "Saved" : "Save"}
                </span>
              </button>

              {/* Room Widget */}
              <RoomWidget rooms={hotel.rooms || []} hotelId={hotelId || ""} />
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Image Viewer */}
      <ImageViewer
        images={hotel.images || []}
        isOpen={showAllPhotos}
        onClose={() => setShowAllPhotos(false)}
        initialIndex={0}
      />
    </div>
  );
};

export default HotelDetailsPage;

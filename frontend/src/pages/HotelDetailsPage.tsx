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
import Modal from "../components/ui/Modal";

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
  const toggleFavorite = useToggleFavorite();

  const favorites = favoritesData || [];
  const isFavorited = favorites.some((fav: any) => fav.hotel.id === hotelId);
  const favoriteId = favorites.find((fav: any) => fav.hotel.id === hotelId)?.id;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
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

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      );
    }
    return <div className="flex items-center">{stars}</div>;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {hotel.name}
              </h1>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <div className="flex items-center">
                  {renderStars(hotel.stars)}
                  <span className="ml-2">
                    ({hotel.reviews?.length || 0} reviews)
                  </span>
                </div>
                <span className="mx-2">·</span>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{hotel.address || "Address not available"}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <button
                className="flex items-center bg-white p-2 rounded-full shadow-md hover:bg-red-100 transition-colors"
                onClick={() => {
                  if (hotelId) {
                    toggleFavorite(hotelId, isFavorited, favoriteId);
                  }
                }}
              >
                <Heart
                  className={`h-6 w-6 ${
                    isFavorited ? "text-red-500 fill-current" : "text-gray-400"
                  }`}
                />
                <span className="ml-2 text-sm font-semibold">
                  {isFavorited ? "Saved" : "Save"}
                </span>
              </button>
            </div>
          </div>

          <ImageGrid
            images={hotel.images || []}
            onShowAll={() => setShowAllPhotos(true)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  About this hotel
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {hotel.description || "No description available."}
                </p>
              </div>

              {hotel.amenities && hotel.amenities.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Amenities
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.isArray(hotel.amenities) &&
                      hotel.amenities.map((amenity: string, index: number) => (
                        <div key={index} className="flex items-center">
                          {amenityIcons[amenity.toLowerCase()] ||
                            amenityIcons["default"]}
                          <span className="ml-3 text-gray-700">
                            {amenity.replace(/_/g, " ")}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {hotel.rooms && hotel.rooms.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Rooms
                  </h2>
                  <div className="space-y-6">
                    {hotel.rooms.map((room: any) => (
                      <div
                        key={room.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden flex"
                      >
                        <div className="w-1/3">
                          <Carousel
                            images={room.images}
                            altText={`Image of ${room.room_type}`}
                          />
                        </div>
                        <div className="w-2/3 p-6 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xl font-bold">
                              {room.room_type.replace(/_/g, " ")}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {room.description || "No description available."}
                            </p>
                            <div className="flex items-center mt-4 space-x-4 text-sm">
                              <div className="flex items-center">
                                <BedDouble className="h-5 w-5 mr-2 text-gray-600" />
                                <span>{room.bed_count} Bed(s)</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-5 w-5 mr-2 text-gray-600" />
                                <span>{room.max_adults} Adult(s)</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center">
                              <DollarSign className="h-6 w-6 mr-1 text-green-500" />
                              <span className="text-xl font-bold">
                                {room.price}
                              </span>
                              <span className="text-sm text-gray-600 ml-1">
                                / night
                              </span>
                            </div>
                            <Link
                              to={`/hotel/${hotelId}/room/${room.id}/book`}
                              className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                            >
                              Book Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hotel.reviews && hotel.id && (
                <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                  <ReviewSection reviews={hotel.reviews} hotelId={hotel.id} />
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold">
                      {hotel.price_per_night
                        ? `${parseFloat(hotel.price_per_night).toFixed(2)}`
                        : "N/A"}{" "}
                      <span className="text-base font-normal text-gray-600">
                        / night
                      </span>
                    </span>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                      <span>{hotel.guest_score?.toFixed(1) || "N/A"}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 mt-4">
                  <h3 className="font-semibold mb-2">Contact</h3>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gray-600" />
                    <a
                      href={`tel:${hotel.contact_phone}`}
                      className="text-blue-500 hover:underline"
                    >
                      {hotel.contact_phone || "Not available"}
                    </a>
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <Mail className="h-4 w-4 mr-2 text-gray-600" />
                    <a
                      href={`mailto:${hotel.contact_email}`}
                      className="text-blue-500 hover:underline"
                    >
                      {hotel.contact_email || "Not available"}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={showAllPhotos} onClose={() => setShowAllPhotos(false)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {hotel.images?.map((img: { id: string | number; image: string }) => (
            <img
              key={img.id}
              src={img.image}
              alt="Hotel view"
              className="w-full h-full object-cover rounded-lg"
            />
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default HotelDetailsPage;

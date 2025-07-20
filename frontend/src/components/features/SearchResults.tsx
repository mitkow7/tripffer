import {
  Star,
  MapPin,
  BedDouble,
  Wifi,
  UtensilsCrossed,
  Dumbbell,
  Car,
  Wind,
  Tv2,
  ShowerHead,
  Check,
  Building2,
  Ruler,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { HotelOffer, Offer } from "../../types/api";

interface SearchResultsProps {
  hotel: HotelOffer;
  nights: number;
}

const AmenityIcon = ({ amenity }: { amenity: string }) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    "WI-FI": <Wifi className="h-5 w-5 text-blue-500" />,
    RESTAURANT: <UtensilsCrossed className="h-5 w-5 text-blue-500" />,
    FITNESS_CENTER: <Dumbbell className="h-5 w-5 text-blue-500" />,
    PARKING: <Car className="h-5 w-5 text-blue-500" />,
    AIR_CONDITIONING: <Wind className="h-5 w-5 text-blue-500" />,
    FLAT_SCREEN_TV: <Tv2 className="h-5 w-5 text-blue-500" />,
    BATH_TUB: <ShowerHead className="h-5 w-5 text-blue-500" />,
  };
  const normalizedAmenity = amenity.toUpperCase().replace(/\s+/g, "_");
  if (!iconMap[normalizedAmenity]) return null;
  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-blue-50 w-24 h-24 text-center">
      {iconMap[normalizedAmenity]}
      <span className="mt-2 text-xs font-medium text-blue-800 capitalize">
        {amenity.toLowerCase().replace(/_/g, " ")}
      </span>
    </div>
  );
};

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className="h-5 w-5 text-yellow-400 fill-current"
        />
      ))}
      {halfStar && <Star key="half" className="h-5 w-5 text-yellow-400" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
      ))}
    </div>
  );
};

const RoomFeatures = ({
  description,
  roomType,
  hotelAmenities,
}: {
  description: string;
  roomType: string;
  hotelAmenities: string[];
}) => {
  if (
    !description &&
    !roomType &&
    (!hotelAmenities || hotelAmenities.length === 0)
  )
    return null;

  const featuresConfig = [
    {
      name: "BED",
      icon: <BedDouble className="h-4 w-4 text-gray-700" />,
      patterns: [
        /(\d+\s)?(super\s)?(king|queen|double|twin|single)[\s-](size\s)?bed(s)?/i,
      ],
    },
    {
      name: "SIZE",
      icon: <Ruler className="h-4 w-4 text-gray-700" />,
      patterns: [/\d+(\.\d+)?\s*(sq|m2|square)[\s\.]?(meter|m|ft)/i],
    },
    {
      name: "WIFI",
      icon: <Wifi className="h-4 w-4 text-gray-700" />,
      patterns: [/wi-fi/i, /wifi/i],
    },
    {
      name: "AIRCON",
      icon: <Wind className="h-4 w-4 text-gray-700" />,
      patterns: [/air[\s-]?conditioning/i, /air-conditioned/i],
    },
    {
      name: "TV",
      icon: <Tv2 className="h-4 w-4 text-gray-700" />,
      patterns: [/tv/i, /flat-screen/i, /television/i],
    },
    {
      name: "BREAKFAST",
      icon: <UtensilsCrossed className="h-4 w-4 text-gray-700" />,
      patterns: [/breakfast/i],
    },
    {
      name: "PARKING",
      icon: <Car className="h-4 w-4 text-gray-700" />,
      patterns: [/parking/i],
    },
    {
      name: "FITNESS",
      icon: <Dumbbell className="h-4 w-4 text-gray-700" />,
      patterns: [/fitness/i],
    },
  ];

  const extractedFeatures = new Map<
    string,
    { icon: React.ReactNode; text: string }
  >();

  let processedDescription = `${roomType} ${description || ""}`;
  const boilerplate = [
    /BEST FLEXIBLE RATE/gi,
    /When you arrive at the hotel we will do our best to meet your room type/gi,
    // new RegExp(roomType, "gi"), // Already part of the string
  ];
  boilerplate.forEach((pattern) => {
    if (pattern)
      processedDescription = processedDescription.replace(pattern, "");
  });

  featuresConfig.forEach((config) => {
    config.patterns.forEach((pattern) => {
      const match = processedDescription.match(pattern);
      if (match && !extractedFeatures.has(config.name)) {
        const featureText = config.name === "WIFI" ? "Wifi" : match[0].trim();
        extractedFeatures.set(config.name, {
          icon: config.icon,
          text: featureText,
        });
        processedDescription = processedDescription.replace(pattern, "");
      }
    });
  });

  if (hotelAmenities) {
    hotelAmenities.forEach((amenity) => {
      const matchingConfig = featuresConfig.find((c) =>
        c.patterns.some((p) => p.test(amenity))
      );
      if (matchingConfig && !extractedFeatures.has(matchingConfig.name)) {
        extractedFeatures.set(matchingConfig.name, {
          icon: matchingConfig.icon,
          text: amenity.replace(/_/g, " "),
        });
      }
    });
  }

  const featuresToShow = Array.from(extractedFeatures.values());

  if (featuresToShow.length === 0) {
    return null;
  }

  return (
    <ul className="mt-2 pl-7 grid grid-cols-2 gap-x-4 gap-y-2">
      {featuresToShow.slice(0, 4).map((feature, index) => (
        <li key={index} className="flex items-center text-sm text-gray-800">
          <span className="text-blue-600">{feature.icon}</span>
          <span className="ml-2 capitalize">{feature.text.toLowerCase()}</span>
        </li>
      ))}
    </ul>
  );
};

const HotelImage = ({
  hotelId,
  hotelName,
}: {
  hotelId: string;
  hotelName: string;
}) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhoto = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/hotels/${hotelId}/photos/`);
        if (response.data && response.data.length > 0) {
          setPhotoUrl(response.data[0]);
        }
      } catch (error) {
        // console.error("Failed to fetch hotel photo", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhoto();
  }, [hotelId]);

  return (
    <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center overflow-hidden">
      {loading ? (
        <Building2 className="h-16 w-16 text-gray-400 animate-pulse" />
      ) : photoUrl ? (
        <img
          src={photoUrl}
          alt={`Photo of ${hotelName}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <Building2 className="h-16 w-16 text-gray-400" />
      )}
    </div>
  );
};

const OfferCard = ({
  offer,
  nights,
  hotelAmenities,
}: {
  offer: Offer;
  nights: number;
  hotelAmenities: string[];
}) => {
  const pricePerNight = parseFloat(offer.price.total) / (nights || 1);

  return (
    <div className="border rounded-lg p-4 mt-2 hover:bg-blue-50 transition-all duration-300 hover:border-blue-300">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <BedDouble className="h-5 w-5 mr-2 text-blue-600" />
            <h4 className="font-semibold text-gray-800">
              {offer.room_type || "Standard Room"}
            </h4>
          </div>
          <RoomFeatures
            description={offer.description}
            roomType={offer.room_type}
            hotelAmenities={hotelAmenities}
          />
        </div>
        <div className="text-right ml-4 flex-shrink-0">
          <p className="text-xl font-bold text-gray-900">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: offer.price.currency || "USD",
            }).format(parseFloat(offer.price.total))}
          </p>
          <p className="text-xs text-gray-500">
            {nights} {nights === 1 ? "night" : "nights"} total
          </p>
          <p className="text-xs text-gray-500">
            ~
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: offer.price.currency || "USD",
            }).format(pricePerNight)}
            /night
          </p>
        </div>
      </div>
      {offer.policies?.cancellations && (
        <div className="mt-3 pl-7">
          {offer.policies.cancellations.map(
            (policy: { deadline: string }, index: number) => (
              <div
                key={index}
                className="flex items-center text-sm text-green-600"
              >
                <Check className="h-4 w-4 mr-2" />
                <span>
                  Free cancellation before{" "}
                  {new Date(policy.deadline).toLocaleDateString()}
                </span>
              </div>
            )
          )}
        </div>
      )}
      <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-300">
        Select Offer
      </button>
    </div>
  );
};

const SearchResults = ({ hotel, nights }: SearchResultsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl group">
      <HotelImage hotelId={hotel.id} hotelName={hotel.name} />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
            <div className="flex items-center mt-1">
              <MapPin className="h-4 w-4 text-gray-500 mr-1" />
              <p className="text-sm text-gray-600">
                {hotel.address.cityName}, {hotel.address.countryCode}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 ml-4">
            {hotel.rating && renderStars(hotel.rating)}
          </div>
        </div>

        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
              Key Amenities
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {hotel.amenities.slice(0, 4).map((amenity) => (
                <AmenityIcon key={amenity} amenity={amenity} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          {hotel.offers?.slice(0, 2).map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              nights={nights}
              hotelAmenities={hotel.amenities}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;

import React, { useState, useEffect } from "react";
import { useCurrentUser } from "../hooks/useApi";
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
} from "lucide-react";

const featureIcons: { [key: string]: React.ReactElement } = {
  "free wifi": <Wifi className="w-5 h-5 mr-2" />,
  pool: <Utensils className="w-5 h-5 mr-2" />, // No pool icon, using utensils as placeholder
  gym: <Building className="w-5 h-5 mr-2" />, // No gym icon, using building as placeholder
  "free parking": <ParkingCircle className="w-5 h-5 mr-2" />,
  "air conditioning": <Wind className="w-5 h-5 mr-2" />,
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

const HotelDashboardPage: React.FC = () => {
  const { user, isLoading, error } = useCurrentUser();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (user?.hotel_profile?.images?.length > 0) {
      setSelectedImage(user.hotel_profile.images[0].image);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p>
          There was an error loading your hotel data. Please try again later.
        </p>
      </div>
    );
  }

  const hotelProfile = user?.hotel_profile;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {hotelProfile ? (
          <>
            <header className="mb-8 bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <div className="w-full md:w-1/3">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={hotelProfile.hotel_name}
                      className="w-full h-48 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg">
                      <Building className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="flex mt-2 space-x-2">
                    {hotelProfile.images?.map((image: any) => (
                      <img
                        key={image.id}
                        src={image.image}
                        alt={hotelProfile.hotel_name}
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
                  <h1 className="text-4xl font-bold text-gray-800">
                    {hotelProfile.hotel_name}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage your hotel profile and bookings.
                  </p>
                </div>
                <div className="flex items-center mt-4 md:mt-0">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < hotelProfile.hotel_stars
                          ? "text-yellow-400"
                          : "text-gray-300"
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
                  <p className="text-gray-600">{hotelProfile.description}</p>
                </InfoCard>

                <InfoCard title="Features" icon={<CheckSquare />}>
                  <div className="flex flex-wrap gap-4">
                    {hotelProfile.features
                      ?.split(",")
                      .map((feature: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center bg-gray-200 text-gray-800 px-4 py-2 rounded-full"
                        >
                          {featureIcons[feature.trim().toLowerCase()] || (
                            <CheckSquare className="w-5 h-5 mr-2" />
                          )}
                          <span>{feature.trim()}</span>
                        </div>
                      ))}
                  </div>
                </InfoCard>
              </div>

              <div className="space-y-8">
                <InfoCard title="Details" icon={<Building />}>
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-5 h-5 mr-3" />
                      <span>{hotelProfile.address}</span>
                    </div>
                    {hotelProfile.website && (
                      <div className="flex items-center text-gray-700">
                        <Globe className="w-5 h-5 mr-3" />
                        <a
                          href={hotelProfile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {hotelProfile.website}
                        </a>
                      </div>
                    )}
                  </div>
                </InfoCard>

                <InfoCard title="Pricing & Availability" icon={<DollarSign />}>
                  <div className="space-y-4">
                    {hotelProfile.price_per_night && (
                      <div className="flex items-center text-gray-700">
                        <DollarSign className="w-5 h-5 mr-3 text-green-500" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            ${hotelProfile.price_per_night}
                          </p>
                          <p className="text-sm text-gray-600">per night</p>
                        </div>
                      </div>
                    )}
                    {hotelProfile.availability_start_date &&
                      hotelProfile.availability_end_date && (
                        <div className="flex items-center text-gray-700">
                          <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                          <div>
                            <p className="font-semibold text-gray-900">
                              Available
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(
                                hotelProfile.availability_start_date
                              ).toLocaleDateString()}{" "}
                              -{" "}
                              {new Date(
                                hotelProfile.availability_end_date
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                  </div>
                </InfoCard>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No hotel profile found.</p>
            <p className="text-sm text-gray-500 mt-2">
              Please complete your hotel registration to manage your dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelDashboardPage;

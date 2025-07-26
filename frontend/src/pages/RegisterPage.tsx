import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Mail,
  Lock,
  User,
  Plane,
  Wifi,
  Car,
  Waves,
  Heart,
  Dumbbell,
  UtensilsCrossed,
  BellRing,
  Wine,
  Wind,
  Building2,
} from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useRegister } from "../hooks/useApi";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  hotelName?: string;
  address?: string;
  website?: string;
  description?: string;
  amenities?: string[];
}

const HOTEL_AMENITIES = [
  { id: "wifi", label: "WiFi", icon: <Wifi className="w-5 h-5" /> },
  { id: "parking", label: "Parking", icon: <Car className="w-5 h-5" /> },
  { id: "pool", label: "Pool", icon: <Waves className="w-5 h-5" /> },
  { id: "spa", label: "Spa", icon: <Heart className="w-5 h-5" /> },
  { id: "gym", label: "Gym", icon: <Dumbbell className="w-5 h-5" /> },
  {
    id: "restaurant",
    label: "Restaurant",
    icon: <UtensilsCrossed className="w-5 h-5" />,
  },
  {
    id: "room_service",
    label: "Room Service",
    icon: <BellRing className="w-5 h-5" />,
  },
  { id: "bar", label: "Bar", icon: <Wine className="w-5 h-5" /> },
  {
    id: "air_conditioning",
    label: "Air Conditioning",
    icon: <Wind className="w-5 h-5" />,
  },
  {
    id: "conference_room",
    label: "Conference Room",
    icon: <Building2 className="w-5 h-5" />,
  },
];

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>();
  const registerMutation = useRegister();

  const password = watch("password");
  const role = watch("role");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);

      const registrationData = {
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        role: data.role,
        ...(data.role === "HOTEL" && {
          hotel: {
            name: data.hotelName || "",
            address: data.address || "",
            website: data.website || "",
            description: data.description || "",
            amenities: selectedAmenities,
          },
        }),
      };

      console.log("Registration data:", registrationData);

      await registerMutation.mutateAsync(registrationData);
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          if (errorData.email) {
            setError(`Email error: ${errorData.email[0]}`);
          } else if (errorData.password) {
            setError(`Password error: ${errorData.password[0]}`);
          } else if (errorData.first_name) {
            setError(`First name error: ${errorData.first_name[0]}`);
          } else if (errorData.last_name) {
            setError(`Last name error: ${errorData.last_name[0]}`);
          } else if (errorData.password_confirm) {
            setError(
              `Password confirmation error: ${errorData.password_confirm[0]}`
            );
          } else if (errorData.non_field_errors) {
            setError(errorData.non_field_errors[0]);
          } else if (typeof errorData === "object") {
            const firstError = Object.values(errorData)[0];
            if (Array.isArray(firstError)) {
              setError(firstError[0]);
            } else {
              setError(String(firstError));
            }
          } else {
            setError(
              typeof errorData === "string"
                ? errorData
                : "Registration failed. Please check your input and try again."
            );
          }
        } catch {
          setError(error.message);
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <Plane className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              {...register("firstName", {
                required: "First name is required",
              })}
              error={errors.firstName?.message}
              icon={<User className="w-5 h-5 text-gray-400" />}
            />
            <Input
              label="Last Name"
              {...register("lastName", {
                required: "Last name is required",
              })}
              error={errors.lastName?.message}
              icon={<User className="w-5 h-5 text-gray-400" />}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            error={errors.email?.message}
            icon={<Mail className="w-5 h-5 text-gray-400" />}
          />

          <Input
            label="Password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
                message:
                  "Password must contain at least one letter and one number",
              },
            })}
            error={errors.password?.message}
            icon={<Lock className="w-5 h-5 text-gray-400" />}
          />

          <Input
            label="Confirm Password"
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "The passwords do not match",
            })}
            error={errors.confirmPassword?.message}
            icon={<Lock className="w-5 h-5 text-gray-400" />}
          />

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Register as
            </label>
            <select
              id="role"
              {...register("role")}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              defaultValue="USER"
            >
              <option value="USER">User</option>
              <option value="HOTEL">Hotel</option>
            </select>
          </div>

          {role === "HOTEL" && (
            <>
              <Input
                label="Hotel Name"
                {...register("hotelName", {
                  required: "Hotel name is required",
                })}
                error={errors.hotelName?.message}
                icon={<User className="w-5 h-5 text-gray-400" />}
              />
              <Input
                label="Address"
                {...register("address", {
                  required: "Address is required",
                })}
                error={errors.address?.message}
                icon={<User className="w-5 h-5 text-gray-400" />}
              />
              <Input
                label="Website (Optional)"
                type="url"
                {...register("website")}
                error={errors.website?.message}
                icon={<User className="w-5 h-5 text-gray-400" />}
              />
              <Input
                label="Description (Optional)"
                {...register("description")}
                error={errors.description?.message}
                icon={<User className="w-5 h-5 text-gray-400" />}
              />

              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-800">
                  Hotel Amenities
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  Select the amenities available at your hotel
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {HOTEL_AMENITIES.map((amenity) => (
                    <label
                      key={amenity.id}
                      className={`flex items-center p-4 rounded-lg border transition-all cursor-pointer ${
                        selectedAmenities.includes(amenity.id)
                          ? "bg-blue-50 border-blue-500 shadow-sm"
                          : "bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-50/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedAmenities.includes(amenity.id)}
                        onChange={() => handleAmenityToggle(amenity.id)}
                      />
                      <div className="flex items-center">
                        <div
                          className={`text-blue-500 mr-3 ${
                            selectedAmenities.includes(amenity.id)
                              ? "scale-110 transform"
                              : ""
                          }`}
                        >
                          {amenity.icon}
                        </div>
                        <span
                          className={`text-sm ${
                            selectedAmenities.includes(amenity.id)
                              ? "text-blue-700 font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          {amenity.label}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
                {selectedAmenities.length === 0 && (
                  <p className="text-sm text-red-500 mt-2">
                    Please select at least one amenity
                  </p>
                )}
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full"
            loading={registerMutation.isPending}
            disabled={role === "HOTEL" && selectedAmenities.length === 0}
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

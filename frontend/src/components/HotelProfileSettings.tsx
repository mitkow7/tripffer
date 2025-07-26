import React from "react";
import { useFormContext } from "react-hook-form";
import Input from "./ui/Input";

interface HotelProfileSettingsProps {
  user: any;
  onImageChange: (files: FileList) => void;
}

const HotelProfileSettings: React.FC<HotelProfileSettingsProps> = ({
  user,
  onImageChange,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hotel Images
        </label>
        <input
          type="file"
          multiple
          onChange={(e) => onImageChange(e.target.files!)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Upload one or more images for your hotel
        </p>
      </div>

      <Input
        label="Hotel Name"
        {...register("hotel_name", { required: "Hotel name is required" })}
        error={errors.hotel_name?.message as string}
      />

      <Input
        label="Address"
        {...register("hotel_address", { required: "Address is required" })}
        error={errors.hotel_address?.message as string}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Contact Email"
          type="email"
          readOnly
          {...register("hotel_contact_email")}
          error={errors.hotel_contact_email?.message as string}
        />
        <Input
          label="Contact Phone"
          type="tel"
          {...register("hotel_contact_phone")}
          error={errors.hotel_contact_phone?.message as string}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Website"
          type="url"
          {...register("hotel_website")}
          error={errors.hotel_website?.message as string}
        />
        <Input
          label="Price per night"
          type="number"
          step="0.01"
          {...register("hotel_price_per_night")}
          error={errors.hotel_price_per_night?.message as string}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <Input
          label="Guest Score"
          type="number"
          readOnly
          {...register("hotel_guest_score")}
          error={errors.hotel_guest_score?.message as string}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Availability Start Date"
          type="date"
          {...register("hotel_availability_start_date")}
        />
        <Input
          label="Availability End Date"
          type="date"
          {...register("hotel_availability_end_date")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register("hotel_description")}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tell us about your hotel..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Features
        </label>
        <textarea
          {...register("hotel_features")}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Free WiFi, Pool, Gym"
        />
        <p className="text-xs text-gray-500 mt-1">
          Comma-separated list of features
        </p>
      </div>
    </>
  );
};

export default HotelProfileSettings;

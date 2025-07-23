import React from "react";
import { useFormContext } from "react-hook-form";
import Input from "./ui/Input";

interface HotelProfileSettingsProps {
  onImageChange: (files: FileList) => void;
}

const HotelProfileSettings: React.FC<HotelProfileSettingsProps> = ({
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
        {...register("hotelName", { required: "Hotel name is required" })}
        error={errors.hotelName?.message as string}
      />

      <Input
        label="Address"
        {...register("address", { required: "Address is required" })}
        error={errors.address?.message as string}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Website"
          type="url"
          {...register("website")}
          error={errors.website?.message as string}
        />
        <Input
          label="Price per night"
          type="number"
          step="0.01"
          {...register("pricePerNight")}
          error={errors.pricePerNight?.message as string}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Availability Start Date"
          type="date"
          {...register("availabilityStartDate")}
        />
        <Input
          label="Availability End Date"
          type="date"
          {...register("availabilityEndDate")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register("description")}
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
          {...register("features")}
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

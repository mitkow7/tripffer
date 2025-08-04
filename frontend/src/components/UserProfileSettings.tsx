import React from "react";
import { useFormContext } from "react-hook-form";
import Input from "./ui/Input";
import ProfilePicture from "./ui/ProfilePicture";
import { Mail, Phone, Calendar, User } from "lucide-react";
import { useUpdateProfile } from "../hooks/useApi";
import { getImageUrl } from "../config/api";

interface UserProfileSettingsProps {
  user: any;
  onImageChange: (file: File) => void;
  tempProfilePictureUrl?: string;
}

const UserProfileSettings: React.FC<UserProfileSettingsProps> = ({
  user,
  onImageChange,
  tempProfilePictureUrl,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const updateProfile = useUpdateProfile();

  // Construct the full URL for the profile picture with timestamp to prevent caching
  const profilePictureUrl = user?.profile?.profile_picture
    ? getImageUrl(user.profile.profile_picture, true)
    : undefined;

  return (
    <>
      <div className="flex items-center space-x-6 mb-6">
        <ProfilePicture
          currentImage={profilePictureUrl}
          onImageChange={(file) => {
            onImageChange(file);
          }}
          size="lg"
          editable={true}
          tempImage={tempProfilePictureUrl}
        />
        <div>
          <h3 className="text-lg font-medium text-gray-900">Profile Photo</h3>
          <p className="text-sm text-gray-600">Upload a new profile picture</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          defaultValue={user?.first_name}
          icon={<User className="w-5 h-5 text-gray-400" />}
          {...register("first_name", { required: "First name is required" })}
          error={errors.first_name?.message as string}
        />
        <Input
          label="Last Name"
          defaultValue={user?.last_name}
          icon={<User className="w-5 h-5 text-gray-400" />}
          {...register("last_name", { required: "Last name is required" })}
          error={errors.last_name?.message as string}
        />
      </div>

      <Input
        label="Email Address"
        type="email"
        defaultValue={user?.email}
        icon={<Mail className="w-5 h-5 text-gray-400" />}
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        })}
        error={errors.email?.message as string}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Phone Number"
          defaultValue={user?.profile?.phone_number}
          icon={<Phone className="w-5 h-5 text-gray-400" />}
          {...register("phone_number")}
          error={errors.phone_number?.message as string}
          placeholder="+1 (555) 000-0000"
        />
        <Input
          label="Date of Birth"
          type="date"
          defaultValue={user?.profile?.date_of_birth}
          icon={<Calendar className="w-5 h-5 text-gray-400" />}
          {...register("date_of_birth")}
          max={new Date().toISOString().split("T")[0]}
          error={errors.date_of_birth?.message as string}
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Bio</label>
        <p className="text-sm text-gray-500 mb-2">
          Write a short introduction about yourself
        </p>
        <textarea
          {...register("bio")}
          defaultValue={user?.profile?.bio}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Tell us about yourself..."
        />
      </div>
    </>
  );
};

export default UserProfileSettings;

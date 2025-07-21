import React from "react";
import { useFormContext } from "react-hook-form";
import Input from "./ui/Input";
import ProfilePicture from "./ui/ProfilePicture";
import { Mail } from "lucide-react";

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

  return (
    <>
      <div className="flex items-center space-x-6 mb-6">
        <ProfilePicture
          currentImage={user?.profile?.profile_picture}
          onImageChange={(file) => onImageChange(file)}
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
          {...register("firstName", { required: "First name is required" })}
          error={errors.firstName?.message as string}
        />
        <Input
          label="Last Name"
          {...register("lastName", { required: "Last name is required" })}
          error={errors.lastName?.message as string}
        />
      </div>

      <Input
        label="Email Address"
        type="email"
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
        <Input label="Phone Number" {...register("phone")} />
        <Input
          label="Date of Birth"
          type="date"
          {...register("dateOfBirth")}
          max={new Date().toISOString().split("T")[0]}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          {...register("bio")}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tell us about yourself..."
        />
      </div>
    </>
  );
};

export default UserProfileSettings;

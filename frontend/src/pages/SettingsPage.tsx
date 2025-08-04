import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  User,
  Lock,
  Shield,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
} from "lucide-react";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import {
  useCurrentUser,
  useChangePassword,
  useUpdateProfile,
  useMyHotel,
  useUpdateHotel,
  useDeleteAccount,
} from "../hooks/useApi";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import UserProfileSettings from "../components/UserProfileSettings";
import HotelProfileSettings from "../components/HotelProfileSettings";

interface FormData {
  // User fields
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  date_of_birth?: string;
  bio?: string;
  // Hotel fields
  hotel_name?: string;
  hotel_address?: string;
  hotel_website?: string;
  hotel_contact_email?: string;
  hotel_contact_phone?: string;
  hotel_price_per_night?: number;
  hotel_availability_start_date?: string;
  hotel_availability_end_date?: string;
  hotel_features?: string;
  hotel_description?: string;
  hotel_guest_score?: number;
}

interface SecurityFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SettingsPage: React.FC = () => {
  const { data: user, isLoading, error, refetch } = useCurrentUser() as any;
  const {
    data: hotelData,
    isLoading: hotelLoading,
    error: hotelError,
  } = useMyHotel();
  const updateProfile = useUpdateProfile();
  const updateHotel = useUpdateHotel();
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "privacy"
  >("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [tempProfileImages, setTempProfileImages] = useState<File[]>([]);
  const [tempProfilePictureUrl, setTempProfilePictureUrl] = useState<
    string | undefined
  >(undefined);

  // Form hooks
  const methods = useForm<FormData>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      date_of_birth: "",
      bio: "",
      hotel_name: "",
      hotel_address: "",
      hotel_website: "",
      hotel_contact_email: "",
      hotel_contact_phone: "",
      hotel_price_per_night: 0,
      hotel_availability_start_date: "",
      hotel_availability_end_date: "",
      hotel_features: "",
      hotel_description: "",
      hotel_guest_score: 0,
    },
  });

  // Update form with user data when it's loaded
  useEffect(() => {
    if (user) {
      if (user.role === "HOTEL" && hotelData) {
        methods.reset({
          hotel_name: hotelData.name || "",
          hotel_address: hotelData.address || "",
          hotel_website: hotelData.website || "",
          hotel_contact_email: user.email || "",
          hotel_contact_phone: hotelData.contact_phone || "",
          hotel_price_per_night: hotelData.price_per_night || 0,
          hotel_availability_start_date:
            hotelData.availability_start_date || "",
          hotel_availability_end_date: hotelData.availability_end_date || "",
          hotel_features: Array.isArray(hotelData.features)
            ? hotelData.features.join(", ")
            : hotelData.features || "",
          hotel_description: hotelData.description || "",
          hotel_guest_score: hotelData.guest_score
            ? Math.round(hotelData.guest_score * 10) / 10
            : 0,
        });
      } else if (user.role !== "HOTEL") {
        methods.reset({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          phone_number: user.profile?.phone_number || "",
          date_of_birth: user.profile?.date_of_birth || "",
          bio: user.profile?.bio || "",
        });
      }
      // Reset temp profile picture when user data changes
      setTempProfileImages([]);
      setTempProfilePictureUrl(undefined);
    }
  }, [user, hotelData, methods]);

  const securityForm = useForm<SecurityFormData>();
  const changePassword = useChangePassword();
  const deleteAccount = useDeleteAccount();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "privacy", label: "Privacy", icon: Shield },
  ];

  const handleImageChange = (files: FileList | null) => {
    if (files) {
      setTempProfileImages(Array.from(files));
    }
  };

  const handleProfileSubmit = async (data: FormData) => {
    setSaveStatus("saving");
    try {
      if (user.role === "HOTEL") {
        // Update hotel data using hotel-specific endpoint
        const hotelData = {
          ...data,
          hotel_images: tempProfileImages, // Include selected images
        };
        await updateHotel.mutateAsync(hotelData);
      } else {
        // Update user profile data
        const formData: any = {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone_number: data.phone_number,
          date_of_birth: data.date_of_birth,
          bio: data.bio,
        };

        // Add profile picture if one was selected
        if (tempProfileImages.length > 0) {
          formData.profile_picture = tempProfileImages[0];
          console.log(
            "Profile picture added to form data:",
            tempProfileImages[0]
          );
        } else {
          console.log("No profile picture selected");
        }

        console.log("Submitting profile update with data:", formData);
        await updateProfile.mutateAsync(formData);
      }

      // Clear temporary profile picture data
      if (tempProfilePictureUrl) {
        URL.revokeObjectURL(tempProfilePictureUrl);
      }
      setTempProfileImages([]);
      setTempProfilePictureUrl(undefined);

      // Refetch user data to get the updated profile
      console.log("Refetching user data after profile update");
      await refetch();

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
      console.log("Profile update completed successfully");
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  const handleSecuritySubmit = async (data: SecurityFormData) => {
    setSaveStatus("saving");
    try {
      await changePassword.mutateAsync({
        old_password: data.currentPassword,
        new_password: data.newPassword,
        new_password_confirm: data.confirmPassword,
      });
      setSaveStatus("saved");
      securityForm.reset();
    } catch (error) {
      setSaveStatus("error");
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          // Set form errors
          Object.keys(errorData).forEach((key) => {
            securityForm.setError(key as any, {
              type: "manual",
              message: errorData[key].join(" "),
            });
          });
        } catch {
          securityForm.setError("root", {
            type: "manual",
            message: error.message,
          });
        }
      }
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount.mutateAsync();
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  if (isLoading || (user?.role === "HOTEL" && hotelLoading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || (user?.role === "HOTEL" && hotelError)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">
            {error
              ? "Failed to load user data. Please try again later."
              : "Failed to load hotel data. Please try again later."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600">
            Manage your account preferences and security settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <FormProvider {...methods}>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Profile Information
                    </h2>
                    {saveStatus === "saved" && (
                      <div className="flex items-center text-green-600">
                        <Check className="w-5 h-5 mr-2" />
                        <span>Saved successfully</span>
                      </div>
                    )}
                  </div>

                  <form
                    onSubmit={methods.handleSubmit(handleProfileSubmit)}
                    className="space-y-6"
                  >
                    {user.role === "HOTEL" ? (
                      hotelData ? (
                        <HotelProfileSettings
                          user={user}
                          onImageChange={handleImageChange}
                        />
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-600">
                            No hotel profile found. Please create your hotel
                            profile first.
                          </p>
                        </div>
                      )
                    ) : (
                      <UserProfileSettings
                        user={user}
                        onImageChange={(file) => setTempProfileImages([file])}
                        tempProfilePictureUrl={tempProfilePictureUrl}
                      />
                    )}

                    <Button
                      type="submit"
                      loading={saveStatus === "saving"}
                      className="w-full md:w-auto"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </form>
                </Card>
              </FormProvider>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Change Password
                  </h2>

                  <form
                    onSubmit={securityForm.handleSubmit(handleSecuritySubmit)}
                    className="space-y-6"
                  >
                    <div className="relative">
                      <Input
                        label="Current Password"
                        type={showCurrentPassword ? "text" : "password"}
                        {...securityForm.register("currentPassword", {
                          required: "Current password is required",
                        })}
                        error={
                          securityForm.formState.errors.currentPassword?.message
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <div className="relative">
                      <Input
                        label="New Password"
                        type={showNewPassword ? "text" : "password"}
                        {...securityForm.register("newPassword", {
                          required: "New password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
                        })}
                        error={
                          securityForm.formState.errors.newPassword?.message
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <div className="relative">
                      <Input
                        label="Confirm New Password"
                        type={showConfirmPassword ? "text" : "password"}
                        {...securityForm.register("confirmPassword", {
                          required: "Please confirm your password",
                          validate: (value) =>
                            value === securityForm.watch("newPassword") ||
                            "Passwords do not match",
                        })}
                        error={
                          securityForm.formState.errors.confirmPassword?.message
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <Button type="submit" loading={saveStatus === "saving"}>
                      <Lock className="w-4 h-4 mr-2" />
                      Update Password
                    </Button>
                  </form>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add an extra layer of security to your account by enabling
                    two-factor authentication.
                  </p>
                  <Button variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Enable 2FA
                  </Button>
                </Card>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <Card className="p-6 border-red-200 bg-red-50">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
                    <h3 className="text-lg font-semibold text-red-900">
                      Delete Account
                    </h3>
                  </div>
                  <p className="text-red-700 mb-6">
                    This action cannot be undone. This will permanently delete
                    your account and remove all associated data from our
                    servers.
                  </p>
                  {!showDeleteConfirm ? (
                    <Button
                      variant="destructive"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full sm:w-auto"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-red-800 font-medium">
                        Are you absolutely sure you want to delete your account?
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          variant="destructive"
                          onClick={handleDeleteAccount}
                          loading={deleteAccount.isPending}
                          className="w-full sm:w-auto"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Yes, Delete My Account
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowDeleteConfirm(false)}
                          className="w-full sm:w-auto"
                        >
                          Cancel
                        </Button>
                      </div>
                      {deleteAccount.isError && (
                        <p className="text-sm text-red-600 mt-2">
                          {deleteAccount.error?.message ||
                            "Failed to delete account. Please try again."}
                        </p>
                      )}
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

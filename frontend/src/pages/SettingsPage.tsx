import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  User,
  Mail,
  Lock,
  Bell,
  Globe,
  Shield,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Check,
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

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  bookingUpdates: boolean;
  priceAlerts: boolean;
  newsletter: boolean;
}

interface PreferenceSettings {
  currency: string;
  language: string;
  timezone: string;
  theme: string;
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
    "profile" | "security" | "notifications" | "preferences" | "privacy"
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

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    bookingUpdates: true,
    priceAlerts: true,
    newsletter: false,
  });

  // Update notifications with user data when loaded
  useEffect(() => {
    if (user?.notification_preferences) {
      setNotifications((prev) => ({
        ...prev,
        emailNotifications:
          user.notification_preferences.email_notifications ??
          prev.emailNotifications,
        pushNotifications:
          user.notification_preferences.push_notifications ??
          prev.pushNotifications,
        marketingEmails:
          user.notification_preferences.marketing_emails ??
          prev.marketingEmails,
        bookingUpdates:
          user.notification_preferences.booking_updates ?? prev.bookingUpdates,
        priceAlerts:
          user.notification_preferences.price_alerts ?? prev.priceAlerts,
        newsletter: user.notification_preferences.newsletter ?? prev.newsletter,
      }));
    }
  }, [user]);

  const [preferences, setPreferences] = useState<PreferenceSettings>({
    currency: "USD",
    language: "en",
    timezone: "America/New_York",
    theme: "light",
  });

  // Update preferences with user data when loaded
  useEffect(() => {
    if (user?.preferences) {
      setPreferences((prev) => ({
        ...prev,
        currency: user.preferences.currency || prev.currency,
        language: user.preferences.language || prev.language,
        timezone: user.preferences.timezone || prev.timezone,
        theme: user.preferences.theme || prev.theme,
      }));
    }
  }, [user]);

  const changePassword = useChangePassword();

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Globe },
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
          hotel_images: tempProfileImages // Include selected images
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
        }

        await updateProfile.mutateAsync(formData);
      }

      // Clear temporary profile picture data
      if (tempProfilePictureUrl) {
        URL.revokeObjectURL(tempProfilePictureUrl);
      }
      setTempProfileImages([]);
      setTempProfilePictureUrl(undefined);

      // Refetch user data to get the updated profile
      await refetch();

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
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

  const handleNotificationChange = async (key: keyof NotificationSettings) => {
    const newValue = !notifications[key];
    setNotifications((prev) => ({
      ...prev,
      [key]: newValue,
    }));

    try {
      const response = await fetch(
        "http://localhost:8000/api/accounts/notifications/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({
            [key]: newValue,
          }),
        }
      );

      if (!response.ok) {
        // Revert the change if the update failed
        setNotifications((prev) => ({
          ...prev,
          [key]: !newValue,
        }));
        throw new Error("Failed to update notification settings");
      }
    } catch (error) {
      // console.error("Failed to update notification settings:", error);
    }
  };

  const handlePreferenceChange = async (
    key: keyof PreferenceSettings,
    value: string
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));

    try {
      const response = await fetch(
        "http://localhost:8000/api/accounts/preferences/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({ [key]: value }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update preferences");
      }
    } catch (error) {
      // console.error("Failed to update preferences:", error);
    }
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      // console.log("Delete account requested");
      // Replace with your actual API call
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

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Notification Preferences
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      General Notifications
                    </h3>
                    <div className="space-y-4">
                      {Object.entries({
                        emailNotifications: "Email Notifications",
                        pushNotifications: "Push Notifications",
                        bookingUpdates: "Booking Updates",
                        priceAlerts: "Price Alerts",
                      }).map(([key, label]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <label className="text-sm font-medium text-gray-900">
                              {label}
                            </label>
                            <p className="text-sm text-gray-600">
                              {key === "emailNotifications" &&
                                "Receive notifications via email"}
                              {key === "pushNotifications" &&
                                "Receive push notifications on your device"}
                              {key === "bookingUpdates" &&
                                "Get updates about your bookings and trips"}
                              {key === "priceAlerts" &&
                                "Be notified when prices drop for saved trips"}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={
                                notifications[key as keyof NotificationSettings]
                              }
                              onChange={() =>
                                handleNotificationChange(
                                  key as keyof NotificationSettings
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Marketing Communications
                    </h3>
                    <div className="space-y-4">
                      {Object.entries({
                        marketingEmails: "Marketing Emails",
                        newsletter: "Newsletter",
                      }).map(([key, label]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <label className="text-sm font-medium text-gray-900">
                              {label}
                            </label>
                            <p className="text-sm text-gray-600">
                              {key === "marketingEmails" &&
                                "Receive promotional offers and deals"}
                              {key === "newsletter" &&
                                "Get our weekly travel newsletter"}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={
                                notifications[key as keyof NotificationSettings]
                              }
                              onChange={() =>
                                handleNotificationChange(
                                  key as keyof NotificationSettings
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Preferences
                </h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        value={preferences.currency}
                        onChange={(e) =>
                          handlePreferenceChange("currency", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        value={preferences.language}
                        onChange={(e) =>
                          handlePreferenceChange("language", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="it">Italiano</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={preferences.timezone}
                        onChange={(e) =>
                          handlePreferenceChange("timezone", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="America/New_York">
                          Eastern Time (ET)
                        </option>
                        <option value="America/Chicago">
                          Central Time (CT)
                        </option>
                        <option value="America/Denver">
                          Mountain Time (MT)
                        </option>
                        <option value="America/Los_Angeles">
                          Pacific Time (PT)
                        </option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Europe/Paris">Paris (CET)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Theme
                      </label>
                      <select
                        value={preferences.theme}
                        onChange={(e) =>
                          handlePreferenceChange("theme", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Privacy Settings
                  </h2>

                  <div className="space-y-6">
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Account Visibility
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-900">
                              Profile Visibility
                            </label>
                            <p className="text-sm text-gray-600">
                              Control who can see your profile information
                            </p>
                          </div>
                          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Public</option>
                            <option>Friends Only</option>
                            <option>Private</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-red-200 bg-red-50">
                  <h3 className="text-lg font-semibold text-red-900 mb-4">
                    Danger Zone
                  </h3>
                  <p className="text-red-700 mb-4">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
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

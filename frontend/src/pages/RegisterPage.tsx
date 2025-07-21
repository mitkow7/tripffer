import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail, Lock, User, Plane } from "lucide-react";
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
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
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

      const registrationData: any = {
        email: data.email,
        username: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        password: data.password,
        password_confirm: data.confirmPassword,
        role: data.role,
      };

      if (data.role === "HOTEL") {
        registrationData.hotel_profile = {
          hotel_name: data.hotelName,
          address: data.address,
          website: data.website,
          description: data.description,
        };
      }

      await registerMutation.mutateAsync(registrationData);
      navigate("/login");
    } catch (error) {
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          // Handle specific error messages
          if (errorData.email) {
            setError(`Email error: ${errorData.email[0]}`);
          } else if (errorData.password) {
            setError(`Password error: ${errorData.password[0]}`);
          } else if (errorData.username) {
            setError(`Username error: ${errorData.username[0]}`);
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
          } else {
            // If there's a general error message
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
            </>
          )}

          <Button
            type="submit"
            className="w-full"
            loading={registerMutation.isPending}
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

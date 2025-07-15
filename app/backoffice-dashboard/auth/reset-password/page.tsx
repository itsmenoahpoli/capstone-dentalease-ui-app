"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Card, Text, Button, Heading, Link } from "@radix-ui/themes";
import {
  LockClosedIcon,
  EyeOpenIcon,
  EyeNoneIcon,
  CheckIcon,
} from "@radix-ui/react-icons";

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>();

  const watchedPassword = watch("password");
  const watchedConfirmPassword = watch("confirmPassword");

  const isPasswordValid = watchedPassword && watchedPassword.length >= 8;
  const isConfirmPasswordValid =
    watchedPassword === watchedConfirmPassword &&
    watchedConfirmPassword.length > 0;

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      console.log("Resetting password for user");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Password reset successfully!");
      setIsSubmitted(true);
    } catch {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8 shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <LockClosedIcon className="w-8 h-8 text-white" />
        </div>
        <Heading size="6" className="text-gray-900 mb-2">
          Reset Password
        </Heading>
        <Text size="3" color="gray" className="text-gray-600">
          Enter your new password below
        </Text>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Text size="2" weight="medium" className="text-gray-700">
              New Password
            </Text>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                className={`w-full h-12 pl-10 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  watchedPassword
                    ? isPasswordValid
                      ? "border-green-300 bg-green-50"
                      : "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeNoneIcon className="w-4 h-4" />
                ) : (
                  <EyeOpenIcon className="w-4 h-4" />
                )}
              </button>
            </div>
            {watchedPassword && (
              <Text
                size="1"
                color={isPasswordValid ? "green" : "red"}
                className="flex items-center"
              >
                {isPasswordValid ? (
                  <CheckIcon className="w-3 h-3 mr-1" />
                ) : null}
                {isPasswordValid
                  ? "Password meets requirements"
                  : "Password must be at least 8 characters"}
              </Text>
            )}
            {errors.password && (
              <Text size="1" color="red" className="text-red-600">
                {errors.password.message}
              </Text>
            )}
          </div>

          <div className="space-y-2">
            <Text size="2" weight="medium" className="text-gray-700">
              Confirm New Password
            </Text>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watchedPassword || "Passwords do not match",
                })}
                className={`w-full h-12 pl-10 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  watchedConfirmPassword
                    ? isConfirmPasswordValid
                      ? "border-green-300 bg-green-50"
                      : "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeNoneIcon className="w-4 h-4" />
                ) : (
                  <EyeOpenIcon className="w-4 h-4" />
                )}
              </button>
            </div>
            {watchedConfirmPassword && (
              <Text
                size="1"
                color={isConfirmPasswordValid ? "green" : "red"}
                className="flex items-center"
              >
                {isConfirmPasswordValid ? (
                  <CheckIcon className="w-3 h-3 mr-1" />
                ) : null}
                {isConfirmPasswordValid
                  ? "Passwords match"
                  : "Passwords do not match"}
              </Text>
            )}
            {errors.confirmPassword && (
              <Text size="1" color="red" className="text-red-600">
                {errors.confirmPassword.message}
              </Text>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || !isPasswordValid || !isConfirmPasswordValid}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      ) : (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckIcon className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <Heading size="5" className="text-gray-900 mb-2">
              Password Reset Successfully
            </Heading>
            <Text size="3" color="gray" className="text-gray-600">
              Your password has been updated. You can now sign in with your new
              password.
            </Text>
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/backoffice-dashboard/auth/sign-in"
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Back to Sign In
        </Link>
      </div>
    </Card>
  );
}

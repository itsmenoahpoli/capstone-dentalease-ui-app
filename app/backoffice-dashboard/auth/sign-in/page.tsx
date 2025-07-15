"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Card, Text, Button, Flex, Heading, Link } from "@radix-ui/themes";
import {
  EyeOpenIcon,
  EyeNoneIcon,
  LockClosedIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

interface SignInFormData {
  email: string;
  password: string;
}

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock validation - replace with actual API call
      if (
        data.email === "admin@dentalease.com" &&
        data.password === "password123"
      ) {
        toast.success("Welcome back! Redirecting to dashboard...");
        // Redirect to dashboard after successful login
        setTimeout(() => {
          window.location.href = "/backoffice-dashboard/dashboard";
        }, 2000);
      } else {
        toast.error("Invalid email or password. Please try again.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
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
          Welcome Back
        </Heading>
        <Text size="3" color="gray" className="text-gray-600">
          Sign in to your DentalEase dashboard
        </Text>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Text size="2" weight="medium" className="text-gray-700">
            Email Address
          </Text>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PersonIcon className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
              })}
              className={`w-full h-12 pl-10 pr-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
            />
          </div>
          {errors.email && (
            <Text size="1" color="red" className="text-red-600">
              {errors.email.message}
            </Text>
          )}
        </div>

        <div className="space-y-2">
          <Text size="2" weight="medium" className="text-gray-700">
            Password
          </Text>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`w-full h-12 pl-10 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.password ? "border-red-300 bg-red-50" : "border-gray-300"
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
          {errors.password && (
            <Text size="1" color="red" className="text-red-600">
              {errors.password.message}
            </Text>
          )}
        </div>

        <Flex justify="between" align="center">
          <Link
            href="/backoffice-dashboard/auth/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Forgot password?
          </Link>
        </Flex>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Text size="2" color="gray" className="text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/backoffice-dashboard/auth/sign-up"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Contact administrator
          </Link>
        </Text>
      </div>
    </Card>
  );
}

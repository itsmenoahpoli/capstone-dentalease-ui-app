"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Card, Text, Button, Heading, Link } from "@radix-ui/themes";
import { EnvelopeClosedIcon, ArrowLeftIcon } from "@radix-ui/react-icons";

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>();

  const watchedEmail = watch("email");

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call with the email data
      console.log("Sending reset link to:", data.email);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Password reset link sent successfully!");
      setIsSubmitted(true);
    } catch {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8 shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <EnvelopeClosedIcon className="w-8 h-8 text-white" />
        </div>
        <Heading size="6" className="text-gray-900 mb-2">
          Forgot Password?
        </Heading>
        <Text size="3" color="gray" className="text-gray-600">
          Enter your email address and we&apos;ll send you a link to reset your
          password
        </Text>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Text size="2" weight="medium" className="text-gray-700">
              Email Address
            </Text>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeClosedIcon className="w-4 h-4 text-gray-400" />
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

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      ) : (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <EnvelopeClosedIcon className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <Heading size="5" className="text-gray-900 mb-2">
              Check Your Email
            </Heading>
            <Text size="3" color="gray" className="text-gray-600">
              We&apos;ve sent a password reset link to{" "}
              <strong>{watchedEmail}</strong>
            </Text>
          </div>
          <Text size="2" color="gray" className="text-gray-500">
            Didn&apos;t receive the email? Check your spam folder or try again.
          </Text>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/backoffice-dashboard/auth/sign-in"
          className="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Back to Sign In
        </Link>
      </div>
    </Card>
  );
}

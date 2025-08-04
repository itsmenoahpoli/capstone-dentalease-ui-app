"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextField, Flex, Button, Card, Text } from "@radix-ui/themes";
import { ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { ErrorLabel } from "@/components/shared/ErrorLabel";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type FormData = {
  otp: string;
};

export default function VerifyOTPPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResendOTP = async () => {
    setTimeLeft(300);
    setCanResend(false);
    console.log("Resending OTP to:", email);
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Verifying OTP:", data.otp);
      setIsSuccess(true);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to verify OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              OTP Verified
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your email has been verified successfully.
            </p>
          </div>

          <Card className="p-8">
            <div className="text-center space-y-4">
              <Link
                href="/user/auth/reset-password"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Continue to reset password
              </Link>

              <div className="pt-4">
                <Link
                  href="/user/auth/signin"
                  className="flex items-center justify-center text-sm text-blue-600 hover:text-blue-500"
                >
                  <ArrowLeft size="16" className="mr-2" />
                  Back to sign in
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification code to{" "}
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>

        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Flex direction="column" gap="2">
                <TextField.Root
                  type="text"
                  placeholder="Enter 6-digit code"
                  size="3"
                  maxLength={6}
                  {...register("otp", {
                    required: "OTP is required",
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: "Please enter a 6-digit code",
                    },
                  })}
                />
                <ErrorLabel
                  message={
                    typeof errors.otp?.message === "string"
                      ? errors.otp.message
                      : undefined
                  }
                />
              </Flex>
            </div>

            {error && <ErrorLabel message={error} />}

            <div className="text-center">
              <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
                <Clock size="16" className="mr-2" />
                Code expires in {formatTime(timeLeft)}
              </div>
            </div>

            <div>
              <Button
                type="submit"
                size="3"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>

            <div className="text-center space-y-4">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Resend code
                </button>
              ) : (
                <Text size="2" color="gray">
                  Didn't receive the code? Wait {formatTime(timeLeft)} to resend
                </Text>
              )}

              <div className="pt-2">
                <Link
                  href="/user/auth/signin"
                  className="flex items-center justify-center text-sm text-blue-600 hover:text-blue-500"
                >
                  <ArrowLeft size="16" className="mr-2" />
                  Back to sign in
                </Link>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

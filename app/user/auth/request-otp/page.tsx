"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Flex, Button, Card, Text } from "@radix-ui/themes";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { ErrorLabel } from "@/components/shared/ErrorLabel";
import Link from "next/link";

type FormData = {
  email: string;
};

export default function RequestOTPPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Request OTP for:", data.email);
      setIsSuccess(true);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to send OTP. Please try again.";
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
              Check your email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent a password reset link to your email address.
            </p>
          </div>

          <Card className="p-8">
            <div className="text-center space-y-4">
              <Text size="2" color="gray">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => setIsSuccess(false)}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  try again
                </button>
              </Text>

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
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Flex direction="column" gap="2">
                <TextField.Root
                  type="email"
                  placeholder="Email address"
                  size="3"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                >
                  <TextField.Slot>
                    <Mail size="16" />
                  </TextField.Slot>
                </TextField.Root>
                <ErrorLabel
                  message={
                    typeof errors.email?.message === "string"
                      ? errors.email.message
                      : undefined
                  }
                />
              </Flex>
            </div>

            {error && <ErrorLabel message={error} />}

            <div>
              <Button
                type="submit"
                size="3"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>
            </div>

            <div className="text-center">
              <Link
                href="/user/auth/signin"
                className="flex items-center justify-center text-sm text-blue-600 hover:text-blue-500"
              >
                <ArrowLeft size="16" className="mr-2" />
                Back to sign in
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

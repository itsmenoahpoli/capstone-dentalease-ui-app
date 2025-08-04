"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Flex, Button, Card, Text } from "@radix-ui/themes";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { ErrorLabel } from "@/components/shared/ErrorLabel";
import Link from "next/link";
import Image from "next/image";

type FormData = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Sign in attempt:", data);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Sign in failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex flex-col items-center mb-6">
            <Image
              src="/assets/brand-logo.png"
              alt="DentalEase Logo"
              width={80}
              height={80}
              className="mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              DentalEase
            </h1>
            <p className="text-sm text-gray-600">Your Dental Care Partner</p>
          </div>
        </div>

        <Card className="p-8">
          <p className="mt-2 mb-8 text-sm text-center text-gray-600">
            Sign in to your DentalEase patient account
          </p>
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

            <div>
              <Flex direction="column" gap="2">
                <TextField.Root
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  size="3"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                >
                  <TextField.Slot>
                    <Lock size="16" />
                  </TextField.Slot>
                  <TextField.Slot>
                    <Button
                      type="button"
                      variant="ghost"
                      size="1"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size="16" /> : <Eye size="16" />}
                    </Button>
                  </TextField.Slot>
                </TextField.Root>
                <ErrorLabel
                  message={
                    typeof errors.password?.message === "string"
                      ? errors.password.message
                      : undefined
                  }
                />
              </Flex>
            </div>

            {error && <ErrorLabel message={error} />}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/user/auth/request-otp"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                size="3"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </div>

            <div className="text-center">
              <Text size="2" color="gray">
                Don't have an account?{" "}
                <Link
                  href="/user/auth/signup"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up
                </Link>
              </Text>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Flex, Button, Card, Text } from "@radix-ui/themes";
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { ErrorLabel } from "@/components/shared/ErrorLabel";
import Link from "next/link";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Sign up attempt:", data);
      setIsSuccess(true);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Sign up failed. Please try again.";
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
              Account Created Successfully
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Welcome to DentalEase! You can now sign in to your account.
            </p>
          </div>

          <Card className="p-8">
            <div className="text-center space-y-4">
              <Link
                href="/user/auth/signin"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign in to your account
              </Link>
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
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join DentalEase to manage your dental appointments and health
            records.
          </p>
        </div>

        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Flex direction="column" gap="2">
                  <TextField.Root
                    type="text"
                    placeholder="First name"
                    size="3"
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                  >
                    <TextField.Slot>
                      <User size="16" />
                    </TextField.Slot>
                  </TextField.Root>
                  <ErrorLabel
                    message={
                      typeof errors.firstName?.message === "string"
                        ? errors.firstName.message
                        : undefined
                    }
                  />
                </Flex>
              </div>

              <div>
                <Flex direction="column" gap="2">
                  <TextField.Root
                    type="text"
                    placeholder="Last name"
                    size="3"
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                  >
                    <TextField.Slot>
                      <User size="16" />
                    </TextField.Slot>
                  </TextField.Root>
                  <ErrorLabel
                    message={
                      typeof errors.lastName?.message === "string"
                        ? errors.lastName.message
                        : undefined
                    }
                  />
                </Flex>
              </div>
            </div>

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
                  type="tel"
                  placeholder="Phone number"
                  size="3"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[\+]?[1-9][\d]{0,15}$/,
                      message: "Invalid phone number",
                    },
                  })}
                >
                  <TextField.Slot>
                    <Phone size="16" />
                  </TextField.Slot>
                </TextField.Root>
                <ErrorLabel
                  message={
                    typeof errors.phone?.message === "string"
                      ? errors.phone.message
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
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message:
                        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
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

            <div>
              <Flex direction="column" gap="2">
                <TextField.Root
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  size="3"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
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
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size="16" />
                      ) : (
                        <Eye size="16" />
                      )}
                    </Button>
                  </TextField.Slot>
                </TextField.Root>
                <ErrorLabel
                  message={
                    typeof errors.confirmPassword?.message === "string"
                      ? errors.confirmPassword.message
                      : undefined
                  }
                />
              </Flex>
            </div>

            {error && <ErrorLabel message={error} />}

            <div className="text-sm text-gray-600">
              <p>Password requirements:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>At least 8 characters long</li>
                <li>Contains at least one uppercase letter</li>
                <li>Contains at least one lowercase letter</li>
                <li>Contains at least one number</li>
              </ul>
            </div>

            <div>
              <Button
                type="submit"
                size="3"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </div>

            <div className="text-center">
              <Text size="2" color="gray">
                Already have an account?{" "}
                <Link
                  href="/user/auth/signin"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in
                </Link>
              </Text>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

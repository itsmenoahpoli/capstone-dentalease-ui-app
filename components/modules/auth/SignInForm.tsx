"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Flex, Button } from "@radix-ui/themes";
import { ErrorLabel } from "../../shared/ErrorLabel";
import authService, { SignInCredentials } from "../../../services/auth.service";

type FormData = {
  email: string;
  password: string;
};

export const SignInForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: SignInCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.signInAndRedirect(data);
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
    <form
      className="flex flex-col gap-2 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Flex direction="column">
        <TextField.Root
          type="email"
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
        />
        <ErrorLabel
          message={
            typeof errors.email?.message === "string"
              ? errors.email.message
              : undefined
          }
        />
      </Flex>

      <Flex direction="column">
        <TextField.Root
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
        />
        <ErrorLabel
          message={
            typeof errors.password?.message === "string"
              ? errors.password.message
              : undefined
          }
        />
      </Flex>

      {error && <ErrorLabel message={error} />}

      <div className="flex justify-end">
        <a href="#" className="text-sm text-blue-300 hover:underline">
          Forgot password?
        </a>
      </div>

      <Button type="submit" color="blue" disabled={isLoading}>
        {isLoading ? "SIGNING IN..." : "SIGN IN"}
      </Button>
    </form>
  );
};

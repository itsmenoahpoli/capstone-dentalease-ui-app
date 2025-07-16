"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Flex, Button } from "@radix-ui/themes";
import { ErrorLabel } from "../../shared/ErrorLabel";

type FormData = {
  email: string;
  password: string;
};

export const SignInForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
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

      <div className="flex justify-end">
        <a href="#" className="text-sm text-blue-300 hover:underline">
          Forgot password?
        </a>
      </div>

      <Button type="submit" color="blue">
        SIGN IN
      </Button>
    </form>
  );
};

"use client";

import { useForm } from "react-hook-form";
import { TextField, Flex, Button } from "@radix-ui/themes";

type FormData = {
  email: string;
  password: string;
};

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {};

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
        {errors.email && typeof errors.email.message === "string" && (
          <span className="text-red-500 text-xs">{errors.email.message}</span>
        )}
      </Flex>

      <Flex direction="column">
        <TextField.Root
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && typeof errors.password.message === "string" && (
          <span className="text-red-500 text-xs">
            {errors.password.message}
          </span>
        )}
      </Flex>

      <div className="flex justify-end">
        <a href="#" className="text-sm text-blue-300 hover:underline">
          Forgot password?
        </a>
      </div>

      <Button type="submit" color="blue">
        Sign In
      </Button>
    </form>
  );
}

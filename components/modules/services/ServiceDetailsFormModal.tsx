"use client";

import { useForm } from "react-hook-form";
import {
  Dialog,
  Button,
  Flex,
  Text,
  TextField,
  Select,
} from "@radix-ui/themes";
import { useState } from "react";
import { ErrorLabel } from "@/components/shared/ErrorLabel";

type ServiceFormValues = {
  category: string;
  name: string;
  price: number;
  status: "offered" | "not_offered";
};

type ServiceDetailsFormModalProps = {
  defaultValues?: Partial<ServiceFormValues>;
  triggerLabel?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "add" | "update";
};

export const ServiceDetailsFormModal: React.FC<
  ServiceDetailsFormModalProps
> = ({
  defaultValues,
  triggerLabel = "Add/Edit Service",
  open,
  onOpenChange,
  mode = "add",
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ServiceFormValues>({
    defaultValues: {
      category: defaultValues?.category || "",
      name: defaultValues?.name || "",
      price: defaultValues?.price || 0,
      status: defaultValues?.status || "offered",
    },
  });

  const handleClose = () => {
    onOpenChange(false);
    reset();
  };

  const submitHandler = (data: ServiceFormValues) => {
    handleClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content maxWidth="400px">
        <Dialog.Title>SERVICE DETAILS</Dialog.Title>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Flex direction="column" gap="3">
            <Flex direction="column" gap="2">
              <p className="text-xs">Category</p>
              <Select.Root
                defaultValue={defaultValues?.category || ""}
                {...register("category", { required: "Category is required" })}
              >
                <Select.Trigger id="category" />
                <Select.Content position="popper">
                  <Select.Item value="Preventive Care">
                    Preventive Care
                  </Select.Item>
                  <Select.Item value="Restoration Procedure">
                    Restoration Procedure
                  </Select.Item>
                  <Select.Item value="Cosmetic Dentistry">
                    Cosmetic Dentistry
                  </Select.Item>
                  <Select.Item value="Specialized Treatment">
                    Specialized Treatment
                  </Select.Item>
                </Select.Content>
              </Select.Root>
              <ErrorLabel message={errors.category?.message as string} />
            </Flex>

            <Flex direction="column" gap="2">
              <p className="text-xs">Name</p>
              <TextField.Root
                id="name"
                {...register("name", { required: "Name is required" })}
              />
              <ErrorLabel message={errors.name?.message as string} />
            </Flex>

            <Flex direction="column" gap="2">
              <p className="text-xs">Price (Pesos)</p>
              <TextField.Root
                id="price"
                type="number"
                step="0.01"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price must be non-negative" },
                })}
              />
              <ErrorLabel message={errors.price?.message as string} />
            </Flex>

            <Flex direction="column" gap="2">
              <p className="text-xs">Status</p>
              <Select.Root
                defaultValue={defaultValues?.status || "offered"}
                {...register("status", { required: "Status is required" })}
              >
                <Select.Trigger id="status" />
                <Select.Content>
                  <Select.Item value="offered">Offered</Select.Item>
                  <Select.Item value="not_offered">Not Offered</Select.Item>
                </Select.Content>
              </Select.Root>
              <ErrorLabel message={errors.status?.message as string} />
            </Flex>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button
                type="button"
                variant="soft"
                color="gray"
                onClick={handleClose}
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Button type="submit">
              {mode === "add" ? "ADD SERVICE" : "UPDATE SERVICE"}
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

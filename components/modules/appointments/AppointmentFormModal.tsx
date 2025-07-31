"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Button,
  TextField,
  Select,
  Dialog,
  Flex,
  Text,
} from "@radix-ui/themes";
import {
  appointmentsService,
  Appointment,
  CreateAppointmentData,
} from "@/services/appointments.service";

interface AppointmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: Appointment;
  onSuccess: () => void;
}

export default function AppointmentFormModal({
  isOpen,
  onClose,
  appointment,
  onSuccess,
}: AppointmentFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!appointment;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateAppointmentData>({
    defaultValues: {
      patient_name: "",
      patient_email: "",
      patient_contact: "",
      purpose: "",
      remarks: "",
      schedule_time: "",
      schedule_date: "",
      status: "pending",
    },
  });

  useEffect(() => {
    if (appointment) {
      setValue("patient_name", appointment.patient_name);
      setValue("patient_email", appointment.patient_email);
      setValue("patient_contact", appointment.patient_contact);
      setValue("purpose", appointment.purpose);
      setValue("remarks", appointment.remarks);
      setValue("schedule_time", appointment.schedule_time);
      setValue("schedule_date", appointment.schedule_date);
      setValue("status", appointment.status);
    } else {
      reset({
        patient_name: "",
        patient_email: "",
        patient_contact: "",
        purpose: "",
        remarks: "",
        schedule_time: "",
        schedule_date: "",
        status: "pending",
      });
    }
  }, [appointment, setValue, reset]);

  const onSubmit = async (data: CreateAppointmentData) => {
    setIsLoading(true);
    try {
      if (isEditing && appointment) {
        await appointmentsService.updateAppointment({
          ...data,
          id: appointment.id,
        });
        toast.success("Appointment updated successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        await appointmentsService.createAppointment(data);
        toast.success("Appointment created successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      onSuccess();
      onClose();
      reset();
    } catch (error) {
      console.error("Error saving appointment:", error);
      toast.error("Failed to save appointment. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>
          {isEditing ? "Edit Appointment" : "New Appointment"}
        </Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {isEditing
            ? "Update the appointment information below."
            : "Fill in the appointment information below."}
        </Dialog.Description>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="3">
            <div>
              <Text as="div" size="2" mb="1" weight="bold">
                Patient Name
              </Text>
              <TextField.Root
                {...register("patient_name", {
                  required: "Patient name is required",
                })}
                placeholder="Enter patient name"
              />
              {errors.patient_name && (
                <Text size="1" color="red" mt="1">
                  {errors.patient_name.message}
                </Text>
              )}
            </div>

            <div>
              <Text as="div" size="2" mb="1" weight="bold">
                Email
              </Text>
              <TextField.Root
                type="email"
                {...register("patient_email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="Enter email address"
              />
              {errors.patient_email && (
                <Text size="1" color="red" mt="1">
                  {errors.patient_email.message}
                </Text>
              )}
            </div>

            <div>
              <Text as="div" size="2" mb="1" weight="bold">
                Contact Number
              </Text>
              <TextField.Root
                {...register("patient_contact", {
                  required: "Contact number is required",
                })}
                placeholder="Enter contact number"
              />
              {errors.patient_contact && (
                <Text size="1" color="red" mt="1">
                  {errors.patient_contact.message}
                </Text>
              )}
            </div>

            <div>
              <Text as="div" size="2" mb="1" weight="bold">
                Purpose
              </Text>
              <TextField.Root
                {...register("purpose", { required: "Purpose is required" })}
                placeholder="Enter appointment purpose"
              />
              {errors.purpose && (
                <Text size="1" color="red" mt="1">
                  {errors.purpose.message}
                </Text>
              )}
            </div>

            <div>
              <Text as="div" size="2" mb="1" weight="bold">
                Remarks
              </Text>
              <textarea
                {...register("remarks")}
                placeholder="Enter additional remarks (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            <Flex gap="3">
              <div>
                <Text as="div" size="2" mb="1" weight="bold">
                  Date
                </Text>
                <TextField.Root
                  type="date"
                  {...register("schedule_date", {
                    required: "Date is required",
                  })}
                />
                {errors.schedule_date && (
                  <Text size="1" color="red" mt="1">
                    {errors.schedule_date.message}
                  </Text>
                )}
              </div>

              <div>
                <Text as="div" size="2" mb="1" weight="bold">
                  Time
                </Text>
                <TextField.Root
                  type="time"
                  {...register("schedule_time", {
                    required: "Time is required",
                  })}
                />
                {errors.schedule_time && (
                  <Text size="1" color="red" mt="1">
                    {errors.schedule_time.message}
                  </Text>
                )}
              </div>
            </Flex>

            {isEditing && (
              <div>
                <Text as="div" size="2" mb="1" weight="bold">
                  Status
                </Text>
                <Select.Root
                  defaultValue={watch("status")}
                  onValueChange={(value) =>
                    setValue(
                      "status",
                      value as
                        | "pending"
                        | "confirmed"
                        | "cancelled"
                        | "completed"
                    )
                  }
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="pending">Pending</Select.Item>
                    <Select.Item value="confirmed">Confirmed</Select.Item>
                    <Select.Item value="cancelled">Cancelled</Select.Item>
                    <Select.Item value="completed">Completed</Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
            )}

            <Flex gap="3" mt="4">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}

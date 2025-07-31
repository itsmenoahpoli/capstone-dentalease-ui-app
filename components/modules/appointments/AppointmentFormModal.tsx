"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, TextField, TextArea, Select } from "@radix-ui/themes";
import { X, Calendar, Clock, User, Mail, Phone, FileText } from "lucide-react";
import {
  appointmentsService,
  Appointment,
  CreateAppointmentData,
  UpdateAppointmentData,
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
      reset();
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
      } else {
        await appointmentsService.createAppointment(data);
      }
      onSuccess();
      onClose();
      reset();
    } catch (error) {
      console.error("Error saving appointment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {isEditing ? "Edit Appointment" : "New Appointment"}
          </h2>
          <Button variant="ghost" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Patient Name
            </label>
            <TextField.Root className="w-full">
              <TextField.Slot>
                <User size={16} />
              </TextField.Slot>
              <TextField.Input
                {...register("patient_name", {
                  required: "Patient name is required",
                })}
                placeholder="Enter patient name"
              />
            </TextField.Root>
            {errors.patient_name && (
              <span className="text-red-500 text-sm">
                {errors.patient_name.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <TextField.Root className="w-full">
              <TextField.Slot>
                <Mail size={16} />
              </TextField.Slot>
              <TextField.Input
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
            </TextField.Root>
            {errors.patient_email && (
              <span className="text-red-500 text-sm">
                {errors.patient_email.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Contact Number
            </label>
            <TextField.Root className="w-full">
              <TextField.Slot>
                <Phone size={16} />
              </TextField.Slot>
              <TextField.Input
                {...register("patient_contact", {
                  required: "Contact number is required",
                })}
                placeholder="Enter contact number"
              />
            </TextField.Root>
            {errors.patient_contact && (
              <span className="text-red-500 text-sm">
                {errors.patient_contact.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Purpose</label>
            <TextField.Root className="w-full">
              <TextField.Slot>
                <FileText size={16} />
              </TextField.Slot>
              <TextField.Input
                {...register("purpose", { required: "Purpose is required" })}
                placeholder="Enter appointment purpose"
              />
            </TextField.Root>
            {errors.purpose && (
              <span className="text-red-500 text-sm">
                {errors.purpose.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Remarks</label>
            <TextArea
              {...register("remarks")}
              placeholder="Enter additional remarks (optional)"
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <TextField.Root className="w-full">
                <TextField.Slot>
                  <Calendar size={16} />
                </TextField.Slot>
                <TextField.Input
                  type="date"
                  {...register("schedule_date", {
                    required: "Date is required",
                  })}
                />
              </TextField.Root>
              {errors.schedule_date && (
                <span className="text-red-500 text-sm">
                  {errors.schedule_date.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Time</label>
              <TextField.Root className="w-full">
                <TextField.Slot>
                  <Clock size={16} />
                </TextField.Slot>
                <TextField.Input
                  type="time"
                  {...register("schedule_time", {
                    required: "Time is required",
                  })}
                />
              </TextField.Root>
              {errors.schedule_time && (
                <span className="text-red-500 text-sm">
                  {errors.schedule_time.message}
                </span>
              )}
            </div>
          </div>

          {isEditing && (
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select.Root
                defaultValue={watch("status")}
                onValueChange={(value) => setValue("status", value as any)}
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="pending">Pending</Select.Item>
                  <Select.Item value="confirmed">Confirmed</Select.Item>
                  <Select.Item value="cancelled">Cancelled</Select.Item>
                  <Select.Item value="completed">Completed</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="soft"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

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
  Card,
} from "@radix-ui/themes";
import { Calendar, Clock, User, Mail, Phone, FileText } from "lucide-react";
import {
  appointmentsService,
  CreateAppointmentData,
} from "@/services/appointments.service";
import offeredServicesService from "@/services/offered-services.service";
import authService from "@/services/auth.service";

interface UserAppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface OfferedService {
  id: number;
  category: string;
  name: string;
  price: string;
  status: "offered" | "not_offered";
}

export default function UserAppointmentBookingModal({
  isOpen,
  onClose,
  onSuccess,
}: UserAppointmentBookingModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<OfferedService[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimes] = useState([
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ]);

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
    const loadServices = async () => {
      try {
        const servicesData = await offeredServicesService.getAll();
        setServices(
          servicesData.filter((service) => service.status === "offered")
        );
      } catch (error) {
        console.error("Error loading services:", error);
      }
    };

    if (isOpen) {
      loadServices();
      const user = authService.getStoredUser();
      if (user) {
        setValue("patient_name", user.name || "");
        setValue("patient_email", user.email || "");
      }
    }
  }, [isOpen, setValue]);

  const getMinDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split("T")[0];
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setValue("schedule_date", date);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    setValue("schedule_time", time);
  };

  const onSubmit = async (data: CreateAppointmentData) => {
    setIsLoading(true);
    try {
      await appointmentsService.createAppointment(data);
      toast.success(
        "Appointment booked successfully! We'll contact you soon to confirm.",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      onSuccess();
      onClose();
      reset();
      setSelectedDate("");
      setSelectedTime("");
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to book appointment. Please try again.", {
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
      <Dialog.Content style={{ maxWidth: 600 }}>
        <Dialog.Title>
          <Flex align="center" gap="2">
            <Calendar size={20} />
            Book Dental Appointment
          </Flex>
        </Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Schedule your dental appointment with our experienced team
        </Dialog.Description>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="4">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <Flex direction="column" gap="3">
                <Text size="3" weight="bold" color="blue">
                  Personal Information
                </Text>

                <div>
                  <Text as="div" size="2" mb="1" weight="medium">
                    <Flex align="center" gap="1">
                      <User size={14} />
                      Full Name
                    </Flex>
                  </Text>
                  <TextField.Root
                    {...register("patient_name", {
                      required: "Full name is required",
                    })}
                    placeholder="Enter your full name"
                  />
                  {errors.patient_name && (
                    <Text size="1" color="red" mt="1">
                      {errors.patient_name.message}
                    </Text>
                  )}
                </div>

                <div>
                  <Text as="div" size="2" mb="1" weight="medium">
                    <Flex align="center" gap="1">
                      <Mail size={14} />
                      Email Address
                    </Flex>
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
                    placeholder="Enter your email address"
                  />
                  {errors.patient_email && (
                    <Text size="1" color="red" mt="1">
                      {errors.patient_email.message}
                    </Text>
                  )}
                </div>

                <div>
                  <Text as="div" size="2" mb="1" weight="medium">
                    <Flex align="center" gap="1">
                      <Phone size={14} />
                      Contact Number
                    </Flex>
                  </Text>
                  <TextField.Root
                    {...register("patient_contact", {
                      required: "Contact number is required",
                    })}
                    placeholder="Enter your contact number"
                  />
                  {errors.patient_contact && (
                    <Text size="1" color="red" mt="1">
                      {errors.patient_contact.message}
                    </Text>
                  )}
                </div>
              </Flex>
            </Card>

            <Card className="p-4 bg-green-50 border-green-200">
              <Flex direction="column" gap="3">
                <Text size="3" weight="bold" color="green">
                  Appointment Details
                </Text>

                <div>
                  <Text as="div" size="2" mb="1" weight="medium">
                    <Flex align="center" gap="1">
                      <FileText size={14} />
                      Service/Purpose
                    </Flex>
                  </Text>
                  <Select.Root
                    onValueChange={(value) => setValue("purpose", value)}
                  >
                    <Select.Trigger placeholder="Select a service or enter purpose" />
                    <Select.Content>
                      {services.map((service) => (
                        <Select.Item key={service.id} value={service.name}>
                          {service.name} - ₱{service.price}
                        </Select.Item>
                      ))}
                      <Select.Item value="General Consultation">
                        General Consultation
                      </Select.Item>
                      <Select.Item value="Dental Cleaning">
                        Dental Cleaning
                      </Select.Item>
                      <Select.Item value="Tooth Extraction">
                        Tooth Extraction
                      </Select.Item>
                      <Select.Item value="Root Canal">Root Canal</Select.Item>
                      <Select.Item value="Dental Filling">
                        Dental Filling
                      </Select.Item>
                      <Select.Item value="Dental Crown">
                        Dental Crown
                      </Select.Item>
                      <Select.Item value="Other">Other</Select.Item>
                    </Select.Content>
                  </Select.Root>
                  {!watch("purpose") && (
                    <Text size="1" color="red" mt="1">
                      Please select a service or purpose
                    </Text>
                  )}
                </div>

                <div>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Additional Notes
                  </Text>
                  <textarea
                    {...register("remarks")}
                    placeholder="Any specific concerns or additional information..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
              </Flex>
            </Card>

            <Card className="p-4 bg-purple-50 border-purple-200">
              <Flex direction="column" gap="3">
                <Text size="3" weight="bold" color="purple">
                  Schedule
                </Text>

                <div>
                  <Text as="div" size="2" mb="1" weight="medium">
                    <Flex align="center" gap="1">
                      <Calendar size={14} />
                      Preferred Date
                    </Flex>
                  </Text>
                  <TextField.Root
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    min={getMinDate()}
                    max={getMaxDate()}
                  />
                  {!selectedDate && (
                    <Text size="1" color="red" mt="1">
                      Please select a date
                    </Text>
                  )}
                </div>

                <div>
                  <Text as="div" size="2" mb="1" weight="medium">
                    <Flex align="center" gap="1">
                      <Clock size={14} />
                      Preferred Time
                    </Flex>
                  </Text>
                  <div className="grid grid-cols-4 gap-2">
                    {availableTimes.map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={selectedTime === time ? "solid" : "soft"}
                        color={selectedTime === time ? "purple" : "gray"}
                        onClick={() => handleTimeChange(time)}
                        className="text-sm"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                  {!selectedTime && (
                    <Text size="1" color="red" mt="1">
                      Please select a time
                    </Text>
                  )}
                </div>
              </Flex>
            </Card>

            <Flex gap="3" mt="4">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  !selectedDate ||
                  !selectedTime ||
                  !watch("purpose")
                }
                className="flex-1"
              >
                {isLoading ? "Booking..." : "Book Appointment"}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}

"use client";

import { useState, useEffect } from "react";
import { HeaderNav, FooterNav } from "@/components";
import { Calendar } from "lucide-react";
import Image from "next/image";
import authService from "@/services/auth.service";
import { Dialog, Flex, Button, Card, Text, TextField } from "@radix-ui/themes";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { ErrorLabel } from "@/components/shared/ErrorLabel";
import { useForm } from "react-hook-form";
import httpService from "@/services/http.service";

type FormData = {
  email: string;
  password: string;
};

export default function BookAppointment() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    service: "",
    notes: "",
    patient_contact: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const availableTimes = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ];

  const services = [
    "General Checkup",
    "Teeth Cleaning",
    "Cavity Filling",
    "Root Canal",
    "Tooth Extraction",
    "Dental Implant",
    "Braces Consultation",
    "Teeth Whitening",
    "Emergency Care",
  ];

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
    };

    checkAuth();
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleBookingInputChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time");
      return;
    }

    if (!formData.service) {
      alert("Please select a service");
      return;
    }

    if (!formData.patient_contact) {
      alert("Please provide your contact number");
      return;
    }

    const user = authService.getStoredUser();

    const appointmentData = {
      patient_name: user?.name || "",
      patient_email: user?.email || "",
      patient_contact: formData.patient_contact,
      purpose: formData.service,
      remarks: formData.notes,
      schedule_time: selectedTime,
      schedule_date: selectedDate?.toISOString().split("T")[0],
      status: "pending",
    };

    try {
      console.log("Booking appointment:", appointmentData);

      const response = await httpService.post("/appointments", appointmentData);

      if (response.data) {
        alert("Appointment booked successfully!");
        setFormData({
          service: "",
          notes: "",
          patient_contact: "",
        });
        setSelectedDate(null);
        setSelectedTime("");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to book appointment. Please try again.");
    }
  };

  const handleLoginSubmit = async (data: FormData) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      console.log("Sign in attempt:", data);
      const response = await httpService.post("/auth/signin", {
        email: data.email,
        password: data.password,
      });

      const { token, user } = response.data;

      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setIsAuthenticated(true);
      setShowLoginDialog(false);
      reset();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Sign in failed. Please try again.";
      setLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const days = [];
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    for (let i = 0; i < 35; i++) {
      const date = new Date(currentYear, currentMonth, today.getDate() + i);
      if (date.getDay() !== 0) {
        days.push(date);
      }
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const user = authService.getStoredUser();

  return (
    <>
      <HeaderNav />
      <div className="min-h-screen py-12 pt-[10%] relative bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80"
            alt="Dental Clinic"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Book Your Appointment
            </h1>
            <p className="text-xl text-gray-600">
              Select your preferred date and time to book your appointment
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Calendar className="w-6 h-6 mr-2" />
                  Select Date & Time
                </h2>

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Available Dates
                  </h3>
                  <div className="grid grid-cols-7 gap-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center text-sm font-medium text-gray-500 py-2"
                        >
                          {day}
                        </div>
                      )
                    )}
                    {calendarDays.map((date, index) => (
                      <button
                        key={index}
                        onClick={() => handleDateSelect(date)}
                        className={`p-3 text-sm rounded-lg transition-colors ${
                          selectedDate &&
                          selectedDate.toDateString() === date.toDateString()
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedDate && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Available Times
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-3 text-sm rounded-lg transition-colors ${
                            selectedTime === time
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDate && selectedTime && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-blue-900 mb-2">
                      Selected Appointment
                    </h3>
                    <p className="text-blue-700">
                      {selectedDate.toLocaleDateString()} at {selectedTime}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Appointment Details
                </h2>

                {!isAuthenticated ? (
                  <div className="bg-blue-50 p-6 rounded-lg text-center">
                    <h3 className="text-lg font-medium text-blue-900 mb-4">
                      Patient Login Required
                    </h3>
                    <p className="text-blue-700 mb-6">
                      Please login with your patient account to book an
                      appointment. Your information will be automatically filled
                      from your profile.
                    </p>
                    <Button
                      onClick={() => setShowLoginDialog(true)}
                      className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 inline-flex items-center"
                    >
                      Login to Book
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="bg-green-50 p-4 rounded-lg mb-6">
                      <h3 className="text-lg font-medium text-green-900 mb-2">
                        Welcome, {user?.name}!
                      </h3>
                      <p className="text-green-700">
                        Your information will be automatically filled from your
                        profile.
                      </p>
                    </div>

                    <form onSubmit={handleSubmitBooking} className="space-y-4">
                      <div>
                        <label
                          htmlFor="patient_contact"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Contact Number *
                        </label>
                        <input
                          type="tel"
                          id="patient_contact"
                          name="patient_contact"
                          value={formData.patient_contact}
                          onChange={handleBookingInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="+1234567890"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="service"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Service Required *
                        </label>
                        <select
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleBookingInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select a service</option>
                          {services.map((service) => (
                            <option key={service} value={service}>
                              {service}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="notes"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Additional Notes
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleBookingInputChange}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Any specific concerns or requests..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                      >
                        Book Appointment
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterNav />

      <Dialog.Root open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <Dialog.Content className="max-w-md w-full mx-auto">
          <Dialog.Title className="text-center mb-6">
            <div className="flex flex-col items-center mb-6">
              <Image
                src="/assets/brand-logo.png"
                alt="DentalEase Logo"
                width={60}
                height={60}
                className="mb-4"
              />
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                DentalEase
              </h1>
              <p className="text-xs text-gray-600">Your Dental Care Partner</p>
            </div>
          </Dialog.Title>

          <Card className="p-6">
            <p className="mt-2 mb-6 text-sm text-center text-gray-600">
              Sign in to your DentalEase patient account
            </p>

            <form
              className="space-y-4"
              onSubmit={handleSubmit(handleLoginSubmit)}
            >
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
                        {showPassword ? (
                          <EyeOff size="16" />
                        ) : (
                          <Eye size="16" />
                        )}
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

              {loginError && <ErrorLabel message={loginError} />}

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
                  <a
                    href="/user/auth/request-otp"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </a>
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
                  <a
                    href="/user/auth/signup"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign up
                  </a>
                </Text>
              </div>
            </form>
          </Card>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}

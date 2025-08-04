"use client";

import { useState, useEffect } from "react";
import { Flex, Card, Button, Text, Badge } from "@radix-ui/themes";
import {
  Calendar,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Edit,
  Eye,
  Plus,
} from "lucide-react";
import { PageHeader } from "@/components";
import { HeaderNav, FooterNav } from "@/components";
import ChatbotWrapper from "@/components/shared/ChatbotWrapper";
import { UserAppointmentBookingModal } from "@/components/modules/appointments";
import authService from "@/services/auth.service";
import {
  appointmentsService,
  Appointment,
} from "@/services/appointments.service";

interface Payment {
  id: number;
  amount: number;
  date: string;
  service: string;
  status: "paid" | "pending" | "overdue";
}

interface PatientProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact: string;
}

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [profile, setProfile] = useState<PatientProfile>({
    name: "",
    email: "",
    phone: "",
    address: "",
    emergencyContact: "",
  });

  useEffect(() => {
    const user = authService.getStoredUser();
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: "",
        address: "",
        emergencyContact: "",
      });
    }
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const appointmentsData = await appointmentsService.getAllAppointments();
      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Error loading appointments:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
      case "paid":
        return "green";
      case "completed":
        return "blue";
      case "pending":
        return "yellow";
      case "cancelled":
      case "overdue":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Clock size={16} />;
      case "completed":
      case "paid":
        return <CheckCircle size={16} />;
      case "cancelled":
      case "overdue":
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === "pending" || apt.status === "confirmed"
  );
  const totalPayments = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const pendingPayments = payments.filter(
    (payment) => payment.status === "pending" || payment.status === "overdue"
  );

  return (
    <>
      <HeaderNav />
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader
            title="Patient Dashboard"
            description="Manage your dental appointments, payments, and profile information"
          />

          <Flex direction="column" gap="6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white">
                <Flex align="center" gap="4" className="p-4">
                  <Flex
                    align="center"
                    justify="center"
                    className="w-12 h-12 rounded-full bg-blue-50"
                  >
                    <Calendar size={28} className="text-blue-500" />
                  </Flex>
                  <Flex direction="column">
                    <span className="text-xs text-gray-500 font-medium">
                      Upcoming Appointments
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {upcomingAppointments.length}
                    </span>
                  </Flex>
                </Flex>
              </Card>

              <Card className="bg-white">
                <Flex align="center" gap="4" className="p-4">
                  <Flex
                    align="center"
                    justify="center"
                    className="w-12 h-12 rounded-full bg-green-50"
                  >
                    <DollarSign size={28} className="text-green-500" />
                  </Flex>
                  <Flex direction="column">
                    <span className="text-xs text-gray-500 font-medium">
                      Total Payments
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      ₱{totalPayments.toLocaleString()}
                    </span>
                  </Flex>
                </Flex>
              </Card>

              <Card className="bg-white">
                <Flex align="center" gap="4" className="p-4">
                  <Flex
                    align="center"
                    justify="center"
                    className="w-12 h-12 rounded-full bg-yellow-50"
                  >
                    <CreditCard size={28} className="text-yellow-500" />
                  </Flex>
                  <Flex direction="column">
                    <span className="text-xs text-gray-500 font-medium">
                      Pending Payments
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {pendingPayments.length}
                    </span>
                  </Flex>
                </Flex>
              </Card>
            </div>

            <Flex gap="6" direction={{ initial: "column", md: "row" }}>
              <Card className="flex-1">
                <Flex justify="between" align="center" className="p-4 border-b">
                  <Text size="5" weight="bold">
                    Recent Appointments
                  </Text>
                  <Button
                    size="2"
                    variant="soft"
                    onClick={() => setIsBookingModalOpen(true)}
                  >
                    <Plus size={16} />
                    Book New
                  </Button>
                </Flex>
                <div className="p-4 space-y-3">
                  {appointments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar
                        size={48}
                        className="mx-auto mb-4 text-gray-300"
                      />
                      <Text size="3" color="gray">
                        No appointments found
                      </Text>
                      <Text size="2" color="gray">
                        Your appointments will appear here
                      </Text>
                    </div>
                  ) : (
                    appointments.slice(0, 3).map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <Flex direction="column" gap="1">
                          <Text weight="medium">{appointment.purpose}</Text>
                          <Text size="2" color="gray">
                            {appointment.schedule_date} at{" "}
                            {appointment.schedule_time}
                          </Text>
                          <Text size="2" color="gray">
                            {appointment.patient_name}
                          </Text>
                        </Flex>
                        <Flex align="center" gap="2">
                          <Badge color={getStatusColor(appointment.status)}>
                            {getStatusIcon(appointment.status)}
                            {appointment.status}
                          </Badge>
                          <Button size="1" variant="ghost">
                            <Eye size={14} />
                          </Button>
                        </Flex>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              <Card className="flex-1">
                <Flex justify="between" align="center" className="p-4 border-b">
                  <Text size="5" weight="bold">
                    Payment History
                  </Text>
                </Flex>
                <div className="p-4 space-y-3">
                  {payments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CreditCard
                        size={48}
                        className="mx-auto mb-4 text-gray-300"
                      />
                      <Text size="3" color="gray">
                        No payment history
                      </Text>
                      <Text size="2" color="gray">
                        Your payment history will appear here
                      </Text>
                    </div>
                  ) : (
                    payments.slice(0, 3).map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <Flex direction="column" gap="1">
                          <Text weight="medium">{payment.service}</Text>
                          <Text size="2" color="gray">
                            {payment.date}
                          </Text>
                        </Flex>
                        <Flex align="center" gap="2">
                          <Text weight="bold">
                            ₱{payment.amount.toLocaleString()}
                          </Text>
                          <Badge color={getStatusColor(payment.status)}>
                            {getStatusIcon(payment.status)}
                            {payment.status}
                          </Badge>
                        </Flex>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </Flex>

            <Card>
              <Flex justify="between" align="center" className="p-6 border-b">
                <Text size="5" weight="bold">
                  Profile Information
                </Text>
                <Button size="2" variant="soft">
                  <Edit size={16} />
                  Edit Profile
                </Button>
              </Flex>
              <div className="p-6">
                <Flex
                  gap="8"
                  direction={{ initial: "column", md: "row" }}
                  align="start"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
                      <Text size="6" weight="bold" className="text-white">
                        {profile.name
                          ? profile.name.charAt(0).toUpperCase()
                          : "U"}
                      </Text>
                    </div>
                    <Text size="3" weight="medium" className="text-center">
                      {profile.name || "User"}
                    </Text>
                  </div>

                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Text size="2" color="gray" weight="medium">
                          Full Name
                        </Text>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <Text weight="medium">
                            {profile.name || "Not provided"}
                          </Text>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Text size="2" color="gray" weight="medium">
                          Email Address
                        </Text>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <Text weight="medium">
                            {profile.email || "Not provided"}
                          </Text>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Text size="2" color="gray" weight="medium">
                          Phone Number
                        </Text>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <Text weight="medium">
                            {profile.phone || "Not provided"}
                          </Text>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Text size="2" color="gray" weight="medium">
                          Address
                        </Text>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <Text weight="medium">
                            {profile.address || "Not provided"}
                          </Text>
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Text size="2" color="gray" weight="medium">
                          Emergency Contact
                        </Text>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <Text weight="medium">
                            {profile.emergencyContact || "Not provided"}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </Flex>
              </div>
            </Card>
          </Flex>
        </div>
      </div>
      <FooterNav />
      <ChatbotWrapper />

      <UserAppointmentBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={loadAppointments}
      />
    </>
  );
}

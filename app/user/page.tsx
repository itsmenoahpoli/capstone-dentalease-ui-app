"use client";

import { useState } from "react";
import { Flex, Card, Button, Text, Badge, Avatar } from "@radix-ui/themes";
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

interface Appointment {
  id: number;
  date: string;
  time: string;
  service: string;
  status: "upcoming" | "completed" | "cancelled";
  doctor: string;
}

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
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      date: "2024-01-15",
      time: "10:00 AM",
      service: "Dental Cleaning",
      status: "upcoming",
      doctor: "Dr. Sarah Johnson",
    },
    {
      id: 2,
      date: "2024-01-10",
      time: "2:30 PM",
      service: "Root Canal",
      status: "completed",
      doctor: "Dr. Michael Chen",
    },
    {
      id: 3,
      date: "2024-01-20",
      time: "9:00 AM",
      service: "Cavity Filling",
      status: "upcoming",
      doctor: "Dr. Sarah Johnson",
    },
  ]);

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 1,
      amount: 150,
      date: "2024-01-10",
      service: "Dental Cleaning",
      status: "paid",
    },
    {
      id: 2,
      amount: 500,
      date: "2024-01-15",
      service: "Root Canal",
      status: "pending",
    },
    {
      id: 3,
      amount: 200,
      date: "2024-01-25",
      service: "Cavity Filling",
      status: "overdue",
    },
  ]);

  const [profile, setProfile] = useState<PatientProfile>({
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, City, State 12345",
    emergencyContact: "Jane Doe - +1 (555) 987-6543",
  });

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
    (apt) => apt.status === "upcoming"
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
                      ${totalPayments}
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
                  <Button size="2" variant="soft">
                    <Plus size={16} />
                    Book New
                  </Button>
                </Flex>
                <div className="p-4 space-y-3">
                  {appointments.slice(0, 3).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <Flex direction="column" gap="1">
                        <Text weight="medium">{appointment.service}</Text>
                        <Text size="2" color="gray">
                          {appointment.date} at {appointment.time}
                        </Text>
                        <Text size="2" color="gray">
                          {appointment.doctor}
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
                  ))}
                </div>
              </Card>

              <Card className="flex-1">
                <Flex justify="between" align="center" className="p-4 border-b">
                  <Text size="5" weight="bold">
                    Payment History
                  </Text>
                  <Button size="2" variant="soft">
                    <CreditCard size={16} />
                    Pay Now
                  </Button>
                </Flex>
                <div className="p-4 space-y-3">
                  {payments.slice(0, 3).map((payment) => (
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
                        <Text weight="bold">${payment.amount}</Text>
                        <Badge color={getStatusColor(payment.status)}>
                          {getStatusIcon(payment.status)}
                          {payment.status}
                        </Badge>
                      </Flex>
                    </div>
                  ))}
                </div>
              </Card>
            </Flex>

            <Card>
              <Flex justify="between" align="center" className="p-4 border-b">
                <Text size="5" weight="bold">
                  Profile Information
                </Text>
                <Button size="2" variant="soft">
                  <Edit size={16} />
                  Edit Profile
                </Button>
              </Flex>
              <div className="p-4">
                <Flex gap="6" direction={{ initial: "column", md: "row" }}>
                  <Avatar
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    fallback="JD"
                    size="6"
                    radius="full"
                  />
                  <Flex direction="column" gap="3" className="flex-1">
                    <div>
                      <Text size="2" color="gray">
                        Full Name
                      </Text>
                      <Text weight="medium">{profile.name}</Text>
                    </div>
                    <div>
                      <Text size="2" color="gray">
                        Email
                      </Text>
                      <Text weight="medium">{profile.email}</Text>
                    </div>
                    <div>
                      <Text size="2" color="gray">
                        Phone
                      </Text>
                      <Text weight="medium">{profile.phone}</Text>
                    </div>
                    <div>
                      <Text size="2" color="gray">
                        Address
                      </Text>
                      <Text weight="medium">{profile.address}</Text>
                    </div>
                    <div>
                      <Text size="2" color="gray">
                        Emergency Contact
                      </Text>
                      <Text weight="medium">{profile.emergencyContact}</Text>
                    </div>
                  </Flex>
                </Flex>
              </div>
            </Card>
          </Flex>
        </div>
      </div>
      <FooterNav />
      <ChatbotWrapper />
    </>
  );
}

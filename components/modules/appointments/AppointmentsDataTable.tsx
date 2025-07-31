"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Select,
  Table,
  Card,
  Text,
  Flex,
  Checkbox,
  IconButton,
  DropdownMenu,
  Badge,
} from "@radix-ui/themes";
import { Edit, Trash2, Eye, Plus, MoreVertical, Loader } from "lucide-react";
import {
  appointmentsService,
  Appointment,
} from "@/services/appointments.service";
import AppointmentFormModal from "./AppointmentFormModal";
import AppointmentDetailsModal from "./AppointmentDetailsModal";
import { AppBadge } from "../../app/AppBadge";

interface AppointmentsDataTableProps {
  onRefresh: () => void;
}

export default function AppointmentsDataTable({
  onRefresh,
}: AppointmentsDataTableProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAppointments, setSelectedAppointments] = useState<Set<number>>(
    new Set()
  );

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentsService.getAllAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      try {
        await appointmentsService.deleteAppointment(id);
        fetchAppointments();
        onRefresh();
      } catch (error) {
        console.error("Error deleting appointment:", error);
      }
    }
  };

  const filteredAppointments = appointments.filter(
    (appointment) =>
      statusFilter === "all" || appointment.status === statusFilter
  );

  const filteredAppointmentIds = new Set(
    filteredAppointments.map((appointment) => appointment.id)
  );
  const selectedFilteredAppointments = new Set(
    Array.from(selectedAppointments).filter((id) =>
      filteredAppointmentIds.has(id)
    )
  );
  const isAllSelected =
    filteredAppointments.length > 0 &&
    selectedFilteredAppointments.size === filteredAppointments.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAppointments(
        new Set([...selectedAppointments, ...filteredAppointmentIds])
      );
    } else {
      const newSelected = new Set(selectedAppointments);
      filteredAppointmentIds.forEach((id) => newSelected.delete(id));
      setSelectedAppointments(newSelected);
    }
  };

  const handleSelectAppointment = (appointmentId: number, checked: boolean) => {
    setSelectedAppointments((prev) => {
      const newSelected = new Set(prev);
      if (checked) {
        newSelected.add(appointmentId);
      } else {
        newSelected.delete(appointmentId);
      }
      return newSelected;
    });
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Card>
        <Flex
          direction="column"
          align="center"
          justify="center"
          className="py-12 px-6"
          gap="3"
        >
          <Loader className="animate-spin" size={32} />
          <Text size="3" weight="medium" color="gray">
            Loading appointments...
          </Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <div className="flex items-center gap-4">
            <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
              <Select.Trigger placeholder="Filter by status" />
              <Select.Content>
                <Select.Item value="all">All Status</Select.Item>
                <Select.Item value="pending">Pending</Select.Item>
                <Select.Item value="confirmed">Confirmed</Select.Item>
                <Select.Item value="cancelled">Cancelled</Select.Item>
                <Select.Item value="completed">Completed</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={16} />
            New Appointment
          </Button>
        </Flex>

        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Patient</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Schedule</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Purpose</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Contact</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredAppointments.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={8}>
                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    className="py-12 px-6"
                    gap="3"
                  >
                    <Text size="5" weight="medium" color="gray">
                      No appointments found
                    </Text>
                    <Text size="2" color="gray">
                      Add your first appointment to get started
                    </Text>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredAppointments.map((appointment) => (
                <Table.Row key={appointment.id}>
                  <Table.Cell>
                    <Checkbox
                      checked={selectedAppointments.has(appointment.id)}
                      onCheckedChange={(checked) =>
                        handleSelectAppointment(
                          appointment.id,
                          checked as boolean
                        )
                      }
                    />
                  </Table.Cell>
                  <Table.Cell>AP{appointment.id}</Table.Cell>
                  <Table.Cell>
                    <div>
                      <Text size="2" weight="medium">
                        {appointment.patient_name}
                      </Text>
                      <Text size="1" color="gray">
                        {appointment.patient_email}
                      </Text>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2">
                      {formatDateTime(
                        appointment.schedule_date,
                        appointment.schedule_time
                      )}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" className="max-w-xs truncate">
                      {appointment.purpose}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    {appointment.status === "pending" ||
                    appointment.status === "completed" ? (
                      <AppBadge status={appointment.status}>
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </AppBadge>
                    ) : (
                      <Badge
                        color={
                          appointment.status === "confirmed" ? "blue" : "red"
                        }
                        variant="soft"
                      >
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2">{appointment.patient_contact}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <IconButton variant="ghost" size="1">
                          <MoreVertical size={16} />
                        </IconButton>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item
                          onClick={() => handleViewDetails(appointment)}
                        >
                          <Eye size={15} style={{ marginRight: 8 }} /> View
                          Details
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          onClick={() => handleEdit(appointment)}
                        >
                          <Edit size={15} style={{ marginRight: 8 }} /> Edit
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          color="red"
                          onClick={() => handleDelete(appointment.id)}
                        >
                          <Trash2 size={15} style={{ marginRight: 8 }} /> Delete
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Flex>

      <AppointmentFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment || undefined}
        onSuccess={() => {
          fetchAppointments();
          onRefresh();
        }}
      />

      <AppointmentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment}
      />
    </Card>
  );
}

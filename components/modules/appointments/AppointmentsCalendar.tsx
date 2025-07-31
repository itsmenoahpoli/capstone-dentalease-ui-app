"use client";

import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Button, Select } from "@radix-ui/themes";
import { Plus } from "lucide-react";
import {
  appointmentsService,
  Appointment,
} from "@/services/appointments.service";
import AppointmentFormModal from "./AppointmentFormModal";

interface AppointmentsCalendarProps {
  onRefresh: () => void;
}

const statusColors = {
  pending: "#fbbf24",
  confirmed: "#3b82f6",
  cancelled: "#ef4444",
  completed: "#10b981",
};

export default function AppointmentsCalendar({
  onRefresh,
}: AppointmentsCalendarProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewType, setViewType] = useState<
    "dayGridMonth" | "timeGridWeek" | "timeGridDay" | "listWeek"
  >("dayGridMonth");
  const calendarRef = useRef<FullCalendar>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentsService.getAllAppointments();
      setAppointments(data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (!loading && appointments.length === 0) {
      const testAppointment: Appointment = {
        id: 1,
        patient_name: "John Doe",
        patient_email: "john@example.com",
        patient_contact: "123-456-7890",
        purpose: "Dental Checkup",
        remarks: "Test appointment",
        schedule_date: new Date().toISOString().split("T")[0],
        schedule_time: "10:00",
        status: "confirmed",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setAppointments([testAppointment]);
    }
  }, [loading, appointments.length]);

  const formatEvents = (appointments: Appointment[]) => {
    if (!appointments || appointments.length === 0) {
      return [];
    }

    const formattedEvents = appointments
      .map((appointment) => {
        try {
          if (!appointment.schedule_date || !appointment.schedule_time) {
            return null;
          }

          const { date: normalizedDate, time: normalizedTime } =
            normalizeDateTime(
              appointment.schedule_date,
              appointment.schedule_time
            );

          const startDateTime = `${normalizedDate}T${normalizedTime}`;
          const startDate = new Date(startDateTime);

          if (isNaN(startDate.getTime())) {
            return null;
          }

          const endDateTime = new Date(startDate.getTime() + 60 * 60 * 1000);

          const event = {
            id: appointment.id.toString(),
            title: `${appointment.patient_name} - ${appointment.purpose}`,
            start: startDateTime,
            end: endDateTime.toISOString(),
            backgroundColor:
              statusColors[appointment.status] || statusColors.pending,
            borderColor:
              statusColors[appointment.status] || statusColors.pending,
            textColor: "#ffffff",
            extendedProps: {
              patient_name: appointment.patient_name,
              patient_email: appointment.patient_email,
              patient_contact: appointment.patient_contact,
              purpose: appointment.purpose,
              remarks: appointment.remarks,
              status: appointment.status,
            },
          };
          return event;
        } catch {
          return null;
        }
      })
      .filter((event): event is NonNullable<typeof event> => event !== null);

    return formattedEvents;
  };

  const normalizeDateTime = (date: string, time: string) => {
    let normalizedDate = date;
    let normalizedTime = time;

    if (date.includes("/")) {
      const parts = date.split("/");
      if (parts.length === 3) {
        normalizedDate = `${parts[2]}-${parts[0].padStart(
          2,
          "0"
        )}-${parts[1].padStart(2, "0")}`;
      }
    }

    if (time && !time.includes(":")) {
      normalizedTime = `${time.slice(0, 2)}:${time.slice(2, 4)}:00`;
    } else if (time && time.split(":").length === 2) {
      normalizedTime = `${time}:00`;
    }

    if (normalizedDate && !normalizedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      normalizedDate = new Date().toISOString().split("T")[0];
    }

    if (normalizedTime && !normalizedTime.match(/^\d{2}:\d{2}:\d{2}$/)) {
      normalizedTime = "09:00:00";
    }

    return { date: normalizedDate, time: normalizedTime };
  };

  const handleEventClick = (info: any) => {
    const appointment = appointments.find(
      (apt) => apt.id.toString() === info.event.id
    );
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsModalOpen(true);
    }
  };

  const handleDateSelect = (selectInfo: any) => {
    const startDate = selectInfo.startStr.split("T")[0];
    const startTime =
      selectInfo.startStr.split("T")[1]?.substring(0, 5) || "09:00";

    setSelectedAppointment({
      id: 0,
      patient_name: "",
      patient_email: "",
      patient_contact: "",
      purpose: "",
      remarks: "",
      schedule_date: startDate,
      schedule_time: startTime,
      status: "pending",
      created_at: "",
      updated_at: "",
    });
    setIsModalOpen(true);
  };

  const handleViewChange = (viewType: string) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(viewType);
      setViewType(viewType as any);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Select.Root value={viewType} onValueChange={handleViewChange}>
            <Select.Trigger placeholder="Select view" />
            <Select.Content>
              <Select.Item value="dayGridMonth">Month</Select.Item>
              <Select.Item value="timeGridWeek">Week</Select.Item>
              <Select.Item value="timeGridDay">Day</Select.Item>
              <Select.Item value="listWeek">List</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              fetchAppointments();
            }}
            variant="soft"
          >
            Refresh Data
          </Button>
          <Button
            onClick={() => {
              setSelectedAppointment(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={16} />
            New Appointment
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="mb-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: statusColors.pending }}
              ></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: statusColors.confirmed }}
              ></div>
              <span>Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: statusColors.cancelled }}
              ></div>
              <span>Cancelled</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: statusColors.completed }}
              ></div>
              <span>Completed</span>
            </div>
          </div>
        </div>

        <div className="h-[600px]">
          <FullCalendar
            ref={calendarRef}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            initialView={viewType}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={formatEvents(appointments)}
            select={handleDateSelect}
            eventClick={handleEventClick}
            height="100%"
            slotMinTime="08:00:00"
            slotMaxTime="18:00:00"
            allDaySlot={false}
            slotDuration="00:30:00"
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              meridiem: "short",
            }}
          />
        </div>
      </div>

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
    </div>
  );
}

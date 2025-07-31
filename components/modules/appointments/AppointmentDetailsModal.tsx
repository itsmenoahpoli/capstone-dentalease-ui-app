"use client";

import { Button } from "@radix-ui/themes";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Appointment } from "@/services/appointments.service";

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-green-100 text-green-800",
};

export default function AppointmentDetailsModal({
  isOpen,
  onClose,
  appointment,
}: AppointmentDetailsModalProps) {
  if (!isOpen || !appointment) return null;

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Appointment Details</h2>
          <Button variant="ghost" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <User size={16} className="text-gray-600" />
            <div>
              <div className="font-medium">{appointment.patient_name}</div>
              <div className="text-sm text-gray-500">Patient Name</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail size={16} className="text-gray-600" />
            <div>
              <div className="font-medium">{appointment.patient_email}</div>
              <div className="text-sm text-gray-500">Email Address</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone size={16} className="text-gray-600" />
            <div>
              <div className="font-medium">{appointment.patient_contact}</div>
              <div className="text-sm text-gray-500">Contact Number</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar size={16} className="text-gray-600" />
            <div>
              <div className="font-medium">
                {formatDateTime(
                  appointment.schedule_date,
                  appointment.schedule_time
                )}
              </div>
              <div className="text-sm text-gray-500">Schedule</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <FileText size={16} className="text-gray-600" />
            <div>
              <div className="font-medium">{appointment.purpose}</div>
              <div className="text-sm text-gray-500">Purpose</div>
            </div>
          </div>

          {appointment.remarks && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <MessageSquare size={16} className="text-gray-600 mt-1" />
              <div>
                <div className="font-medium">{appointment.remarks}</div>
                <div className="text-sm text-gray-500">Remarks</div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                statusColors[appointment.status]
              }`}
            >
              {appointment.status.charAt(0).toUpperCase() +
                appointment.status.slice(1)}
            </div>
            <div className="text-sm text-gray-500">Status</div>
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <Button variant="soft" onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

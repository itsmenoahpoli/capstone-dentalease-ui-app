"use client";

import { Flex, Button } from "@radix-ui/themes";
import { PageHeader } from "@/components";
import { AppointmentsManager } from "@/components/modules/appointments";
import { exportToPDF } from "@/utils/pdf.utils";
import { appointmentsService } from "@/services/appointments.service";
import { toast } from "react-toastify";
import { useState } from "react";

export default function Page() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const appointments = await appointmentsService.getAllAppointments();

      if (!Array.isArray(appointments) || appointments.length === 0) {
        toast.warning("No appointments available to export", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }

      const headers = [
        "ID",
        "Patient Name",
        "Patient Email",
        "Patient Contact",
        "Purpose",
        "Schedule Date",
        "Schedule Time",
        "Status",
        "Created At",
      ];
      const data = appointments.map((appointment) => [
        appointment.id.toString(),
        appointment.patient_name,
        appointment.patient_email,
        appointment.patient_contact,
        appointment.purpose,
        appointment.schedule_date
          ? new Date(appointment.schedule_date).toLocaleDateString()
          : "",
        appointment.schedule_time,
        appointment.status,
        new Date(appointment.created_at).toLocaleDateString(),
      ]);

      exportToPDF({
        headers,
        data,
        title: "Appointments Report",
      });

      toast.success("Appointments exported successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error exporting appointments:", error);
      toast.error("Failed to export appointments", {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-full w-full space-y-6">
      <PageHeader
        title="Appointments"
        description="Manage scheduled calendar appointments of patients"
      >
        <Flex gap="2">
          <Button
            size="1"
            variant="soft"
            onClick={handleExportData}
            disabled={isExporting}
          >
            {isExporting ? "EXPORTING..." : "EXPORT DATA"}
          </Button>
        </Flex>
      </PageHeader>
      <AppointmentsManager />
    </div>
  );
}

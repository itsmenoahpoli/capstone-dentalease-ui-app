"use client";

import { Flex, Button } from "@radix-ui/themes";
import { PageHeader, PatientRecordsList } from "@/components";
import { exportToPDF } from "@/utils/pdf.utils";
import { patientsService } from "@/services/patients.service";
import { toast } from "react-toastify";
import { useState } from "react";

export default function Page() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const patients = await patientsService.getAllPatients();

      if (!Array.isArray(patients) || patients.length === 0) {
        toast.warning("No patient records available to export", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }

      const headers = [
        "ID",
        "Name",
        "Email",
        "Contact",
        "Address",
        "Gender",
        "Birthdate",
        "Citizenship",
        "Status",
        "Created At",
      ];
      const data = patients.map((patient) => [
        patient.id.toString(),
        patient.name,
        patient.email,
        patient.contact,
        patient.address,
        patient.gender,
        patient.birthdate
          ? new Date(patient.birthdate).toLocaleDateString()
          : "",
        patient.citizenship,
        patient.status,
        new Date(patient.created_at).toLocaleDateString(),
      ]);

      exportToPDF({
        headers,
        data,
        title: "Patient Records Report",
      });

      toast.success("Patient records exported successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error exporting patient records:", error);
      toast.error("Failed to export patient records", {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Flex direction="column" gap="4" className="h-full w-full">
      <PageHeader
        title="Patient Records"
        description="Manage patient records and information"
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
      <PatientRecordsList />
    </Flex>
  );
}

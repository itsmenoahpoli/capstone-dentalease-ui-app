"use client";

import { Flex, Button } from "@radix-ui/themes";
import { PageHeader, ServicesManageList } from "@/components";
import { exportToPDF } from "@/utils/pdf.utils";
import offeredServicesService from "@/services/offered-services.service";
import { toast } from "react-toastify";
import { useState } from "react";

export default function Page() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const services = await offeredServicesService.getAll();

      if (!Array.isArray(services) || services.length === 0) {
        toast.warning("No services data available to export", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }

      const headers = [
        "ID",
        "Name",
        "Category",
        "Price",
        "Status",
        "Created At",
      ];
      const data = services.map((service) => [
        service.id.toString(),
        service.name,
        service.category,
        `$${service.price}`,
        service.status,
        new Date(service.created_at).toLocaleDateString(),
      ]);

      exportToPDF({
        headers,
        data,
        title: "Services Report",
      });

      toast.success("Services data exported successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error exporting services:", error);
      toast.error("Failed to export services data", {
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
        title="Services"
        description="Manage facility offered services"
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
      <ServicesManageList />
    </Flex>
  );
}

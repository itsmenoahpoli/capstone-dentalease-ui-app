"use client";

import { useState, useEffect } from "react";
import { ServicesManageList } from "./ServicesManageList";
import { OfferedService } from "@/services/offered-services.service";
import offeredServicesService from "@/services/offered-services.service";

export const ServicesExample: React.FC = () => {
  const [services, setServices] = useState<OfferedService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const fetchedServices = await offeredServicesService.getAll();
        setServices(fetchedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <div>Loading services...</div>;
  }

  return (
    <div>
      <h1>Services Management</h1>
      <ServicesManageList services={services} />
    </div>
  );
};

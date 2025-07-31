"use client";

import { useState } from "react";
import { Button } from "@radix-ui/themes";
import { Calendar, List } from "lucide-react";
import AppointmentsCalendar from "./AppointmentsCalendar";
import AppointmentsDataTable from "./AppointmentsDataTable";

export default function AppointmentsManager() {
  const [viewMode, setViewMode] = useState<"calendar" | "table">("calendar");

  const handleRefresh = () => {
    // This will trigger a refresh of the parent component if needed
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "calendar" ? "solid" : "soft"}
            onClick={() => setViewMode("calendar")}
            className="flex items-center gap-2"
          >
            <Calendar size={16} />
            Calendar View
          </Button>
          <Button
            variant={viewMode === "table" ? "solid" : "soft"}
            onClick={() => setViewMode("table")}
            className="flex items-center gap-2"
          >
            <List size={16} />
            Table View
          </Button>
        </div>
      </div>

      {viewMode === "calendar" ? (
        <AppointmentsCalendar onRefresh={handleRefresh} />
      ) : (
        <AppointmentsDataTable onRefresh={handleRefresh} />
      )}
    </div>
  );
}

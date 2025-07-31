import { PageHeader } from "@/components";
import { AppointmentsManager } from "@/components/modules/appointments";

export const metadata = {
  title: "Appointments | DentalEase",
  description: "Manage scheduled calendar appointments of patients",
};

export default function Page() {
  return (
    <div className="h-full w-full space-y-6">
      <PageHeader
        title="Appointments"
        description="Manage scheduled calendar appointments of patients"
      />
      <AppointmentsManager />
    </div>
  );
}

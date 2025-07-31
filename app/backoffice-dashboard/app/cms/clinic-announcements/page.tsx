import { Flex } from "@radix-ui/themes";
import { PageHeader, ClinicAnnouncementsGrid } from "@/components";

export const metadata = {
  title: "Clinic Announcements | DentalEase",
  description: "Manage clinic announcements",
};

export default function Page() {
  return (
    <Flex direction="column" gap="4" className="h-full w-full">
      <PageHeader
        title="Clinic Announcements"
        description="Manage clinic announcements"
      />
      <ClinicAnnouncementsGrid
        category="clinic_announcements"
        categoryDisplay="Clinic Announcements"
      />
    </Flex>
  );
}

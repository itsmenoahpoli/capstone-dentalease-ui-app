import { Flex, Button } from "@radix-ui/themes";
import { PageHeader, ClinicAnnouncementsList } from "@/components";

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
      >
        <Flex gap="2">
          <Button size="1" variant="soft">
            EXPORT DATA
          </Button>
          <Button size="1" variant="soft">
            IMPORT DATA
          </Button>
        </Flex>
      </PageHeader>
      <ClinicAnnouncementsList />
    </Flex>
  );
}

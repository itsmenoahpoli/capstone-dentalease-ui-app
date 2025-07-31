import { Flex, Button } from "@radix-ui/themes";
import { PageHeader, PatientRecordsList } from "@/components";

export const metadata = {
  title: "Patient Records | DentalEase",
  description: "Manage patient records and information",
};

export default function Page() {
  return (
    <Flex direction="column" gap="4" className="h-full w-full">
      <PageHeader
        title="Patient Records"
        description="Manage patient records and information"
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
      <PatientRecordsList />
    </Flex>
  );
}

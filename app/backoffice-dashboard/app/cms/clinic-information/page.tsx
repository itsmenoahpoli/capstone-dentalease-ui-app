import { Flex, Button } from "@radix-ui/themes";
import { PageHeader, ClinicInformationList } from "@/components";

export const metadata = {
  title: "Clinic Information | DentalEase",
  description: "Manage clinic information",
};

export default function Page() {
  return (
    <Flex direction="column" gap="4" className="h-full w-full">
      <PageHeader
        title="Clinic Information"
        description="Manage clinic information"
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
      <ClinicInformationList />
    </Flex>
  );
}

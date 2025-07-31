import { Flex, Button } from "@radix-ui/themes";
import { PageHeader, PrescriptionsList } from "@/components";

export const metadata = {
  title: "Prescriptions | DentalEase",
  description: "Manage prescriptions",
};

export default function Page() {
  return (
    <Flex direction="column" gap="4" className="h-full w-full">
      <PageHeader title="Prescriptions" description="Manage prescriptions">
        <Flex gap="2">
          <Button size="1" variant="soft">
            EXPORT DATA
          </Button>
          <Button size="1" variant="soft">
            IMPORT DATA
          </Button>
        </Flex>
      </PageHeader>
      <PrescriptionsList />
    </Flex>
  );
}

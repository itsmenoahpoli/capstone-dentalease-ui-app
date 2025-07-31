import { Flex, Button } from "@radix-ui/themes";
import { PageHeader, OwnerInformationList } from "@/components";

export const metadata = {
  title: "Owner Information | DentalEase",
  description: "Manage owner information",
};

export default function Page() {
  return (
    <Flex direction="column" gap="4" className="h-full w-full">
      <PageHeader
        title="Owner Information"
        description="Manage owner information"
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
      <OwnerInformationList />
    </Flex>
  );
}

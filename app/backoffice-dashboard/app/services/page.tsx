import { Flex, Button } from "@radix-ui/themes";
import { PageHeader, ServicesManageList } from "@/components";

export const metadata = {
  title: "Services | DentalEase",
  description: "Manage facility offered services",
};

export default function Page() {
  return (
    <Flex direction="column" gap="4" className="h-full w-full">
      <PageHeader
        title="Services"
        description="Manage facility offered services"
      >
        <Flex gap="2">
          <Button size="1" variant="soft">
            EXPORT DATA
          </Button>
          <Button size="1" variant="soft">
            IMPORT DATA
          </Button>
          <Button size="1">ADD SERVICE</Button>
        </Flex>
      </PageHeader>

      <ServicesManageList />
    </Flex>
  );
}

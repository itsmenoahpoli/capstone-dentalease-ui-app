import { Flex, Button } from "@radix-ui/themes";
import { PageHeader, InventoryList } from "@/components";

export const metadata = {
  title: "Inventory | DentalEase",
  description: "Manage inventory items",
};

export default function Page() {
  return (
    <Flex direction="column" gap="4" className="h-full w-full">
      <PageHeader title="Inventory" description="Manage inventory items">
        <Flex gap="2">
          <Button size="1" variant="soft">
            EXPORT DATA
          </Button>
          <Button size="1" variant="soft">
            IMPORT DATA
          </Button>
        </Flex>
      </PageHeader>
      <InventoryList />
    </Flex>
  );
}

import { Flex, Button } from "@radix-ui/themes";
import { PageHeader, BillingsPaymentsList } from "@/components";

export const metadata = {
  title: "Billings & Payments | DentalEase",
  description: "Manage billings and payments",
};

export default function Page() {
  return (
    <Flex direction="column" gap="4" className="h-full w-full">
      <PageHeader
        title="Billings & Payments"
        description="Manage billings and payments"
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
      <BillingsPaymentsList />
    </Flex>
  );
}

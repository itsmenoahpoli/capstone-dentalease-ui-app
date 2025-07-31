import { Flex, Button } from "@radix-ui/themes";
import { PageHeader, ContactUsEntriesList } from "@/components";

export const metadata = {
  title: "Contact Us Entries | DentalEase",
  description: "Manage contact us entries",
};

export default function Page() {
  return (
    <Flex direction="column" gap="4" className="h-full w-full">
      <PageHeader
        title="Contact Us Entries"
        description="Manage contact us entries"
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
      <ContactUsEntriesList />
    </Flex>
  );
}

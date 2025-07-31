import { Flex, Button } from "@radix-ui/themes";
import { PageHeader, LatestDevelopmentsList } from "@/components";

export const metadata = {
  title: "Latest Developments | DentalEase",
  description: "Manage latest developments",
};

export default function Page() {
  return (
    <Flex direction="column" gap="4" className="h-full w-full">
      <PageHeader
        title="Latest Developments"
        description="Manage latest developments"
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
      <LatestDevelopmentsList />
    </Flex>
  );
}

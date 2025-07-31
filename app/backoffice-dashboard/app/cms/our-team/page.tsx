import { Flex, Button } from "@radix-ui/themes";
import { PageHeader, OurTeamList } from "@/components";

export const metadata = {
  title: "Our Team | DentalEase",
  description: "Manage team members",
};

export default function Page() {
  return (
    <Flex direction="column" gap="4" className="h-full w-full">
      <PageHeader title="Our Team" description="Manage team members">
        <Flex gap="2">
          <Button size="1" variant="soft">
            EXPORT DATA
          </Button>
          <Button size="1" variant="soft">
            IMPORT DATA
          </Button>
        </Flex>
      </PageHeader>
      <OurTeamList />
    </Flex>
  );
}

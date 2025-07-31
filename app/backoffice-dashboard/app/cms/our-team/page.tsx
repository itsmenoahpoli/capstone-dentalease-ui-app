import { Flex } from "@radix-ui/themes";
import { PageHeader, CMSForm } from "@/components";

export const metadata = {
  title: "Our Team | DentalEase",
  description: "Manage team members",
};

export default function Page() {
  return (
    <Flex direction="column" gap="4" className="h-full w-full">
      <PageHeader title="Our Team" description="Manage team members" />
      <CMSForm category="our_team" categoryDisplay="" />
    </Flex>
  );
}

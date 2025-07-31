import { Flex } from "@radix-ui/themes";
import { PageHeader, CMSForm } from "@/components";

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
      />
      <CMSForm category="latest_developments" categoryDisplay="" />
    </Flex>
  );
}

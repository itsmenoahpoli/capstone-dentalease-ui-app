import { Flex } from "@radix-ui/themes";
import { PageHeader, CMSForm } from "@/components";

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
      />
      <CMSForm category="owner_information" categoryDisplay="" />
    </Flex>
  );
}

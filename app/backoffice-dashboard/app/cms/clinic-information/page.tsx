import { Flex } from "@radix-ui/themes";
import { PageHeader, CMSForm } from "@/components";

export const metadata = {
  title: "Clinic Information | DentalEase",
  description: "Manage clinic information",
};

export default function Page() {
  return (
    <Flex direction="column" gap="4" className="h-full w-full">
      <PageHeader
        title="Clinic Information"
        description="Manage clinic information"
      />
      <CMSForm category="clinic_information" categoryDisplay="" />
    </Flex>
  );
}

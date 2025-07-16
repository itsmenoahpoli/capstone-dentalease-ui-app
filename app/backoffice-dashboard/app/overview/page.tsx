import { Flex, Card } from "@radix-ui/themes";
import {
  PageHeader,
  DashboardStatCards,
  DashboardNearAppointments,
} from "@/components";

export const metadata = {
  title: "DentalEase | Dashboard Overview",
  description: "Overview of the DentalEase backoffice dashboard",
};

export default function Page() {
  return (
    <div className="h-full w-full">
      <PageHeader
        title="Dashboard Overview"
        description="Overview of the DentalEase backoffice dashboard"
      />

      <Flex direction="column" gap="7">
        <DashboardStatCards />

        <Flex gap="4">
          <DashboardNearAppointments />

          <Card className="w-full" />
        </Flex>
      </Flex>
    </div>
  );
}

import { PageHeader } from "@/components";

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
    </div>
  );
}

import { PageHeader } from "@/components";

export const metadata = {
  title: "DentalEase | Services",
  description: "Manage facility offered services",
};

export default function Page() {
  return (
    <div className="h-full w-full">
      <PageHeader
        title="Services"
        description="Manage facility offered services"
      />
    </div>
  );
}

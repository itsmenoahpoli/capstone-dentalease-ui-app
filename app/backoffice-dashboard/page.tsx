import { redirect } from "next/navigation";

export default function BackofficeDashboardPage() {
  redirect("/backoffice-dashboard/auth/sign-in");
}

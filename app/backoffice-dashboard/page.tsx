import { redirect } from "next/navigation";

export default function Page() {
  redirect("/app/backoffice-dashboard/auth/signin");
}

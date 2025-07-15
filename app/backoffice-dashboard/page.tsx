import { redirect } from "next/navigation";

export default function Page() {
  redirect("/backoffice-dashboard/auth/signin");
}

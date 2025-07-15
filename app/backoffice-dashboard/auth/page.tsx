import { redirect } from "next/navigation";

export default function AuthPage() {
  redirect("/backoffice-dashboard/auth/sign-in");
}

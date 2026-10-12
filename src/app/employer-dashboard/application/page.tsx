import { redirect } from "next/navigation";

export default function EmployerApplicationRedirect() {
  redirect("/employer-dashboard/applications");
}

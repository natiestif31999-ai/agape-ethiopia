import StaffDashboard from "@/components/StaffDashboard";
import { requireStaff } from "@/lib/auth/serverAuth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Staff Dashboard",
  description: "Review and manage beneficiary applications.",
};

export default async function StaffDashboardPage() {
  const profile = await requireStaff();
  if (!profile) {
    redirect("/login");
  }

  return <StaffDashboard />;
}

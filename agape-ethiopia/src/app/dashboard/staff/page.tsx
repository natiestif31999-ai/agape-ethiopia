import StaffDashboardEnhanced from "@/components/StaffDashboardEnhanced";
import { requireStaff } from "@/lib/auth/serverAuth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Staff Dashboard",
  description: "Professional staff portal for beneficiary management.",
};

export default async function StaffDashboardPage() {
  const profile = await requireStaff();
  if (!profile) {
    redirect("/login");
  }

  return <StaffDashboardEnhanced />;
}

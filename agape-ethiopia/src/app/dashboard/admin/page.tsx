import AdminDashboardEnhanced from "@/components/AdminDashboardEnhanced";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/serverAuth";

export const metadata = {
  title: "Admin Control Center",
  description: "System administration and organizational management.",
};

export default async function AdminDashboardPage() {
  const profile = await requireAdmin();
  if (!profile) {
    redirect("/login");
  }

  return <AdminDashboardEnhanced />;
}

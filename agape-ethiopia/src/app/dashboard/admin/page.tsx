import AdminDashboard from "@/components/AdminDashboard";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/serverAuth";

export const metadata = {
  title: "Admin Dashboard",
  description: "Manage beneficiaries, users, and site settings.",
};

export default async function AdminDashboardPage() {
  const profile = await requireAdmin();
  if (!profile) {
    redirect("/login");
  }

  return <AdminDashboard />;
}

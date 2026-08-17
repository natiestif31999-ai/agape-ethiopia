import AdminDashboardEnhanced from "@/components/AdminDashboardEnhanced";
import AdminLayout from "@/components/AdminLayout";
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

  return (
    <AdminLayout currentSection="overview">
      <div className="p-6">
        <AdminDashboardEnhanced />
      </div>
    </AdminLayout>
  );
}

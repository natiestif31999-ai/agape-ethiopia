import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/serverAuth";
import AdminLayout from "@/components/AdminLayout";
import AdminReportsSection from "@/components/admin/AdminReportsSection";

export const metadata = {
  title: "Reports",
  description: "Generate and view operational reports",
};

export default async function AdminReportsPage() {
  const profile = await requireAdmin();
  if (!profile) {
    redirect("/login");
  }

  return (
    <AdminLayout currentSection="reports">
      <div className="p-6">
        <AdminReportsSection />
      </div>
    </AdminLayout>
  );
}

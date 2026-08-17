import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/serverAuth";
import AdminLayout from "@/components/AdminLayout";
import AdminSettingsSection from "@/components/admin/AdminSettingsSection";

export const metadata = {
  title: "Settings",
  description: "System settings and configuration",
};

export default async function AdminSettingsPage() {
  const profile = await requireAdmin();
  if (!profile) {
    redirect("/login");
  }

  return (
    <AdminLayout currentSection="settings">
      <div className="p-6">
        <AdminSettingsSection />
      </div>
    </AdminLayout>
  );
}

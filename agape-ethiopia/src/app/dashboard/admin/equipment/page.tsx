import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/serverAuth";
import AdminLayout from "@/components/AdminLayout";
import AdminEquipmentSection from "@/components/admin/AdminEquipmentSection";

export const metadata = {
  title: "Equipment Management",
  description: "Manage equipment inventory and distributions",
};

export default async function AdminEquipmentPage() {
  const profile = await requireAdmin();
  if (!profile) {
    redirect("/login");
  }

  return (
    <AdminLayout currentSection="equipment">
      <div className="p-6">
        <AdminEquipmentSection />
      </div>
    </AdminLayout>
  );
}

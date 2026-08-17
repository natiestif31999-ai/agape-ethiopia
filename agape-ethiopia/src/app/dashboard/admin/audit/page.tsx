import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/serverAuth";
import AdminLayout from "@/components/AdminLayout";
import AdminAuditSection from "@/components/admin/AdminAuditSection";

export const metadata = {
  title: "Audit Logs",
  description: "View system audit logs and activity history",
};

export default async function AdminAuditPage() {
  const profile = await requireAdmin();
  if (!profile) {
    redirect("/login");
  }

  return (
    <AdminLayout currentSection="audit">
      <div className="p-6">
        <AdminAuditSection />
      </div>
    </AdminLayout>
  );
}

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/serverAuth";
import AdminLayout from "@/components/AdminLayout";
import AdminPartnersSection from "@/components/admin/AdminPartnersSection";

export const metadata = {
  title: "Partner Management",
  description: "Manage organizational partners",
};

export default async function AdminPartnersPage() {
  const profile = await requireAdmin();
  if (!profile) {
    redirect("/login");
  }

  return (
    <AdminLayout currentSection="partners">
      <div className="p-6">
        <AdminPartnersSection />
      </div>
    </AdminLayout>
  );
}

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/serverAuth";
import AdminLayout from "@/components/AdminLayout";
import AdminBeneficiariesSection from "@/components/admin/AdminBeneficiariesSection";

export const metadata = {
  title: "Beneficiary Management",
  description: "Manage all beneficiaries in the system",
};

export default async function AdminBeneficiariesPage() {
  const profile = await requireAdmin();
  if (!profile) {
    redirect("/login");
  }

  return (
    <AdminLayout currentSection="beneficiaries">
      <div className="p-6">
        <AdminBeneficiariesSection />
      </div>
    </AdminLayout>
  );
}

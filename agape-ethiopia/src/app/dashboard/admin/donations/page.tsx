import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/serverAuth";
import AdminLayout from "@/components/AdminLayout";
import AdminDonationsSection from "@/components/admin/AdminDonationsSection";

export const metadata = {
  title: "Donation Management",
  description: "Manage donations and financial records",
};

export default async function AdminDonationsPage() {
  const profile = await requireAdmin();
  if (!profile) {
    redirect("/login");
  }

  return (
    <AdminLayout currentSection="donations">
      <div className="p-6">
        <AdminDonationsSection />
      </div>
    </AdminLayout>
  );
}

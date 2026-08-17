import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/serverAuth";
import AdminLayout from "@/components/AdminLayout";
import AdminRegistrationsSection from "@/components/admin/AdminRegistrationsSection";

export const metadata = {
  title: "Registration Management",
  description: "Manage beneficiary registrations",
};

export default async function AdminRegistrationsPage() {
  const profile = await requireAdmin();
  if (!profile) {
    redirect("/login");
  }

  return (
    <AdminLayout currentSection="registrations">
      <div className="p-6">
        <AdminRegistrationsSection />
      </div>
    </AdminLayout>
  );
}

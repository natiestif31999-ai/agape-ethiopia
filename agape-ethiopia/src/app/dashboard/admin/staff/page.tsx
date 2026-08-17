/**
 * AGAPE MOBILITY ETHIOPIA
 * Admin Staff Management Page
 */

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/serverAuth";
import StaffUserManagement from "@/components/StaffUserManagement";
import AdminLayout from "@/components/AdminLayout";

export const metadata = {
  title: "Staff Management",
  description: "Manage staff user accounts and permissions",
};

export default async function StaffManagementPage() {
  const profile = await requireAdmin();
  if (!profile) {
    redirect("/login");
  }

  return (
    <AdminLayout currentSection="staff">
      <div className="p-6">
        <StaffUserManagement />
      </div>
    </AdminLayout>
  );
}

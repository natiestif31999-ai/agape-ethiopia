/**
 * AGAPE MOBILITY ETHIOPIA
 * Admin Staff Management Page
 */

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/serverAuth";
import StaffUserManagement from "@/components/StaffUserManagement";
import AppHeader from "@/components/layout/AppHeader";

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
    <>
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <StaffUserManagement />
      </main>
    </>
  );
}

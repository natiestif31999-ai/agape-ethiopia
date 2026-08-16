/**
 * AGAPE MOBILITY ETHIOPIA
 * Staff Dashboard - Registrations Page
 */

import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth/serverAuth";
import RegistrationManagement from "@/components/RegistrationManagement";

export const metadata = {
  title: "Registration Management",
  description: "Review and approve beneficiary registrations",
};

export default async function RegistrationsPage() {
  const profile = await requireStaff();
  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RegistrationManagement />
      </div>
    </div>
  );
}

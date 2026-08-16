/**
 * AGAPE MOBILITY ETHIOPIA
 * Beneficiary Profile Details Page
 */

import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/serverAuth";
import BeneficiaryProfileDetails from "@/components/BeneficiaryProfileDetails";
import AppHeader from "@/components/layout/AppHeader";

export const metadata = {
  title: "Beneficiary Profile",
  description: "View and manage beneficiary profile details",
};

export default async function BeneficiaryPage({ params }: { params: Promise<{ id: string }> }) {
  const profile = await requireAuth();
  if (!profile) {
    redirect("/login");
  }

  const resolvedParams = await params;

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 lg:px-8">
        <BeneficiaryProfileDetails beneficiaryId={resolvedParams.id} />
      </main>
    </>
  );
}

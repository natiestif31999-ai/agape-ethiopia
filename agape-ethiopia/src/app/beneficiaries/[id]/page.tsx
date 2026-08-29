import type { Metadata } from "next";
import AppHeader from "@/components/layout/AppHeader";
import BeneficiaryProfile from "@/components/BeneficiaryProfile";
import { requireStaff } from "@/lib/auth/serverAuth";
import { redirect } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  return {
    title: `Beneficiary ${id}`,
    description: `Profile and history for beneficiary ${id}`,
  };
}

export default async function BeneficiaryPage({ params }: { params: Promise<{ id: string }> }) {
  const profile = await requireStaff();
  if (!profile) {
    redirect("/login");
  }

  const resolvedParams = await params;

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <BeneficiaryProfile beneficiaryId={resolvedParams.id} />
      </main>
    </>
  );
}

import AppHeader from "@/components/layout/AppHeader";
import BeneficiaryProfile from "@/components/BeneficiaryProfile";

export default async function BeneficiaryPage({ params }: { params: Promise<{ id: string }> }) {
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

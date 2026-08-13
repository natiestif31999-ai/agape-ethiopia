import AppHeader from "@/components/layout/AppHeader";
import LocalizedSectionHeader from "@/components/LocalizedSectionHeader";
import DonationPortal from "@/components/donations/DonationPortal";

export const metadata = {
  title: "Donations",
  description: "Support AGAPE MOBILITY ETHIOPIA with local or international donations",
};

export default function DonationsPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <LocalizedSectionHeader
            titleKey="donations"
            subtitleKey="donationsTitle"
            descriptionKey="donationsDescription"
          />
        </section>

        <DonationPortal />
      </main>
    </>
  );
}

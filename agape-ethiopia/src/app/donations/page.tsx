import AppHeader from "@/components/layout/AppHeader";
import LocalizedSectionHeader from "@/components/LocalizedSectionHeader";

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
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-slate-700">
            <p>Your support helps fund wheelchairs, rehabilitation support, and follow-up care for persons with disabilities in Ethiopia.</p>
          </div>
        </section>
      </main>
    </>
  );
}

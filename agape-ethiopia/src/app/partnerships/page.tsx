import AppHeader from "@/components/layout/AppHeader";
import LocalizedSectionHeader from "@/components/LocalizedSectionHeader";

export default function PartnershipsPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <LocalizedSectionHeader
            titleKey="partners"
            subtitleKey="partnersTitle"
            descriptionKey="partnersDescription"
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-900">Hospitals and clinics</h2>
              <p className="mt-2 text-slate-700">Coordinate referrals and clinical support for rehabilitation and mobility services.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-900">NGOs and government partners</h2>
              <p className="mt-2 text-slate-700">Create shared workflows for equipment access, funding, and follow-up support.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

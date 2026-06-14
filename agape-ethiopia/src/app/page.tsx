import AppHeader from "@/components/layout/AppHeader";
import TabPanel from "@/components/TabPanel";

export default function HomePage() {
  return (
    <>
      <AppHeader />

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Agape Ethiopia</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900 md:text-5xl">
            Mobility logistics dashboard for donations and beneficiary requests.
          </h1>
          <p className="mt-4 max-w-3xl text-slate-600 md:text-lg">
            The interface is now structured around four operational tabs so the team can move from impact reporting to donation intake, request triage, and admin oversight without losing the live Supabase connection.
          </p>
        </section>

        <TabPanel />
      </main>
    </>
  );
}
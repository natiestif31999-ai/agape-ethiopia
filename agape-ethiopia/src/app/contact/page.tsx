import AppHeader from "@/components/layout/AppHeader";
import LocalizedSectionHeader from "@/components/LocalizedSectionHeader";

export default function ContactPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <LocalizedSectionHeader
            titleKey="contact"
            subtitleKey="contactTitle"
            descriptionKey="contactDescription"
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">Email</h2>
              <p className="mt-2 text-slate-700">info@agapemobilityethiopia.org</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">Phone</h2>
              <p className="mt-2 text-slate-700">+251 11 000 0000</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

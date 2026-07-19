import AppHeader from "@/components/layout/AppHeader";
import LocalizedSectionHeader from "@/components/LocalizedSectionHeader";

export default function AboutPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <LocalizedSectionHeader
            titleKey="about"
            subtitleKey="aboutTitle"
            descriptionKey="aboutDescription"
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-blue-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">{"Mission"}</h2>
              <p className="mt-2 text-slate-700">{"Provide compassionate mobility support and restore dignity for persons with disabilities across Ethiopia."}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">{"Vision"}</h2>
              <p className="mt-2 text-slate-700">{"Build a connected network that ensures access to mobility aids, rehabilitation, and inclusive community participation."}</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

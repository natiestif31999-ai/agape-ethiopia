import AppHeader from "@/components/layout/AppHeader";
import LocalizedSectionHeader from "@/components/LocalizedSectionHeader";

const services = [
  "Beneficiary registration and case review",
  "Wheelchair assessment and fitting",
  "Equipment distribution and delivery confirmation",
  "Partnership support with hospitals and rehabilitation centers",
  "Reporting and donor visibility",
];

export default function ServicesPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <LocalizedSectionHeader
            titleKey="services"
            subtitleKey="servicesTitle"
            descriptionKey="servicesDescription"
          />
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {services.map((service) => (
              <li key={service} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-700">
                {service}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}

import type { Metadata } from "next";
import AppHeader from "@/components/layout/AppHeader";
import PublicBeneficiaryRegistrationForm from "@/components/PublicBeneficiaryRegistrationForm";
import LocalizedSectionHeader from "@/components/LocalizedSectionHeader";

export const metadata: Metadata = {
  title: "AGAPE REGISTRATION · Self Registration",
  description: "Public self-registration entry for the Agape Ethiopia companion app.",
};

export default function AgapeRegistrationRegisterPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <LocalizedSectionHeader titleKey="register.title" subtitleKey="newRegistration" descriptionKey="register.description" />
          <PublicBeneficiaryRegistrationForm />
        </section>
      </main>
    </>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import AssessmentForm from "@/components/AssessmentForm";
import LocalizedSectionHeader from "@/components/LocalizedSectionHeader";
import { requireStaff } from "@/lib/auth/serverAuth";

export const metadata: Metadata = {
  title: "New Assessment",
  description: "Capture wheelchair assessment measurements for beneficiaries.",
};

export default async function AssessmentsPage() {
  try {
    await requireStaff();
  } catch {
    redirect("/login");
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-blue-50 p-6 shadow-sm">
          <LocalizedSectionHeader titleKey="newAssessment" subtitleKey="assessmentDescription" descriptionKey="assessmentDescription" />
        </section>
        <div className="mt-8">
          <AssessmentForm />
        </div>
      </main>
    </>
  );
}

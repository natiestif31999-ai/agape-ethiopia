import type { Metadata } from "next";
import AppHeader from "@/components/layout/AppHeader";
import MultipleBeneficiaryRegistrationForm from "@/components/agape-registration/MultipleBeneficiaryRegistrationForm";

export const metadata: Metadata = {
  title: "AGAPE REGISTRATION · Bulk Intake",
  description: "Multiple beneficiary recording workflow using the shared Agape Ethiopia Supabase database.",
};

export default function AgapeRegistrationBulkPage() {
  return (
    <>
      <AppHeader />
      <MultipleBeneficiaryRegistrationForm />
    </>
  );
}

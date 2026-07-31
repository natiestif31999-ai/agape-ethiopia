import type { Metadata } from "next";
import AppHeader from "@/components/layout/AppHeader";
import PartnershipAgreementPortal from "@/components/PartnershipAgreementPortal";

export const metadata: Metadata = {
  title: "AGAPE REGISTRATION · Partnership",
  description: "Organization partnership upload flow for the shared Agape Ethiopia companion portal.",
};

export default function AgapeRegistrationPartnerPage() {
  return (
    <>
      <AppHeader />
      <PartnershipAgreementPortal />
    </>
  );
}

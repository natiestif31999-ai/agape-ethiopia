import type { Metadata } from "next";
import AppHeader from "@/components/layout/AppHeader";
import RegistrationTracking from "@/components/agape-registration/RegistrationTracking";

export const metadata: Metadata = {
  title: "AGAPE REGISTRATION · Tracking",
  description: "Public registration tracking portal for viewing current application status.",
};

export default function AgapeRegistrationTrackPage() {
  return (
    <>
      <AppHeader />
      <RegistrationTracking />
    </>
  );
}

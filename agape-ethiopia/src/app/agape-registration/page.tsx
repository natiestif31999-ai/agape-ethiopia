import type { Metadata } from "next";
import AppHeader from "@/components/layout/AppHeader";
import AgapeRegistrationHome from "@/components/agape-registration/AgapeRegistrationHome";

export const metadata: Metadata = {
  title: "AGAPE REGISTRATION",
  description: "Fast public companion portal for registrations, application tracking, and partnership submissions.",
};

export default function AgapeRegistrationHomePage() {
  return (
    <>
      <AppHeader />
      <AgapeRegistrationHome />
    </>
  );
}

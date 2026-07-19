import type { Metadata } from "next";
import AppHeader from "@/components/layout/AppHeader";
import HomePageContent from "@/components/home/HomePageContent";

export const metadata: Metadata = {
  title: "AGAPE",
  description: "Agape Ethiopia Beneficiary Management System dashboard for managing registrations, assessments, and equipment tracking.",
};

export default function HomePage() {
  return (
    <>
      <AppHeader />
      <HomePageContent />
    </>
  );
}
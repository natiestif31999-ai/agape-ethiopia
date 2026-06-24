import AppHeader from "@/components/layout/AppHeader";
import StaffDashboard from "@/components/StaffDashboard";

export const metadata = {
  title: "Staff Dashboard",
  description: "Review and manage beneficiary applications.",
};

export default function StaffDashboardPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
        <StaffDashboard />
      </main>
    </>
  );
}

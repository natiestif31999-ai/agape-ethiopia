import AppHeader from "@/components/layout/AppHeader";
import AdminDashboard from "@/components/AdminDashboard";

export const metadata = {
  title: "Admin Dashboard",
  description: "Manage beneficiaries, users, and site settings.",
};

export default function AdminDashboardPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
        <AdminDashboard />
      </main>
    </>
  );
}

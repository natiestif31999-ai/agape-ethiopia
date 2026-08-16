import { ReactNode } from "react";
import { requireStaff } from "@/lib/auth/serverAuth";
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/layout/DashboardHeader";
import StaffNav from "@/components/layout/StaffNav";

export const metadata = {
  title: "Staff Portal | AGAPE MOBILITY ETHIOPIA",
  description: "Staff operational dashboard for beneficiary management.",
};

export default async function StaffLayout({ children }: { children: ReactNode }) {
  const profile = await requireStaff();
  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen flex-col bg-slate-100">
      <DashboardHeader title="Staff Portal" userRole={profile.role || "Staff"} />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <aside className="hidden w-64 md:block lg:w-72">
          <StaffNav />
        </aside>

        {/* Mobile Navigation - Visible only on small screens */}
        <div className="md:hidden w-full">
          <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white">
            <StaffNav />
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

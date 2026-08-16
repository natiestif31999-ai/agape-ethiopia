import { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth/serverAuth";
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/layout/DashboardHeader";
import AdminNav from "@/components/layout/AdminNav";

export const metadata = {
  title: "Admin Control Center | AGAPE MOBILITY ETHIOPIA",
  description: "Administrative control center for system management.",
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const profile = await requireAdmin();
  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen flex-col bg-slate-100">
      <DashboardHeader title="Admin Control Center" userRole={profile.role || "Admin"} />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <aside className="hidden w-64 md:block lg:w-72">
          <AdminNav />
        </aside>

        {/* Mobile Navigation - Visible only on small screens */}
        <div className="md:hidden w-full">
          <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-300 bg-slate-900">
            <AdminNav />
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

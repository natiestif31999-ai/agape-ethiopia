import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/serverAuth";
import AdminLayout from "@/components/AdminLayout";
import AdminAssessmentsSection from "@/components/admin/AdminAssessmentsSection";

export const metadata = {
  title: "Assessment Management",
  description: "Manage beneficiary assessments",
};

export default async function AdminAssessmentsPage() {
  const profile = await requireAdmin();
  if (!profile) {
    redirect("/login");
  }

  return (
    <AdminLayout currentSection="assessments">
      <div className="p-6">
        <AdminAssessmentsSection />
      </div>
    </AdminLayout>
  );
}

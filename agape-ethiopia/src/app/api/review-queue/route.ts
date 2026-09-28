import { NextResponse } from "next/server";
import { getSupabaseAdminClient, requireStaff } from "@/lib/auth/serverAuth";

type AssessmentQueueRow = {
  id: string;
  beneficiary_id: string | null;
  assessor_name: string | null;
  assessment_date: string | null;
  review_status: string;
  review_ready?: boolean;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  notes: string | null;
  recommendations: string | null;
  created_at: string | null;
};

export async function GET() {
  const profile = await requireStaff();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const [beneficiaries, assessments, requests, agreements] = await Promise.all([
    supabase.from("beneficiaries").select("id,registration_number,first_name,last_name,phone,region,status,created_at,photo_url").order("created_at", { ascending: false }).range(0, 999),
    supabase.from("assessments").select("id,beneficiary_id,assessor_name,assessment_date,review_status,reviewed_by,reviewed_at,notes,recommendations,created_at").order("assessment_date", { ascending: false }).range(0, 999),
    supabase.from("requests").select("id,beneficiary_id,beneficiary_name,item_needed,need_details,status,created_at").order("created_at", { ascending: false }).range(0, 999),
    supabase.from("organization_agreements").select("id,organization_name,organization_type,contact_person,email,status,submitted_at,agreement_file_name,agreement_file_path,agreement_file_url").order("submitted_at", { ascending: false }).range(0, 999),
  ]);

  let assessmentRows: AssessmentQueueRow[] = assessments.data ?? [];
  let assessmentReviewReady = true;

  if (assessments.error?.code === "42703") {
    const missingAssessmentFields = /assessor_name|review_status|reviewed_by|reviewed_at/i.test(assessments.error.message);
    if (missingAssessmentFields) {
      const fallback = await supabase
        .from("assessments")
        .select("id,beneficiary_id,assessment_date,notes,recommendations,created_at")
        .order("assessment_date", { ascending: false })
        .range(0, 999);

      if (fallback.error) {
        console.error("Assessment review queue fallback failed:", fallback.error);
        assessmentRows = [];
        assessmentReviewReady = false;
      } else {
        assessmentReviewReady = false;
        assessmentRows = (fallback.data ?? []).map((row) => ({
          ...row,
          assessor_name: "Assessment record",
          review_status: "Review setup required",
          review_ready: false,
        }));
      }
    }
  }

  const failed = [beneficiaries, requests, agreements].find((result) => result.error);
  if (failed?.error) {
    console.error("Review queue load failed:", failed.error);
    return NextResponse.json({ error: "Unable to load submission reviews." }, { status: 500 });
  }

  return NextResponse.json({
    beneficiaries: beneficiaries.data ?? [],
    assessments: assessmentRows,
    assessmentReviewReady,
    requests: requests.data ?? [],
    agreements: agreements.data ?? [],
  });
}
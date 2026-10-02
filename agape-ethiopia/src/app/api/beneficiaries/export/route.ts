import { NextResponse } from "next/server";
import { getCurrentUser, getSupabaseServerClient, requireStaff } from "@/lib/auth/serverAuth";
import { logAudit } from "@/lib/audit/auditLog";
import { generateBeneficiaryBackupWorkbook, validateBeneficiaryExportData } from "@/lib/beneficiaryExport";

export async function GET(req: Request) {
  const profile = await requireStaff();
  if (!profile) {
    const currentUser = await getCurrentUser();
    return NextResponse.json(
      { error: currentUser ? "Forbidden" : "Unauthorized" },
      { status: currentUser ? 403 : 401 }
    );
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  try {
    const pageSize = 1000;
    let offset = 0;
    let expectedCount: number | null = null;
    const beneficiaries: Record<string, unknown>[] = [];

    while (true) {
      const { data, error, count } = await supabase
        .from("beneficiaries")
        .select("*", { count: "exact" })
        .order("region", { ascending: true })
        .order("registration_date", { ascending: true })
        .order("registration_number", { ascending: true })
        .order("id", { ascending: true })
        .range(offset, offset + pageSize - 1);

      if (error) {
        throw new Error(error.message);
      }

      if (count === null) {
        throw new Error("Supabase did not return the beneficiary count. Export cancelled.");
      }
      if (expectedCount === null) {
        expectedCount = count;
      } else if (count !== expectedCount) {
        throw new Error("Beneficiary records changed during export. Please retry.");
      }

      const page = (data ?? []) as Record<string, unknown>[];
      if (page.length === 0 && beneficiaries.length < expectedCount) {
        throw new Error(`Incomplete beneficiary retrieval: received ${beneficiaries.length} of ${expectedCount} records.`);
      }
      if (page.length === 0 || beneficiaries.length + page.length >= expectedCount) {
        beneficiaries.push(...page);
        if (beneficiaries.length !== expectedCount) {
          throw new Error(`Beneficiary count mismatch: received ${beneficiaries.length} of ${expectedCount} records.`);
        }
        break;
      }

      beneficiaries.push(...page);
      offset += page.length;
    }

    const validation = validateBeneficiaryExportData(beneficiaries);
    if (new URL(req.url).searchParams.get("summary") === "1") {
      return NextResponse.json(
        { totalBeneficiaries: validation.totalBeneficiaries, totalRegions: validation.totalRegions },
        { headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } }
      );
    }

    const generatedAt = new Date();
    const workbook = await generateBeneficiaryBackupWorkbook(beneficiaries, generatedAt);
    const timestamp = generatedAt.toISOString().slice(0, 10);
    const timeSuffix = generatedAt.toISOString().slice(11, 16).replace(":", "");
    const filename = `Agape_Beneficiary_Backup_${timestamp}_${timeSuffix}.xlsx`;

    const auditResult = await logAudit(
      profile.id,
      profile.email,
      "beneficiary_export",
      "beneficiary_backup",
      "export",
      {},
      {
        role: profile.role,
        exported_count: validation.totalBeneficiaries,
        total_regions: validation.totalRegions,
        region_totals: workbook.report.regionTotals,
        all_beneficiaries_rows: workbook.report.allBeneficiariesRows,
        generated_at: generatedAt.toISOString(),
        scope: "full",
      }
    );

    if (auditResult.error) {
      console.warn("Beneficiary export audit log warning:", auditResult.error);
    }

    console.info("Beneficiary backup export verified", workbook.report);

    return new NextResponse(Buffer.from(workbook.buffer), {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "X-Exported-Beneficiary-Count": String(validation.totalBeneficiaries),
        "X-Exported-Region-Count": String(validation.totalRegions),
        "X-All-Beneficiaries-Rows": String(workbook.report.allBeneficiariesRows),
        "X-Generated-At": generatedAt.toISOString(),
      },
    });
  } catch {
    console.error("Beneficiary backup generation failed.");
    return NextResponse.json({ error: "Unable to generate beneficiary backup. Please try again." }, { status: 500 });
  }
}

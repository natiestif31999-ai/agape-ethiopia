import { NextResponse } from "next/server";
import { getSupabaseServerClient, requireStaff } from "@/lib/auth/serverAuth";
import * as XLSX from "xlsx";

// Generate CSV from beneficiary data
function generateCSV(beneficiaries: Record<string, string | null | undefined>[]): string {
  if (beneficiaries.length === 0) {
    return "No beneficiaries found";
  }

  // Define column headers
  const headers = [
    "Registration Number",
    "First Name",
    "Middle Name",
    "Last Name",
    "Phone",
    "Region",
    "Kebele",
    "Gender",
    "Date of Birth",
    "Disability Type",
    "Status",
    "Registration Date",
    "Notes",
  ];

  // Convert beneficiaries to CSV rows
  const rows = beneficiaries.map((b) => [
    b.registration_number || "",
    b.first_name || "",
    b.middle_name || "",
    b.last_name || "",
    b.phone || "",
    b.region || "",
    b.kebele || "",
    b.gender || "",
    b.date_of_birth || "",
    b.disability_type || "",
    b.status || "",
    b.created_at?.split("T")[0] || "",
    (b.notes || "").replace(/"/g, '""'), // Escape quotes for CSV
  ]);

  // Build CSV content
  const csvContent = [
    headers.map((h) => `"${h}"`).join(","),
    ...rows.map((row) => row.map((cell: string) => `"${cell}"`).join(",")),
  ].join("\n");

  return csvContent;
}

// Generate Excel (.xlsx) from beneficiary data
function generateExcel(beneficiaries: Record<string, string | null | undefined>[]): Buffer {
  // Define columns and data
  const columns = [
    "Registration Number",
    "First Name",
    "Middle Name",
    "Last Name",
    "Phone",
    "Region",
    "Kebele",
    "Gender",
    "Date of Birth",
    "Disability Type",
    "Status",
    "Registration Date",
    "Notes",
  ];

  // Convert to Excel-friendly format
  const rows = beneficiaries.map((b) => ({
    "Registration Number": b.registration_number || "",
    "First Name": b.first_name || "",
    "Middle Name": b.middle_name || "",
    "Last Name": b.last_name || "",
    Phone: b.phone || "",
    Region: b.region || "",
    Kebele: b.kebele || "",
    Gender: b.gender || "",
    "Date of Birth": b.date_of_birth || "",
    "Disability Type": b.disability_type || "",
    Status: b.status || "",
    "Registration Date": b.created_at?.split("T")[0] || "",
    Notes: b.notes || "",
  }));

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows, { header: columns });

  // Set column widths for better readability
  const columnWidths = [
    18, // Registration Number
    15, // First Name
    15, // Middle Name
    15, // Last Name
    18, // Phone
    15, // Region
    15, // Kebele
    12, // Gender
    15, // Date of Birth
    18, // Disability Type
    15, // Status
    18, // Registration Date
    25, // Notes
  ];

  worksheet["!cols"] = columnWidths.map((w) => ({ wch: w }));

  // Add formatting to header row
  for (let i = 0; i < columns.length; i++) {
    const cellRef = XLSX.utils.encode_col(i) + "1";
    if (worksheet[cellRef]) {
      worksheet[cellRef].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4B5563" } },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }
  }

  XLSX.utils.book_append_sheet(workbook, worksheet, "Beneficiaries");

  // Generate buffer
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  return excelBuffer as Buffer;
}


export async function GET(req: Request) {
  const profile = await requireStaff();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const format = url.searchParams.get("format")?.toLowerCase() ?? "xlsx";
  const status = url.searchParams.get("status")?.trim() ?? "";
  const region = url.searchParams.get("region")?.trim() ?? "";

  if (!["csv", "xlsx"].includes(format)) {
    return NextResponse.json({ error: "Format must be 'csv' or 'xlsx'." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  try {
    let query = supabase
      .from("beneficiaries")
      .select(
        "id,registration_number,first_name,middle_name,last_name,phone,region,kebele,gender,date_of_birth,disability_type,status,created_at,notes"
      )
      .order("region", { ascending: true })
      .order("created_at", { ascending: true });

    // Apply filters
    if (status && status.toLowerCase() !== "all") {
      query = query.eq("status", status);
    }

    if (region && region.toLowerCase() !== "all") {
      query = query.eq("region", region);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "No beneficiaries found matching filters." }, { status: 404 });
    }

    // Determine filename
    const timestamp = new Date().toISOString().split("T")[0];
    const baseFilename = `Agape_Ethiopia_Beneficiaries_${timestamp}`;

    // Generate appropriate format
    if (format === "xlsx") {
      const excelBuffer = generateExcel(data);
      return new NextResponse(Buffer.from(excelBuffer), {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename="${baseFilename}.xlsx"`,
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    } else {
      // CSV format
      const csvContent = generateCSV(data);
      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename="${baseFilename}.csv"`,
          "Content-Type": "text/csv; charset=utf-8",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    }
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to generate export." }, { status: 500 });
  }
}

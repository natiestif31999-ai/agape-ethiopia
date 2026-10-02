import ExcelJS from "exceljs";
import JSZip from "jszip";

export const BENEFICIARY_EXPORT_COLUMNS = [
  "registration_number",
  "registration_date",
  "first_name",
  "middle_name",
  "last_name",
  "date_of_birth",
  "gender",
  "phone",
  "region",
  "kifle_ketema",
  "kebele",
  "house_number",
  "disability_type",
  "referral_source",
  "photo_url",
  "notes",
  "status",
  "created_at",
  "updated_at",
] as const;

export type BeneficiaryExportRow = Record<string, unknown>;

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function getBeneficiaryIdentity(beneficiary: BeneficiaryExportRow): string {
  return formatCellValue(beneficiary.id).trim() || formatCellValue(beneficiary.registration_number).trim();
}

function sanitizeSheetName(name: string): string {
  const trimmed = name.replace(/[\u0000-\u001F\\/*?:\[\]]/g, " ").trim().replace(/^'+|'+$/g, "");
  let safeName = "";
  for (const character of trimmed) {
    if (safeName.length + character.length > 31) {
      break;
    }
    safeName += character;
  }
  return safeName || "Region";
}

function allocateRegionSheetNames(regionNames: string[]): Map<string, string> {
  const allocated = new Set(["export information", "region summary", "all beneficiaries"]);
  const sheetNames = new Map<string, string>();

  for (const regionName of regionNames) {
    const baseName = sanitizeSheetName(regionName);
    let candidate = baseName;
    let suffix = 2;

    while (allocated.has(candidate.toLocaleLowerCase())) {
      const suffixText = ` (${suffix})`;
      candidate = `${baseName.slice(0, 31 - suffixText.length)}${suffixText}`;
      suffix += 1;
    }

    allocated.add(candidate.toLocaleLowerCase());
    sheetNames.set(regionName, candidate);
  }

  return sheetNames;
}

export function summarizeBeneficiaryRegions(beneficiaries: BeneficiaryExportRow[]) {
  const summary = new Map<string, number>();

  for (const beneficiary of beneficiaries) {
    const region = getRegionName(beneficiary);
    summary.set(region, (summary.get(region) ?? 0) + 1);
  }

  const ordered = [...summary.entries()].sort(([regionA], [regionB]) => regionA.localeCompare(regionB));

  return {
    ordered,
    totalRegions: ordered.length,
    totalBeneficiaries: beneficiaries.length,
  };
}

function getRegionName(beneficiary: BeneficiaryExportRow): string {
  const region = formatCellValue(beneficiary.region);
  return region.trim() ? region : "Unassigned";
}

export function validateBeneficiaryExportData(beneficiaries: BeneficiaryExportRow[]) {
  const seenIds = new Set<string>();
  const regionTotals = new Map<string, number>();

  for (const beneficiary of beneficiaries) {
    const identity = getBeneficiaryIdentity(beneficiary);
    if (!identity) {
      throw new Error("A beneficiary record is missing both its id and registration number. Export cancelled.");
    }
    if (seenIds.has(identity)) {
      throw new Error(`Duplicate beneficiary identity detected: ${identity}`);
    }
    seenIds.add(identity);

    const region = formatCellValue(beneficiary.region).trim() || "Unassigned";
    regionTotals.set(region, (regionTotals.get(region) ?? 0) + 1);
  }

  const regionTotalCount = [...regionTotals.values()].reduce((sum, count) => sum + count, 0);
  if (regionTotalCount !== beneficiaries.length) {
    throw new Error(`Region totals do not reconcile with beneficiary count: ${regionTotalCount} !== ${beneficiaries.length}`);
  }

  if (beneficiaries.length === 0) {
    return {
      totalRegions: 0,
      totalBeneficiaries: 0,
      regionTotals: [] as Array<[string, number]>,
    };
  }

  const orderedRegionTotals = [...regionTotals.entries()].sort(([regionA], [regionB]) => regionA.localeCompare(regionB));

  return {
    totalRegions: orderedRegionTotals.length,
    totalBeneficiaries: beneficiaries.length,
    regionTotals: orderedRegionTotals,
  };
}

const BENEFICIARY_COLUMN_WIDTHS: Record<string, number> = {
  registration_number: 22,
  registration_date: 18,
  first_name: 18,
  middle_name: 18,
  last_name: 18,
  date_of_birth: 18,
  gender: 12,
  phone: 18,
  region: 20,
  kifle_ketema: 20,
  kebele: 20,
  house_number: 18,
  disability_type: 22,
  referral_source: 22,
  photo_url: 32,
  notes: 32,
  status: 20,
  created_at: 24,
  updated_at: 24,
  id: 38,
};

function getRegistrationDateSortValue(beneficiary: BeneficiaryExportRow): number {
  const registrationDate = formatCellValue(beneficiary.registration_date).trim();
  if (!registrationDate) {
    return Number.MAX_SAFE_INTEGER;
  }
  const timestamp = new Date(registrationDate).getTime();
  return Number.isFinite(timestamp) ? timestamp : Number.MAX_SAFE_INTEGER;
}

function compareBeneficiaries(left: BeneficiaryExportRow, right: BeneficiaryExportRow): number {
  const dateDifference = getRegistrationDateSortValue(left) - getRegistrationDateSortValue(right);
  if (dateDifference !== 0) {
    return dateDifference;
  }
  return formatCellValue(left.registration_number).trim().localeCompare(formatCellValue(right.registration_number).trim());
}

function getColumnHeader(columnName: string): string {
  return columnName.replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function styleHeaderRow(worksheet: ExcelJS.Worksheet, rowNumber: number) {
  const headerRow = worksheet.getRow(rowNumber);
  headerRow.height = 24;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F2937" } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  });
}

type RegionSectionLayout = {
  region: string;
  headingRow: number;
  headingSpacerRow: number;
  headerRow: number;
  dataStartRow: number;
  dataEndRow: number;
  spacerRow: number | null;
};

function createBeneficiaryWorksheet(
  workbook: ExcelJS.Workbook,
  sheetName: string,
  beneficiaries: BeneficiaryExportRow[],
  columns: string[],
  regionSections?: Array<[string, BeneficiaryExportRow[]]>
) {
  const worksheet = workbook.addWorksheet(sheetName, {
    views: regionSections ? [] : [{ state: "frozen", ySplit: 1 }],
  });
  worksheet.columns = columns.map((columnName) => {
    const column: Partial<ExcelJS.Column> = {
      key: columnName,
      width: BENEFICIARY_COLUMN_WIDTHS[columnName] ?? 24,
    };
    if (!regionSections) {
      column.header = getColumnHeader(columnName);
    }
    return column;
  });

  const regionLayouts: RegionSectionLayout[] = [];
  const appendHeaders = () => {
    const headerRow = regionSections ? worksheet.addRow(columns.map(getColumnHeader)) : worksheet.getRow(1);
    styleHeaderRow(worksheet, headerRow.number);
    return headerRow.number;
  };
  const appendBeneficiary = (beneficiary: BeneficiaryExportRow) => {
    const row = worksheet.addRow(columns.map((columnName) => formatCellValue(beneficiary[columnName])));
    row.height = 20;
  };

  if (regionSections) {
    for (let sectionIndex = 0; sectionIndex < regionSections.length; sectionIndex += 1) {
      const [region, regionBeneficiaries] = regionSections[sectionIndex];
      const headingRow = worksheet.addRow([region]);
      worksheet.mergeCells(headingRow.number, 1, headingRow.number, columns.length);
      headingRow.height = 26;
      const headingCell = headingRow.getCell(1);
      headingCell.font = { bold: true, size: 14, color: { argb: "FF1F2937" } };
      headingCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2E8F0" } };
      headingCell.alignment = { vertical: "middle" };

      const headingSpacerRow = worksheet.addRow([]).number;
      const headerRow = appendHeaders();
      const dataStartRow = worksheet.rowCount + 1;
      for (const beneficiary of regionBeneficiaries) {
        appendBeneficiary(beneficiary);
      }
      const dataEndRow = worksheet.rowCount;
      const spacerRow = sectionIndex < regionSections.length - 1 ? worksheet.addRow([]).number : null;
      regionLayouts.push({ region, headingRow: headingRow.number, headingSpacerRow, headerRow, dataStartRow, dataEndRow, spacerRow });
    }
  } else {
    appendHeaders();
    for (const beneficiary of beneficiaries) {
      appendBeneficiary(beneficiary);
    }
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: Math.max(1, worksheet.rowCount), column: columns.length },
    };
  }

  return { worksheet, regionLayouts };
}

export async function generateBeneficiaryBackupWorkbook(
  beneficiaries: BeneficiaryExportRow[],
  generatedAt = new Date()
) {
  const orderedBeneficiaries = [...beneficiaries].sort((left, right) => {
    const regionOrder = getRegionName(left).localeCompare(getRegionName(right));
    return regionOrder || compareBeneficiaries(left, right);
  });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Agape Mobility Ethiopia";
  workbook.created = generatedAt;
  workbook.modified = generatedAt;
  const summary = summarizeBeneficiaryRegions(orderedBeneficiaries);
  const validation = validateBeneficiaryExportData(orderedBeneficiaries);
  const byRegion = new Map<string, BeneficiaryExportRow[]>();
  const columns = [...new Set([
    ...BENEFICIARY_EXPORT_COLUMNS,
    ...orderedBeneficiaries.flatMap((beneficiary) => Object.keys(beneficiary)),
  ])];

  for (const beneficiary of orderedBeneficiaries) {
    const regionName = getRegionName(beneficiary);
    const bucket = byRegion.get(regionName) ?? [];
    bucket.push(beneficiary);
    byRegion.set(regionName, bucket);
  }

  const regionEntries = [...byRegion.entries()].sort(([regionA], [regionB]) => regionA.localeCompare(regionB));
  const regionSheetNames = allocateRegionSheetNames(regionEntries.map(([regionName]) => regionName));
  const allBeneficiaries = createBeneficiaryWorksheet(workbook, "All Beneficiaries", orderedBeneficiaries, columns, regionEntries);

  const regionSummarySheet = workbook.addWorksheet("Region Summary", { views: [{ state: "frozen", ySplit: 1 }] });
  regionSummarySheet.columns = [
    { header: "Region", key: "region", width: 24 },
    { header: "Beneficiary Count", key: "count", width: 20 },
  ];
  for (const [region, beneficiariesForRegion] of regionEntries) {
    regionSummarySheet.addRow({ region, count: beneficiariesForRegion.length });
  }
  const totalRow = regionSummarySheet.addRow({ region: "TOTAL", count: validation.totalBeneficiaries });
  totalRow.font = { bold: true };
  regionSummarySheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: Math.max(1, regionSummarySheet.rowCount), column: 2 },
  };
  styleHeaderRow(regionSummarySheet, 1);

  const exportInfoRows: Array<[string, string]> = [
    ["Organization", "Agape Mobility Ethiopia"],
    ["Export Type", "Full Beneficiary Backup"],
    ["Generated At", generatedAt.toISOString()],
    ["Total Beneficiaries", String(summary.totalBeneficiaries || validation.totalBeneficiaries)],
    ["Total Regions", String(summary.totalRegions || validation.totalRegions)],
    ["Data Source", "Current Supabase beneficiary database"],
  ];

  const exportInfoSheet = workbook.addWorksheet("Export Information");
  exportInfoSheet.columns = [{ width: 24 }, { width: 44 }];
  for (const [label, value] of exportInfoRows) {
    const row = exportInfoSheet.addRow([label, value]);
    row.getCell(1).font = { bold: true };
  }

  for (const [regionName, regionItems] of regionEntries) {
    const regionSheetName = regionSheetNames.get(regionName) ?? sanitizeSheetName(regionName);
    createBeneficiaryWorksheet(workbook, regionSheetName, regionItems, columns);
  }

  const buffer = Buffer.from(new Uint8Array(await workbook.xlsx.writeBuffer()));
  const inspectedWorkbook = new ExcelJS.Workbook();
  const workbookArrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  await inspectedWorkbook.xlsx.load(workbookArrayBuffer);
  const archive = await JSZip.loadAsync(workbookArrayBuffer);
  const archivePaths = Object.keys(archive.files);
  const forbiddenArchivePaths = archivePaths.filter((path) => /^xl\/(?:media|drawings)\//i.test(path));
  if (forbiddenArchivePaths.length > 0) {
    throw new Error(`Workbook contains image or drawing files: ${forbiddenArchivePaths.join(", ")}`);
  }
  const relationshipFiles = archive.file(/\.rels$/i);
  for (const relationshipFile of relationshipFiles) {
    const relationshipXml = await relationshipFile.async("string");
    if (/relationships\/(?:image|drawing)/i.test(relationshipXml)) {
      throw new Error(`Workbook contains an image or drawing relationship in ${relationshipFile.name}.`);
    }
  }
  const contentTypes = await archive.file("[Content_Types].xml")?.async("string");
  if (contentTypes && /ContentType="image\//i.test(contentTypes)) {
    throw new Error("Workbook content types include an image type.");
  }

  for (const worksheet of inspectedWorkbook.worksheets) {
    if (worksheet.getImages().length > 0) {
      throw new Error(`Workbook worksheet ${worksheet.name} contains an embedded image.`);
    }
  }

  const expectedWorksheetNames = [
    "All Beneficiaries",
    "Region Summary",
    "Export Information",
    ...regionEntries.map(([regionName]) => regionSheetNames.get(regionName) ?? sanitizeSheetName(regionName)),
  ];
  if (inspectedWorkbook.worksheets.length !== expectedWorksheetNames.length ||
      inspectedWorkbook.worksheets.some((worksheet, index) => worksheet.name !== expectedWorksheetNames[index])) {
    throw new Error("Workbook worksheet names or order do not match the expected export structure.");
  }

  const identityKey = orderedBeneficiaries.every((beneficiary) => formatCellValue(beneficiary.id).trim())
    ? "id"
    : "registration_number";
  const identityColumn = columns.indexOf(identityKey) + 1;
  const allBeneficiariesSheet = inspectedWorkbook.getWorksheet("All Beneficiaries");
  const regionSummary = inspectedWorkbook.getWorksheet("Region Summary");
  const exportInformation = inspectedWorkbook.getWorksheet("Export Information");
  if (!allBeneficiariesSheet || !regionSummary || !exportInformation) {
    throw new Error("Workbook is missing a required summary or beneficiary worksheet.");
  }

  const databaseColumns = [...new Set(orderedBeneficiaries.flatMap((beneficiary) => Object.keys(beneficiary)))];
  const headerLabels = columns.map(getColumnHeader);
  const headerIndexes = new Map(headerLabels.map((header, index) => [header, index + 1]));
  for (const databaseColumn of databaseColumns) {
    if (!headerIndexes.has(getColumnHeader(databaseColumn))) {
      throw new Error(`Workbook is missing beneficiary database field ${databaseColumn}.`);
    }
  }

  const expectedIdentities = new Set(orderedBeneficiaries.map((beneficiary) => formatCellValue(beneficiary[identityKey]).trim()));
  const observedIdentities = new Set<string>();
  for (const section of allBeneficiaries.regionLayouts) {
    const headingRow = allBeneficiariesSheet.getRow(section.headingRow);
    if (formatCellValue(headingRow.getCell(1).value) !== section.region || !headingRow.getCell(1).font.bold) {
      throw new Error(`Region heading is missing or not bold for ${section.region}.`);
    }
    if (columns.length > 1 && !headingRow.getCell(columns.length).isMerged) {
      throw new Error(`Region heading is not merged across the data columns for ${section.region}.`);
    }
    assertBlankRow(allBeneficiariesSheet, section.headingSpacerRow, columns.length, `${section.region} heading spacer`);
    assertHeaderRow(allBeneficiariesSheet, section.headerRow, headerLabels, section.region);
    const expectedRegionItems = byRegion.get(section.region) ?? [];
    if (section.dataEndRow - section.dataStartRow + 1 !== expectedRegionItems.length) {
      throw new Error(`Beneficiary count does not reconcile in the ${section.region} section.`);
    }

    for (let index = 0; index < expectedRegionItems.length; index += 1) {
      const source = expectedRegionItems[index];
      const rowNumber = section.dataStartRow + index;
      const row = allBeneficiariesSheet.getRow(rowNumber);
      const identity = formatCellValue(row.getCell(identityColumn).value).trim();
      if (identity !== formatCellValue(source[identityKey]).trim() || observedIdentities.has(identity)) {
        throw new Error(`Missing, misplaced, or duplicate beneficiary in ${section.region}.`);
      }
      observedIdentities.add(identity);
      if (getRegionName(source) !== section.region) {
        throw new Error(`Beneficiary ${identity} is in the wrong region section.`);
      }
      if (index > 0 && compareBeneficiaries(expectedRegionItems[index - 1], source) > 0) {
        throw new Error(`Beneficiaries are not sorted by registration date and registration number in ${section.region}.`);
      }
      assertBeneficiaryRow(row, source, databaseColumns, headerIndexes, identity);
    }

    if (section.spacerRow !== null) {
      assertBlankRow(allBeneficiariesSheet, section.spacerRow, columns.length, `${section.region} section spacer`);
    }
  }
  if (observedIdentities.size !== validation.totalBeneficiaries ||
      [...expectedIdentities].some((identity) => !observedIdentities.has(identity))) {
    throw new Error("All Beneficiaries does not contain every source beneficiary exactly once.");
  }

  const summaryHeaderIndexes = new Map([[
    "Region", 1,
  ], ["Beneficiary Count", 2]]);
  assertHeaderRow(regionSummary, 1, ["Region", "Beneficiary Count"], "Region Summary");
  if (regionSummary.rowCount !== regionEntries.length + 2) {
    throw new Error("Region Summary row count does not match the current region totals.");
  }
  for (let index = 0; index < regionEntries.length; index += 1) {
    const [region, regionBeneficiaries] = regionEntries[index];
    const row = regionSummary.getRow(index + 2);
    if (formatCellValue(row.getCell(summaryHeaderIndexes.get("Region")!).value) !== region ||
        formatCellValue(row.getCell(summaryHeaderIndexes.get("Beneficiary Count")!).value) !== String(regionBeneficiaries.length)) {
      throw new Error(`Region Summary total does not match Supabase for ${region}.`);
    }
  }
  const totalSummaryRow = regionSummary.getRow(regionEntries.length + 2);
  if (formatCellValue(totalSummaryRow.getCell(1).value) !== "TOTAL" ||
      formatCellValue(totalSummaryRow.getCell(2).value) !== String(validation.totalBeneficiaries)) {
    throw new Error("Region Summary grand total does not match the source beneficiary count.");
  }

  for (const [regionName, regionItems] of regionEntries) {
    const sheetName = regionSheetNames.get(regionName) ?? sanitizeSheetName(regionName);
    const regionSheet = inspectedWorkbook.getWorksheet(sheetName);
    if (!regionSheet || regionSheet.rowCount !== regionItems.length + 1) {
      throw new Error(`Region sheet row count does not match Supabase for ${regionName}.`);
    }
    assertHeaderRow(regionSheet, 1, headerLabels, sheetName);
    const regionSheetIds = new Set<string>();
    for (let index = 0; index < regionItems.length; index += 1) {
      const row = regionSheet.getRow(index + 2);
      const source = regionItems[index];
      const identity = formatCellValue(row.getCell(identityColumn).value).trim();
      if (identity !== formatCellValue(source[identityKey]).trim() || regionSheetIds.has(identity)) {
        throw new Error(`Region sheet ${sheetName} contains a missing, misplaced, or duplicate beneficiary.`);
      }
      regionSheetIds.add(identity);
      assertBeneficiaryRow(row, source, databaseColumns, headerIndexes, identity);
    }
  }

  const requiredExportInformation = ["Organization", "Export Type", "Generated At", "Total Beneficiaries", "Total Regions", "Data Source"];
  if (exportInformation.rowCount !== requiredExportInformation.length) {
    throw new Error("Export Information does not contain the expected summary fields.");
  }
  const exportInformationFields = new Set<string>();
  for (let rowNumber = 1; rowNumber <= exportInformation.rowCount; rowNumber += 1) {
    exportInformationFields.add(formatCellValue(exportInformation.getRow(rowNumber).getCell(1).value));
  }
  if (requiredExportInformation.some((field) => !exportInformationFields.has(field))) {
    throw new Error("Export Information is missing a required summary field.");
  }

  return {
    buffer,
    report: {
      totalBeneficiaries: validation.totalBeneficiaries,
      totalRegionSheets: regionEntries.length,
      allBeneficiariesRows: validation.totalBeneficiaries,
      regionTotals: validation.regionTotals,
    },
  };
}

function assertBlankRow(worksheet: ExcelJS.Worksheet, rowNumber: number, columnCount: number, label: string) {
  for (let column = 1; column <= columnCount; column += 1) {
    const value = worksheet.getRow(rowNumber).getCell(column).value;
    if (value !== null && value !== undefined && value !== "") {
      throw new Error(`${label} is not blank.`);
    }
  }
}

function assertHeaderRow(worksheet: ExcelJS.Worksheet, rowNumber: number, expectedHeaders: string[], label: string) {
  const row = worksheet.getRow(rowNumber);
  for (let index = 0; index < expectedHeaders.length; index += 1) {
    const cell = row.getCell(index + 1);
    if (formatCellValue(cell.value) !== expectedHeaders[index] || !cell.font.bold) {
      throw new Error(`${label} is missing a bold ${expectedHeaders[index]} column header.`);
    }
  }
}

function assertBeneficiaryRow(
  row: ExcelJS.Row,
  source: BeneficiaryExportRow,
  databaseColumns: string[],
  headerIndexes: Map<string, number>,
  identity: string
) {
  for (const databaseColumn of databaseColumns) {
    const columnIndex = headerIndexes.get(getColumnHeader(databaseColumn));
    if (!columnIndex || formatCellValue(row.getCell(columnIndex).value) !== formatCellValue(source[databaseColumn])) {
      throw new Error(`Beneficiary ${identity} has missing or mismatched exported data for ${databaseColumn}.`);
    }
  }
}

export const REGION_CODE_MAP: Record<string, string> = {
  AA: "AA",
  "ADDIS ABABA": "AA",
  "ADDISABABA": "AA",
  AFA: "AFA",
  AFAR: "AFA",
  AMH: "AMH",
  AMHARA: "AMH",
  BEN: "BEN",
  "BENISHANGUL GUMUZ": "BEN",
  "BENISHANGULGUMUZ": "BEN",
  DD: "DD",
  "DIRE DAWA": "DD",
  "DIREDAWA": "DD",
  GAM: "GAM",
  GAMBELA: "GAM",
  HAR: "HAR",
  HARARI: "HAR",
  OR: "ORO",
  ORO: "ORO",
  OROMIA: "ORO",
  SID: "SID",
  SIDAMA: "SID",
  SOM: "SOM",
  SOMALI: "SOM",
  SNN: "SNN",
  SNNP: "SNN",
  "SOUTH ETHIOPIA": "SNN",
  "SOUTHETHIOPIA": "SNN",
  TIG: "TIG",
  TIGRAY: "TIG",
  SWE: "SWE",
  "SOUTHWEST ETHIOPIA": "SWE",
  "SOUTHWESTETHIOPIA": "SWE",
  "CENTRAL ETHIOPIA": "CET",
  "CENTRALETHIOPIA": "CET",
  "SOUTHERN ETHIOPIA": "SET",
  "SOUTHERNETHIOPIA": "SET",
  "ETHIOPIA": "ETH",
  GEN: "GEN",
};

export function normalizeRegionCode(value?: string | null): string {
  const cleaned = (value ?? "").trim();
  if (!cleaned) {
    return "GEN";
  }

  const normalized = cleaned
    .toUpperCase()
    .replace(/[_-]/g, " ")
    .replace(/[^A-Z ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const lookupKey = normalized.replace(/\s+/g, " ");
  if (lookupKey in REGION_CODE_MAP) {
    return REGION_CODE_MAP[lookupKey];
  }

  const compact = normalized.replace(/\s+/g, "");
  if (compact in REGION_CODE_MAP) {
    return REGION_CODE_MAP[compact];
  }

  const prefix = compact.slice(0, 3);
  return prefix || "GEN";
}

export function generateBeneficiaryIdentifier(region?: string | null, sequence?: number): string {
  const regionCode = normalizeRegionCode(region);
  const nextSequence = Number.isInteger(sequence) && Number(sequence) > 0 ? Number(sequence) : 1;
  return `AG-B-${regionCode}-${String(nextSequence).padStart(6, "0")}`;
}

type SupabaseQueryClient = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => Promise<{ data?: { counter?: number } | null; error?: { message?: string } | null }>;
      };
      ilike: (column: string, value: string) => {
        order: (column: string, options?: { ascending?: boolean }) => {
          limit: (count: number) => Promise<{ data?: Array<{ registration_number?: string | null }> | null; error?: { message?: string } | null }>;
        };
      };
    };
    upsert: (payload: Record<string, string | number>, options?: { onConflict?: string }) => Promise<{ error?: { message?: string } | null }>;
  };
};

export async function getNextBeneficiaryIdentifier(
  supabaseClient: SupabaseQueryClient,
  region?: string | null,
) {
  const regionCode = normalizeRegionCode(region);
  const table = supabaseClient.from("beneficiary_identifier_counters");

  const { data: counterRow, error: counterError } = await table
    .select("counter")
    .eq("region_code", regionCode)
    .maybeSingle();

  let nextSequence = 1;

  if (!counterError && counterRow && typeof counterRow.counter === "number") {
    nextSequence = counterRow.counter + 1;
  } else {
    const { data: recentRows, error: recentError } = await supabaseClient
      .from("beneficiaries")
      .select("registration_number")
      .ilike("registration_number", `AG-B-${regionCode}-%`)
      .order("created_at", { ascending: false })
      .limit(50);

    if (!recentError && Array.isArray(recentRows)) {
      const highest = recentRows.reduce((currentMax, row) => {
        const registrationNumber = row?.registration_number ?? "";
        const match = registrationNumber.match(/AG-B-[A-Z]+-(\d{6})$/);
        if (!match) return currentMax;
        const sequence = Number.parseInt(match[1], 10);
        return Number.isFinite(sequence) && sequence > currentMax ? sequence : currentMax;
      }, 0);

      if (highest > 0) {
        nextSequence = highest + 1;
      }
    }
  }

  const upsertPayload = {
    region_code: regionCode,
    counter: nextSequence,
    updated_at: new Date().toISOString(),
  };

  await supabaseClient
    .from("beneficiary_identifier_counters")
    .upsert(upsertPayload, { onConflict: "region_code" });

  return generateBeneficiaryIdentifier(regionCode, nextSequence);
}

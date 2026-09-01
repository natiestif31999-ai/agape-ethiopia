import { normalizeRegionCode as normalizeRegionCodeFromMap } from "@/lib/regionCodes";

export const PUBLIC_BENEFICIARY_REQUIRED_FIELDS = [
  "first_name",
  "last_name",
  "gender",
  "phone",
  "region",
  "kebele",
] as const;

export const PUBLIC_REGISTRATION_STATUS = "Pending Review";

function normalizeValue(value: string | undefined | null) {
  return value?.trim() ?? "";
}

export function normalizePhoneForComparison(value: string | undefined | null): string {
  const raw = normalizeValue(value);
  if (!raw) {
    return "";
  }

  let normalized = raw.replace(/\s+/g, "");
  normalized = normalized.replace(/[()\-+]/g, "");
  normalized = normalized.replace(/^00/, "+");
  normalized = normalized.replace(/[^\d+]/g, "");

  if (!normalized) {
    return "";
  }

  if (normalized.startsWith("+")) {
    return `+${normalized.slice(1).replace(/\D/g, "")}`;
  }

  let digits = normalized.replace(/\D/g, "");
  if (digits.length > 0 && digits.startsWith("251")) {
    digits = digits.slice(3);
  }
  if (digits.length > 0 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  return digits ? `+${digits}` : "";
}

export function normalizeEthiopianPhone(value: string | undefined | null): string {
  return normalizePhoneForComparison(value);
}

export function isValidEthiopianPhone(value: string | undefined | null): boolean {
  return normalizePhoneForComparison(value).length > 0;
}

export function normalizeRegionCode(value: string | undefined | null) {
  return normalizeRegionCodeFromMap(value);
}

export function buildBeneficiaryId(region: string | undefined | null) {
  const code = normalizeRegionCode(region); 
  return `AG-B-${code}-`;
}

export function validatePublicBeneficiaryFields(values: Record<string, string | undefined | null>) {
  const errors: string[] = [];

  for (const field of PUBLIC_BENEFICIARY_REQUIRED_FIELDS) {
    if (!normalizeValue(values[field])) {
      const label = field.replace(/_/g, " ");
      errors.push(`Please enter your ${label}.`);
    }
  }

  if (!isValidEthiopianPhone(values.phone)) {
    errors.push("Please enter a valid phone number.");
  }

  const gender = normalizeValue(values.gender).toLowerCase();
  if (gender && !["male", "female"].includes(gender)) {
    errors.push("Please select a valid gender.");
  }

  return errors;
}

export function buildPublicBeneficiaryPayload(values: Record<string, string | undefined | null>, photoUrl: string | null = null) {
  const normalized = {
    registration_date: normalizeValue(values.registration_date),
    first_name: normalizeValue(values.first_name),
    middle_name: normalizeValue(values.middle_name),
    last_name: normalizeValue(values.last_name),
    date_of_birth: normalizeValue(values.date_of_birth),
    gender: normalizeValue(values.gender).toLowerCase(),
    phone: normalizePhoneForComparison(values.phone),
    region: normalizeValue(values.region),
    kifle_ketema: normalizeValue(values.kifle_ketema),
    kebele: normalizeValue(values.kebele),
    house_number: normalizeValue(values.house_number),
    notes: normalizeValue(values.notes),
    disability_type: normalizeValue(values.disability_type),
    referral_source: normalizeValue(values.referral_source),
  };

  return {
    registration_date: normalized.registration_date || new Date().toISOString().slice(0, 10),
    registration_number: null,
    region_code: normalizeRegionCode(values.region),
    first_name: normalized.first_name,
    middle_name: normalized.middle_name || null,
    last_name: normalized.last_name,
    date_of_birth: normalized.date_of_birth || null,
    gender: normalized.gender || "",
    phone: normalized.phone,
    phone_normalized: normalized.phone,
    region: normalized.region,
    kifle_ketema: normalized.kifle_ketema || null,
    kebele: normalized.kebele,
    house_number: normalized.house_number || null,
    notes: normalized.notes || null,
    photo_url: photoUrl,
    disability_type: normalized.disability_type || null,
    referral_source: normalized.referral_source || null,
    status: PUBLIC_REGISTRATION_STATUS,
  };
}

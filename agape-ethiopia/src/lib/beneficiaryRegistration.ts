import { normalizeRegionCode as normalizeRegionCodeFromMap } from "@/lib/regionCodes";

export const WHEELCHAIR_SIZE_OPTIONS = ["XL", "Large", "Middle", "Small"] as const;
export const SPECIFIC_APPARATUS_OPTIONS = ["Wheelchair", "Walker"] as const;

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

function normalizeChoiceValue<T extends string>(value: string | undefined | null, choices: readonly T[]): T | "" {
  const candidate = normalizeValue(value);
  if (!candidate) {
    return "";
  }

  const exactMatch = choices.find((choice) => choice.toLowerCase() === candidate.toLowerCase());
  if (exactMatch) {
    return exactMatch;
  }

  const mapped = {
    xl: "XL",
    large: "Large",
    middle: "Middle",
    small: "Small",
    wheelchair: "Wheelchair",
    walker: "Walker",
  } as const;

  if (candidate.toLowerCase() in mapped) {
    return mapped[candidate.toLowerCase() as keyof typeof mapped] as T;
  }

  return "";
}

export function normalizePhoneForComparison(value: string | undefined | null): string {
  const raw = normalizeValue(value);
  if (!raw) {
    return "";
  }

  let normalized = raw.replace(/\s+/g, "");
  normalized = normalized.replace(/[()\-_]/g, "");
  normalized = normalized.replace(/^00/, "+");
  normalized = normalized.replace(/[^\d+]/g, "");

  if (!normalized || normalized === "+") {
    return "";
  }

  if (normalized.startsWith("+")) {
    return `+${normalized.slice(1).replace(/\D/g, "")}`;
  }

  const digits = normalized.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length > 1) {
    return `+251${digits.slice(1)}`;
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

  const diagnosis = normalizeValue(values.disability_type) || normalizeValue(values.diagnosis);
  if (diagnosis && diagnosis.length > 250) {
    errors.push("Diagnosis must be shorter than 250 characters.");
  }

  const wheelchairSize = normalizeChoiceValue(values.wheelchair_size, WHEELCHAIR_SIZE_OPTIONS);
  if (values.wheelchair_size && !wheelchairSize) {
    errors.push("Please select a valid wheelchair size.");
  }

  const apparatusNeed = normalizeChoiceValue(values.specific_apparatus_need, SPECIFIC_APPARATUS_OPTIONS);
  if (values.specific_apparatus_need && !apparatusNeed) {
    errors.push("Please select a valid apparatus need.");
  }

  return errors;
}

export function buildPublicBeneficiaryPayload(values: Record<string, string | undefined | null>, photoUrl: string | null = null) {
  const diagnosis = normalizeValue(values.disability_type) || normalizeValue(values.diagnosis);
  const wheelchairSize = normalizeChoiceValue(values.wheelchair_size, WHEELCHAIR_SIZE_OPTIONS);
  const apparatusNeed = normalizeChoiceValue(values.specific_apparatus_need, SPECIFIC_APPARATUS_OPTIONS);

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
    disability_type: diagnosis,
    referral_source: normalizeValue(values.referral_source),
    wheelchair_size: wheelchairSize,
    specific_apparatus_need: apparatusNeed,
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
    region: normalized.region,
    kifle_ketema: normalized.kifle_ketema || null,
    kebele: normalized.kebele,
    house_number: normalized.house_number || null,
    notes: normalized.notes || null,
    photo_url: photoUrl,
    disability_type: normalized.disability_type || null,
    referral_source: normalized.referral_source || null,
    wheelchair_size: normalized.wheelchair_size || null,
    specific_apparatus_need: normalized.specific_apparatus_need || null,
    status: PUBLIC_REGISTRATION_STATUS,
  };
}

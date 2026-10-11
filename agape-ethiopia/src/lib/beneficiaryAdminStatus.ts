export type BeneficiaryStatusFilter = "all" | "pending" | "approved" | "rejected";

const STATUS_FILTERS: Record<Exclude<BeneficiaryStatusFilter, "all">, string[]> = {
  pending: ["Pending Review", "pending", "registered"],
  approved: ["Approved", "approved"],
  rejected: ["Rejected", "rejected"],
};

export function beneficiaryStatusesForFilter(filter: BeneficiaryStatusFilter) {
  return filter === "all" ? null : STATUS_FILTERS[filter];
}

export function countBeneficiariesByStatus<T extends { status: string }>(beneficiaries: T[]) {
  const normalized = beneficiaries.map((beneficiary) => beneficiary.status.toLowerCase());
  return {
    approved: normalized.filter((status) => status === "approved").length,
    pending: normalized.filter((status) => ["pending review", "pending", "registered"].includes(status)).length,
    rejected: normalized.filter((status) => status === "rejected").length,
  };
}
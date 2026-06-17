export type Role = "Admin" | "Staff";

export const roles = {
  Admin: "Admin" as const,
  Staff: "Staff" as const,
};

export const permissions: {
  viewBeneficiaries: Role[];
  manageBeneficiaries: Role[];
  manageUsers: Role[];
  manageSystem: Role[];
} = {
  viewBeneficiaries: [roles.Admin, roles.Staff],
  manageBeneficiaries: [roles.Admin, roles.Staff],
  manageUsers: [roles.Admin],
  manageSystem: [roles.Admin],
};

export function isAdmin(role?: string | null): boolean {
  return role === roles.Admin;
}

export function isStaff(role?: string | null): boolean {
  return role === roles.Staff || role === roles.Admin;
}

export function hasPermission(role: string | undefined | null, permission: keyof typeof permissions): boolean {
  if (!role) return false;
  return permissions[permission].includes(role as Role);
}

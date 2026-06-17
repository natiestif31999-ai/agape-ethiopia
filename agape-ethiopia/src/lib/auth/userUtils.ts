import { isAdmin as checkAdmin, isStaff as checkStaff, hasPermission as checkPermission } from "@/lib/auth/permissions";

export type AppRole = "Admin" | "Staff" | null;

export function isAdmin(role: AppRole): boolean {
  return checkAdmin(role);
}

export function isStaff(role: AppRole): boolean {
  return checkStaff(role);
}

export function hasPermission(role: AppRole, permission: keyof typeof import("@/lib/auth/permissions").permissions): boolean {
  return checkPermission(role, permission);
}

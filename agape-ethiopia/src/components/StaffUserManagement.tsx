/**
 * AGAPE MOBILITY ETHIOPIA
 * Staff User Management Component
 * 
 * Allows admins to manage staff user accounts including:
 * - View all staff members
 * - Create new staff accounts
 * - Disable/enable staff access
 * - Change staff roles
 * - Reset passwords
 * - View staff activity logs
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { getSupabaseClient } from "@/lib/supabase/client";

interface StaffMember {
  id: string;
  email: string;
  role: "Admin" | "Staff";
  is_disabled: boolean;
  password_change_required: boolean;
  created_at: string;
  updated_at: string;
}

export default function StaffUserManagement() {
  const { t } = useLanguage();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [actionType, setActionType] = useState<"disable" | "enable" | "role-change" | "reset-password" | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"Admin" | "Staff">("Staff");
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "Admin" | "Staff">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "disabled">("all");

  // Load staff members
  const loadStaffMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const client = getSupabaseClient();
      if (!client) {
        setError(t("errorLoadingData"));
        return;
      }

      // Use an API endpoint to get staff data securely
      const response = await fetch("/api/admin/staff");
      if (!response.ok) {
        setError(t("errorLoadingData"));
        return;
      }

      const data = await response.json();
      setStaffMembers(data);
    } catch (err) {
      setError(t("errorLoadingData"));
      console.error("Error loading staff:", err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadStaffMembers();
  }, [loadStaffMembers]);

  // Filter staff members
  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch = searchQuery === "" || staff.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || staff.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || (statusFilter === "active" && !staff.is_disabled) || (statusFilter === "disabled" && staff.is_disabled);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle create new staff
  const handleCreateStaff = async () => {
    try {
      if (!newEmail || !newPassword) {
        setError("Email and password are required");
        return;
      }

      setSubmitting(true);
      const response = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail,
          password: newPassword,
          role: newRole,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.error || "Failed to create staff");
        return;
      }

      await loadStaffMembers();
      setShowCreateModal(false);
      setNewEmail("");
      setNewPassword("");
      setNewRole("Staff");
    } catch (err) {
      setError("Failed to create staff account");
      console.error("Error creating staff:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle staff actions
  const handleStaffAction = async () => {
    try {
      if (!selectedStaff || !actionType) return;

      setSubmitting(true);
      const response = await fetch(`/api/admin/staff/${selectedStaff.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionType,
          role: newRole,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.error || "Failed to update staff");
        return;
      }

      await loadStaffMembers();
      setShowActionModal(false);
      setSelectedStaff(null);
      setActionType(null);
    } catch (err) {
      setError("Failed to update staff");
      console.error("Error updating staff:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Staff Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage staff user accounts and permissions
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Create Staff Account
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{staffMembers.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Staff</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {staffMembers.filter((s) => !s.is_disabled).length}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">Active</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {staffMembers.filter((s) => s.is_disabled).length}
          </div>
          <div className="text-sm text-red-600 dark:text-red-400">Disabled</div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search Email
          </label>
          <input
            type="text"
            placeholder="Search staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Role
          </label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {filteredStaff.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">No staff members found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    {t("role")}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    {t("status")}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {staff.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {staff.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          staff.is_disabled
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                      >
                        {staff.is_disabled ? "Disabled" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedStaff(staff);
                            setActionType(staff.is_disabled ? "enable" : "disable");
                            setShowActionModal(true);
                          }}
                          className={`text-sm font-medium ${
                            staff.is_disabled
                              ? "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              : "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          }`}
                        >
                          {staff.is_disabled ? "Enable" : "Disable"}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStaff(staff);
                            setNewRole(staff.role === "Admin" ? "Staff" : "Admin");
                            setActionType("role-change");
                            setShowActionModal(true);
                          }}
                          className="text-sm font-medium text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Change Role
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStaff(staff);
                            setActionType("reset-password");
                            setShowActionModal(true);
                          }}
                          className="text-sm font-medium text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                        >
                          Reset Password
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Staff Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="border-b border-gray-200 dark:border-gray-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Create Staff Account
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("role")}
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as "Admin" | "Staff")}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 px-6 py-4 flex justify-between gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                disabled={submitting}
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleCreateStaff}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="border-b border-gray-200 dark:border-gray-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {actionType === "disable"
                  ? "Disable Staff"
                  : actionType === "enable"
                    ? "Enable Staff"
                    : actionType === "role-change"
                      ? "Change Role"
                      : "Reset Password"}
              </h2>
              <button
                onClick={() => setShowActionModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                {actionType === "disable"
                  ? `Are you sure you want to disable ${selectedStaff.email}? They will not be able to access the system.`
                  : actionType === "enable"
                    ? `Are you sure you want to enable ${selectedStaff.email}? They will regain access to the system.`
                    : actionType === "role-change"
                      ? `Change ${selectedStaff.email}'s role to ${newRole}?`
                      : `Reset ${selectedStaff.email}'s password? They will need to set a new password on next login.`}
              </p>

              {actionType === "role-change" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Role
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as "Admin" | "Staff")}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Staff">Staff</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              )}
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 px-6 py-4 flex justify-between gap-3">
              <button
                onClick={() => setShowActionModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                disabled={submitting}
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleStaffAction}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * AGAPE MOBILITY ETHIOPIA
 * Registration Management Component
 * 
 * Allows staff to review and approve/reject beneficiary registrations
 * with filtering, search, and detailed review capabilities
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { getSupabaseClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Registration {
  id: string;
  registration_number: string;
  first_name: string;
  last_name: string;
  phone: string;
  region: string;
  status: string;
  created_at: string;
  date_of_birth?: string;
  disability_type?: string;
  referral_source?: string;
  notes?: string;
}

interface RegistrationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

type StatusFilter = "all" | "pending" | "approved" | "rejected";

export default function RegistrationManagement() {
  const { t } = useLanguage();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<RegistrationStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [approvalReason, setApprovalReason] = useState("");
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load registrations data
  const loadRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const client = getSupabaseClient();
      if (!client) {
        setError(t("errorLoadingData"));
        return;
      }

      // Get all registrations with stats
      const { data, error: queryError } = await client
        .from("beneficiaries")
        .select("*")
        .order("created_at", { ascending: false });

      if (queryError) {
        setError(t("errorLoadingData"));
        return;
      }

      // Calculate stats
      const allData = data || [];
      const stats: RegistrationStats = {
        total: allData.length,
        pending: allData.filter((r: Registration) => r.status === "Pending Review").length,
        approved: allData.filter((r: Registration) => r.status === "Approved").length,
        rejected: allData.filter((r: Registration) => r.status === "Rejected").length,
      };

      setStats(stats);
      setRegistrations(allData as Registration[]);
    } catch (err) {
      setError(t("errorLoadingData"));
      console.error("Error loading registrations:", err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  // Filter registrations
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesStatus = statusFilter === "all" || reg.status === getStatusLabel(statusFilter);
    const matchesSearch =
      searchQuery === "" ||
      reg.registration_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${reg.first_name} ${reg.last_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      reg.phone.includes(searchQuery);
    const matchesRegion = regionFilter === "all" || reg.region === regionFilter;

    return matchesStatus && matchesSearch && matchesRegion;
  });

  // Get unique regions for filter
  const regions = Array.from(new Set(registrations.map((r) => r.region).filter(Boolean)));

  // Convert status filter to label
  function getStatusLabel(status: StatusFilter): string {
    const labels: Record<StatusFilter, string> = {
      all: "all",
      pending: "Pending Review",
      approved: "Approved",
      rejected: "Rejected",
    };
    return labels[status];
  }

  // Handle approval/rejection
  const handleStatusUpdate = async (
    registrationId: string,
    newStatus: "Approved" | "Rejected"
  ) => {
    try {
      setSubmitting(true);
      const client = getSupabaseClient();
      if (!client) {
        setError(t("errorLoadingData"));
        return;
      }

      // Update registration status
      const { error: updateError } = await client
        .from("beneficiaries")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", registrationId);

      if (updateError) {
        setError(t("errorLoadingData"));
        return;
      }

      // Log audit via API
      try {
        await fetch("/api/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: newStatus === "Approved" ? "registration_approved" : "registration_rejected",
            entityType: "beneficiary",
            entityId: registrationId,
            changes: { status: newStatus },
            metadata: { reason: approvalReason },
          }),
        });
      } catch (auditErr) {
        console.error("Error logging audit:", auditErr);
        // Continue even if audit logging fails
      }

      // Refresh data
      await loadRegistrations();
      setShowDetailsModal(false);
      setApprovalReason("");
      setApprovalAction(null);
      setSelectedRegistration(null);
    } catch (err) {
      setError(t("errorLoadingData"));
      console.error("Error updating registration:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetails = (registration: Registration) => {
    setSelectedRegistration(registration);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedRegistration(null);
    setApprovalReason("");
    setApprovalAction(null);
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("registration")}s
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Review and approve beneficiary registrations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats.pending}
          </div>
          <div className="text-sm text-yellow-600 dark:text-yellow-400">{t("statusPending")}</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.approved}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">{t("statusApproved")}</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</div>
          <div className="text-sm text-red-600 dark:text-red-400">{t("statusRejected")}</div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("approvalStatus")}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Region Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("region")}
            </label>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by registration number, name, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {filteredRegistrations.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">{t("noBeneficiariesFound")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    {t("registrationNumber")}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    {t("phone")}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    {t("region")}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    {t("approvalStatus")}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                      {reg.registration_number}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {reg.first_name} {reg.last_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {reg.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {reg.region}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          reg.status === "Approved"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : reg.status === "Rejected"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleViewDetails(reg)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        {t("view")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Registration Details
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    {t("registrationNumber")}
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedRegistration.registration_number}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    {t("approvalStatus")}
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedRegistration.status}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Name
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedRegistration.first_name} {selectedRegistration.last_name}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    {t("phone")}
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedRegistration.phone}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    {t("region")}
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedRegistration.region}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    {t("disabilityType")}
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedRegistration.disability_type || "N/A"}
                  </p>
                </div>
              </div>

              {selectedRegistration.notes && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    {t("notes")}
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedRegistration.notes}</p>
                </div>
              )}

              {/* Approval Reason */}
              {(approvalAction === "approve" || approvalAction === "reject") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {approvalAction === "approve" ? "Approval" : "Rejection"} Reason
                  </label>
                  <textarea
                    value={approvalReason}
                    onChange={(e) => setApprovalReason(e.target.value)}
                    placeholder="Enter reason for this decision..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    rows={3}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 px-6 py-4 flex justify-between gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                {t("cancel")}
              </button>

              {selectedRegistration.status === "Pending Review" ? (
                <div className="flex gap-2">
                  {!approvalAction ? (
                    <>
                      <button
                        onClick={() => setApprovalAction("reject")}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                        disabled={submitting}
                      >
                        {t("reject")}
                      </button>
                      <button
                        onClick={() => setApprovalAction("approve")}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        disabled={submitting}
                      >
                        {t("approve")}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setApprovalAction(null)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                        disabled={submitting}
                      >
                        Back
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            selectedRegistration.id,
                            approvalAction === "approve" ? "Approved" : "Rejected"
                          )
                        }
                        className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 ${
                          approvalAction === "approve"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                        disabled={submitting || !approvalReason.trim()}
                      >
                        {submitting
                          ? "Processing..."
                          : approvalAction === "approve"
                            ? "Confirm Approval"
                            : "Confirm Rejection"}
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href={`/beneficiaries/${selectedRegistration.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  View Full Profile
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * AGAPE MOBILITY ETHIOPIA
 * Beneficiary Profile Details Component
 * 
 * Displays comprehensive beneficiary information including registration,
 * assessments, equipment distributions, and approval history.
 * Allows staff to edit permitted fields and track changes.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { getSupabaseClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Beneficiary {
  id: string;
  registration_number: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: string;
  phone: string;
  region: string;
  kifle_ketema?: string;
  kebele?: string;
  house_number?: string;
  disability_type?: string;
  referral_source?: string;
  photo_url?: string;
  notes?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Assessment {
  id: string;
  assessment_date: string;
  measurements: string;
  wheelchair_fit: string;
  recommendations: string;
  notes?: string;
}

interface EquipmentDistribution {
  id: string;
  equipment_type: string;
  equipment_size?: string;
  distribution_date: string;
  distribution_location?: string;
  received_by?: string;
  signature_confirmed: boolean;
  notes?: string;
}

interface BeneficiaryProfileProps {
  beneficiaryId: string;
}

export default function BeneficiaryProfileDetails({ beneficiaryId }: BeneficiaryProfileProps) {
  const { t } = useLanguage();
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [distributions, setDistributions] = useState<EquipmentDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "assessments" | "distributions">(
    "profile"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Beneficiary> | null>(null);
  const [saving, setSaving] = useState(false);

  // Load beneficiary data
  const loadBeneficiaryData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const client = getSupabaseClient();
      if (!client) {
        setError(t("errorLoadingData"));
        return;
      }

      // Load beneficiary
      const { data: benData, error: benError } = await client
        .from("beneficiaries")
        .select("*")
        .eq("id", beneficiaryId)
        .single();

      if (benError || !benData) {
        setError(t("errorLoadingData"));
        return;
      }

      setBeneficiary(benData);
      setEditData(benData);

      // Load assessments
      const { data: assData } = await client
        .from("assessments")
        .select("*")
        .eq("beneficiary_id", beneficiaryId)
        .order("assessment_date", { ascending: false });

      if (assData) {
        setAssessments(assData);
      }

      // Load distributions
      const { data: distData } = await client
        .from("equipment_distributions")
        .select("*")
        .eq("beneficiary_id", beneficiaryId)
        .order("distribution_date", { ascending: false });

      if (distData) {
        setDistributions(distData);
      }
    } catch (err) {
      setError(t("errorLoadingData"));
      console.error("Error loading beneficiary:", err);
    } finally {
      setLoading(false);
    }
  }, [beneficiaryId, t]);

  useEffect(() => {
    loadBeneficiaryData();
  }, [loadBeneficiaryData]);

  // Handle save changes
  const handleSaveChanges = async () => {
    try {
      if (!editData || !beneficiary) return;

      setSaving(true);
      const client = getSupabaseClient();
      if (!client) {
        setError(t("errorLoadingData"));
        return;
      }

      const { error: updateError } = await client
        .from("beneficiaries")
        .update({
          ...editData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", beneficiaryId);

      if (updateError) {
        setError(t("errorLoadingData"));
        return;
      }

      // Log audit
      try {
        await fetch("/api/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "beneficiary_updated",
            entityType: "beneficiary",
            entityId: beneficiaryId,
            changes: editData,
          }),
        });
      } catch (err) {
        console.error("Error logging audit:", err);
      }

      setBeneficiary(editData as Beneficiary);
      setIsEditing(false);
    } catch (err) {
      setError(t("errorLoadingData"));
      console.error("Error saving changes:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !beneficiary) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <p className="text-red-800 dark:text-red-300">{error || t("errorLoadingData")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {beneficiary.first_name} {beneficiary.last_name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t("registrationNumber")}: {beneficiary.registration_number}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/staff/registrations"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {t("back")}
          </Link>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t("edit")}
            </button>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex gap-4 items-center">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            beneficiary.status === "Approved"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : beneficiary.status === "Rejected"
                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
          }`}
        >
          {beneficiary.status}
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Registered: {new Date(beneficiary.created_at).toLocaleDateString()}
        </span>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-8">
          {(["profile", "assessments", "distributions"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {tab === "profile"
                ? "Profile"
                : tab === "assessments"
                  ? "Assessments"
                  : "Distributions"}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData?.first_name || ""}
                    onChange={(e) =>
                      setEditData({ ...editData!, first_name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{beneficiary.first_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData?.last_name || ""}
                    onChange={(e) => setEditData({ ...editData!, last_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{beneficiary.last_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editData?.date_of_birth || ""}
                    onChange={(e) =>
                      setEditData({ ...editData!, date_of_birth: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">
                    {beneficiary.date_of_birth || "N/A"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gender
                </label>
                {isEditing ? (
                  <select
                    value={editData?.gender || ""}
                    onChange={(e) => setEditData({ ...editData!, gender: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-gray-900 dark:text-white">{beneficiary.gender || "N/A"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData?.phone || ""}
                    onChange={(e) => setEditData({ ...editData!, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{beneficiary.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Disability Type
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData?.disability_type || ""}
                    onChange={(e) =>
                      setEditData({ ...editData!, disability_type: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">
                    {beneficiary.disability_type || "N/A"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Region
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData?.region || ""}
                    onChange={(e) => setEditData({ ...editData!, region: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{beneficiary.region}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kebele
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData?.kebele || ""}
                    onChange={(e) => setEditData({ ...editData!, kebele: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{beneficiary.kebele || "N/A"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  House Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData?.house_number || ""}
                    onChange={(e) => setEditData({ ...editData!, house_number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">
                    {beneficiary.house_number || "N/A"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Referral Source
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData?.referral_source || ""}
                    onChange={(e) =>
                      setEditData({ ...editData!, referral_source: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">
                    {beneficiary.referral_source || "N/A"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            {isEditing ? (
              <textarea
                value={editData?.notes || ""}
                onChange={(e) => setEditData({ ...editData!, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-900 dark:text-white">{beneficiary.notes || "No notes"}</p>
            )}
          </div>

          {/* Save/Cancel Buttons */}
          {isEditing && (
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditData(beneficiary);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                disabled={saving}
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={saving}
              >
                {saving ? "Saving..." : t("saveChanges")}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Assessments Tab */}
      {activeTab === "assessments" && (
        <div className="space-y-4">
          {assessments.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">No assessments recorded</p>
            </div>
          ) : (
            assessments.map((assessment) => (
              <div
                key={assessment.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Assessment - {new Date(assessment.assessment_date).toLocaleDateString()}
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {assessment.measurements && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Measurements
                      </label>
                      <p className="text-gray-900 dark:text-white">{assessment.measurements}</p>
                    </div>
                  )}
                  {assessment.wheelchair_fit && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Fit
                      </label>
                      <p className="text-gray-900 dark:text-white">{assessment.wheelchair_fit}</p>
                    </div>
                  )}
                </div>
                {assessment.recommendations && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <label className="text-sm font-medium text-blue-900 dark:text-blue-300 block mb-2">
                      Recommendations
                    </label>
                    <p className="text-blue-800 dark:text-blue-300">{assessment.recommendations}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Distributions Tab */}
      {activeTab === "distributions" && (
        <div className="space-y-4">
          {distributions.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">No distributions recorded</p>
            </div>
          ) : (
            distributions.map((distribution) => (
              <div
                key={distribution.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {distribution.equipment_type} -{" "}
                    {new Date(distribution.distribution_date).toLocaleDateString()}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      distribution.signature_confirmed
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {distribution.signature_confirmed ? "Confirmed" : "Pending"}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {distribution.equipment_size && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Size
                      </label>
                      <p className="text-gray-900 dark:text-white">{distribution.equipment_size}</p>
                    </div>
                  )}
                  {distribution.received_by && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Received By
                      </label>
                      <p className="text-gray-900 dark:text-white">{distribution.received_by}</p>
                    </div>
                  )}
                  {distribution.distribution_location && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Location
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {distribution.distribution_location}
                      </p>
                    </div>
                  )}
                </div>
                {distribution.notes && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                      Notes
                    </label>
                    <p className="text-gray-900 dark:text-white">{distribution.notes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Beneficiary Approval Workflow Component
 * Allows Staff/Admin to approve, reject, or hold beneficiary registrations
 */

"use client";

import { useState } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface ApprovalWidgetProps {
  beneficiaryId: string;
  currentStatus: string;
  onStatusChange?: (newStatus: string) => void;
}

export default function BeneficiaryApprovalWidget({
  beneficiaryId,
  currentStatus,
  onStatusChange,
}: ApprovalWidgetProps) {
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showApprovalNotes, setShowApprovalNotes] = useState(false);
  const [notes, setNotes] = useState("");

  const handleApprove = async () => {
    await updateStatus("Approved", "Beneficiary approved");
  };

  const handleReject = async () => {
    if (!notes.trim()) {
      setError("Rejection requires notes explaining the reason");
      return;
    }
    await updateStatus("Rejected", notes);
  };

  const handleHold = async () => {
    if (!notes.trim()) {
      setError("Hold requires notes explaining what is needed");
      return;
    }
    await updateStatus("On Hold", notes);
  };

  const updateStatus = async (newStatus: string, statusNotes: string) => {
    try {
      setIsProcessing(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`/api/beneficiaries/${beneficiaryId}/approval`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          notes: statusNotes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update status");
      }

      setSuccess(`Beneficiary status updated to: ${newStatus}`);
      setShowApprovalNotes(false);
      setNotes("");

      // Trigger parent component update
      if (onStatusChange) {
        onStatusChange(newStatus);
      }

      // Refresh page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const isPendingReview = currentStatus === "Pending Review";
  const canApprove = isPendingReview;
  const isApproved = currentStatus === "Approved";

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">
        {t("approvalWorkflow") || "Approval Status"}
      </h3>

      {/* Current Status */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-sm font-medium text-slate-700">Current Status:</span>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
            isApproved
              ? "bg-green-100 text-green-800"
              : currentStatus === "Rejected"
                ? "bg-red-100 text-red-800"
                : currentStatus === "On Hold"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {currentStatus}
        </span>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200">
          {success}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {canApprove && (
          <>
            <button
              onClick={handleApprove}
              disabled={isProcessing}
              className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : "Approve Beneficiary"}
            </button>

            <button
              onClick={() => setShowApprovalNotes(!showApprovalNotes)}
              className="w-full rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
            >
              {showApprovalNotes ? "Cancel" : "Place on Hold"}
            </button>

            <button
              onClick={() => setShowApprovalNotes(!showApprovalNotes)}
              className="w-full rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-900 transition hover:bg-red-100"
            >
              {showApprovalNotes && notes.includes("reject") ? "Cancel" : "Reject Registration"}
            </button>
          </>
        )}

        {isApproved && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200">
            ✓ This beneficiary has been approved
          </div>
        )}
      </div>

      {/* Notes Section */}
      {showApprovalNotes && canApprove && (
        <div className="mt-4 rounded-lg bg-white p-4 border border-slate-200">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t("notes") || "Notes"}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter notes about this decision..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            rows={3}
          />

          <div className="mt-3 flex gap-2">
            <button
              onClick={handleHold}
              disabled={isProcessing || !notes.trim()}
              className="flex-1 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : "Place on Hold"}
            </button>

            <button
              onClick={handleReject}
              disabled={isProcessing || !notes.trim()}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : "Reject"}
            </button>
          </div>
        </div>
      )}

      {/* Info Text */}
      <div className="mt-4 rounded-lg bg-blue-50 p-3 text-xs text-blue-700 border border-blue-200">
        <p className="font-medium">Available Actions:</p>
        <ul className="mt-1 list-inside list-disc space-y-1 text-xs">
          <li>
            <strong>Approve:</strong> Move beneficiary to approved status
          </li>
          <li>
            <strong>Hold:</strong> Temporarily hold for additional information
          </li>
          <li>
            <strong>Reject:</strong> Reject the registration (provide reason)
          </li>
        </ul>
      </div>
    </div>
  );
}

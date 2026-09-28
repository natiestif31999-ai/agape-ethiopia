"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type BeneficiaryReview = {
  id: string;
  registration_number: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  region: string | null;
  status: string | null;
  created_at: string | null;
  photo_url: string | null;
};

type AssessmentReview = {
  id: string;
  beneficiary_id: string | null;
  assessor_name: string | null;
  assessment_date: string | null;
  review_status: string;
  review_ready?: boolean;
  notes: string | null;
  recommendations: string | null;
  created_at: string | null;
};

type RequestReview = {
  id: string;
  beneficiary_id: string | null;
  beneficiary_name: string | null;
  item_needed: string | null;
  need_details: string | null;
  status: string | null;
  created_at: string | null;
};

type AgreementReview = {
  id: string;
  organization_name: string;
  organization_type: string | null;
  contact_person: string;
  email: string;
  status: string;
  submitted_at: string | null;
  agreement_file_name: string | null;
  agreement_file_path: string | null;
  agreement_file_url: string | null;
};

type ReviewQueueData = {
  beneficiaries: BeneficiaryReview[];
  assessments: AssessmentReview[];
  requests: RequestReview[];
  agreements: AgreementReview[];
  assessmentReviewReady: boolean;
};

type ReviewItem = {
  id: string;
  type: "beneficiary" | "assessment" | "request" | "agreement";
  title: string;
  submitter: string;
  status: string;
  submittedAt: string | null;
  details: string[];
  canReview?: boolean;
  resourceHref?: string;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
  agreementHasPath?: boolean;
};

const emptyQueue: ReviewQueueData = { beneficiaries: [], assessments: [], requests: [], agreements: [], assessmentReviewReady: true };

function isPending(status: string) {
  return ["pending", "pending review", "registered", "under review", "on hold", "review setup required"].includes(status.trim().toLowerCase());
}

function statusTone(status: string) {
  const value = status.toLowerCase();
  if (value === "approved" || value === "delivered" || value === "matched") return "bg-emerald-100 text-emerald-800";
  if (value === "rejected") return "bg-rose-100 text-rose-800";
  return "bg-amber-100 text-amber-900";
}

export default function SubmissionReviewQueue() {
  const [queue, setQueue] = useState<ReviewQueueData>(emptyQueue);
  const [filter, setFilter] = useState("pending");
  const [categoryFilter, setCategoryFilter] = useState<"all" | ReviewItem["type"]>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name" | "status">("newest");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadQueue = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/review-queue", { cache: "no-store" });
      const result = await response.json() as Partial<ReviewQueueData> & { error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to load pending submissions.");
      setQueue({
        beneficiaries: result.beneficiaries ?? [],
        assessments: result.assessments ?? [],
        requests: result.requests ?? [],
        agreements: result.agreements ?? [],
        assessmentReviewReady: result.assessmentReviewReady ?? true,
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load pending submissions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadQueue();
  }, [loadQueue]);

  const items = useMemo<ReviewItem[]>(() => {
    const beneficiaries = queue.beneficiaries.map((record) => ({
      id: record.id,
      type: "beneficiary" as const,
      title: [record.first_name, record.last_name].filter(Boolean).join(" ") || record.registration_number || "Beneficiary registration",
      submitter: record.registration_number || "Public registration",
      status: record.status || "Pending Review",
      submittedAt: record.created_at,
      details: [record.phone, record.region].filter((value): value is string => Boolean(value)),
      resourceHref: `/beneficiaries/${encodeURIComponent(record.id)}`,
      attachmentUrl: record.photo_url,
      attachmentName: record.photo_url ? "View submitted photo" : undefined,
    }));
    const assessments = queue.assessments.map((record) => ({
      id: record.id,
      type: "assessment" as const,
      title: "Beneficiary equipment assessment",
      submitter: record.assessor_name || `Beneficiary ${record.beneficiary_id ?? "unknown"}`,
      status: record.review_status,
      canReview: record.review_ready !== false,
      submittedAt: record.created_at || record.assessment_date,
      details: [record.assessment_date ? `Assessment date: ${record.assessment_date}` : "", record.notes, record.recommendations].filter(Boolean) as string[],
      resourceHref: record.beneficiary_id ? `/beneficiaries/${encodeURIComponent(record.beneficiary_id)}` : undefined,
    }));
    const requests = queue.requests.map((record) => ({
      id: record.id,
      type: "request" as const,
      title: record.item_needed || "Equipment request",
      submitter: record.beneficiary_name || (record.beneficiary_id ? `Beneficiary ${record.beneficiary_id}` : "Unspecified beneficiary"),
      status: record.status || "pending",
      submittedAt: record.created_at,
      details: [record.need_details].filter((value): value is string => Boolean(value)),
      resourceHref: record.beneficiary_id ? `/beneficiaries/${encodeURIComponent(record.beneficiary_id)}` : undefined,
    }));
    const agreements = queue.agreements.map((record) => ({
      id: record.id,
      type: "agreement" as const,
      title: record.organization_name,
      submitter: record.contact_person,
      status: record.status,
      submittedAt: record.submitted_at,
      details: [record.organization_type, record.email].filter((value): value is string => Boolean(value)),
      attachmentUrl: record.agreement_file_url,
      attachmentName: record.agreement_file_name || (record.agreement_file_path ? "Open signed agreement" : undefined),
      agreementHasPath: Boolean(record.agreement_file_path),
    }));

    return [...beneficiaries, ...assessments, ...requests, ...agreements]
      .sort((left, right) => new Date(right.submittedAt || 0).getTime() - new Date(left.submittedAt || 0).getTime());
  }, [queue]);

  const categoryCounts = useMemo(() => {
    const counts = { all: items.length, beneficiary: 0, assessment: 0, request: 0, agreement: 0 };
    for (const item of items) {
      counts[item.type] += 1;
    }
    return counts;
  }, [items]);

  const visibleItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filtered = items.filter((item) => {
      const matchesStatus = filter === "pending" ? isPending(item.status) : filter === "approved" || filter === "rejected" ? item.status.toLowerCase() === filter : true;
      const matchesCategory = categoryFilter === "all" || item.type === categoryFilter;
      const haystack = [item.title, item.submitter, item.status, item.type, ...(item.details || [])].join(" ").toLowerCase();
      const matchesSearch = normalizedSearch.length === 0 || haystack.includes(normalizedSearch);
      return matchesStatus && matchesCategory && matchesSearch;
    });

    filtered.sort((left, right) => {
      switch (sortBy) {
        case "oldest":
          return new Date(left.submittedAt || 0).getTime() - new Date(right.submittedAt || 0).getTime();
        case "name":
          return left.title.localeCompare(right.title);
        case "status":
          return left.status.localeCompare(right.status) || new Date(right.submittedAt || 0).getTime() - new Date(left.submittedAt || 0).getTime();
        case "newest":
        default:
          return new Date(right.submittedAt || 0).getTime() - new Date(left.submittedAt || 0).getTime();
      }
    });

    return filtered;
  }, [categoryFilter, filter, items, search, sortBy]);

  async function updateStatus(item: ReviewItem, decision: "approve" | "reject" | "reopen") {
    setBusyId(item.id);
    setError("");
    setMessage("");
    const approved = decision === "approve";
    const rejected = decision === "reject";
    const status = item.type === "beneficiary"
      ? approved ? "Approved" : rejected ? "Rejected" : "Pending Review"
      : item.type === "assessment"
        ? approved ? "Approved" : rejected ? "Rejected" : "Pending Review"
        : item.type === "agreement"
          ? approved ? "Approved" : rejected ? "Rejected" : "Pending Review"
          : approved ? "approved" : rejected ? "rejected" : "pending";
    const endpoint = item.type === "beneficiary"
      ? `/api/beneficiaries/${encodeURIComponent(item.id)}/approval`
      : item.type === "assessment"
        ? `/api/assessments/${encodeURIComponent(item.id)}/review`
        : item.type === "agreement"
          ? `/api/organization-agreements/${encodeURIComponent(item.id)}`
          : `/api/requests/${encodeURIComponent(item.id)}`;
    const body = item.type === "assessment" ? { review_status: status } : { status };

    try {
      const response = await fetch(endpoint, {
        method: item.type === "beneficiary" ? "PUT" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) throw new Error(result?.error || `Review update failed (HTTP ${response.status}).`);
      setMessage(`${item.title}: ${decision === "reopen" ? "reopened for review" : approved ? "approved" : "rejected"}.`);
      await loadQueue();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Review update failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function openAgreement(item: ReviewItem) {
    if (item.attachmentUrl && !item.agreementHasPath) {
      window.location.assign(item.attachmentUrl);
      return;
    }
    setBusyId(item.id);
    setError("");
    try {
      const response = await fetch(`/api/organization-agreements/${encodeURIComponent(item.id)}/file`);
      const result = await response.json() as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error || "Signed agreement is unavailable.");
      window.location.assign(result.url);
    } catch (openError) {
      setError(openError instanceof Error ? openError.message : "Signed agreement is unavailable.");
      setBusyId(null);
    }
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Pending reviews</h1>
            <p className="mt-2 text-sm text-slate-600">Review registrations, assessments, equipment requests, and partnership agreements.</p>
          </div>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Status
            <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2">
              <option value="pending">Pending review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="all">All statuses</option>
            </select>
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {[
            { key: "all", label: "Total", count: categoryCounts.all },
            { key: "beneficiary", label: "Registrations", count: categoryCounts.beneficiary },
            { key: "assessment", label: "Assessments", count: categoryCounts.assessment },
            { key: "request", label: "Requests", count: categoryCounts.request },
            { key: "agreement", label: "Agreements", count: categoryCounts.agreement },
          ].map((metric) => (
            <button
              key={metric.key}
              type="button"
              onClick={() => setCategoryFilter(metric.key === "all" ? "all" : metric.key as ReviewItem["type"])}
              className={`rounded-xl border p-3 text-left transition ${categoryFilter === metric.key ? "border-emerald-600 bg-emerald-50" : "border-slate-200 bg-white hover:border-slate-300"}`}
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{metric.label}</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{metric.count}</div>
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 md:flex-row md:items-center md:justify-between">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, organization, phone, details..."
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-0 placeholder:text-slate-400 focus:border-emerald-500 md:max-w-md"
        />
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Sort by
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value as "newest" | "oldest" | "name" | "status")} className="rounded-lg border border-slate-300 bg-white px-3 py-2">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name">Name</option>
            <option value="status">Status</option>
          </select>
        </label>
      </div>

      {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
      {message && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
      {!queue.assessmentReviewReady && <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Assessment decisions are disabled until migration `2026-09-28-assessment-review-workflow.sql` is applied. Other review queues remain available.</p>}
      <p className="text-sm text-slate-600">{loading ? "Loading submissions..." : `${visibleItems.length} submissions shown`}</p>

      {!loading && visibleItems.length === 0 && <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">No submissions match this status, category, or search.</p>}

      <div className="grid gap-4">
        {visibleItems.map((item) => {
          const pending = isPending(item.status);
          const terminal = ["approved", "rejected"].includes(item.status.toLowerCase());
          return (
            <article key={`${item.type}-${item.id}`} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold uppercase text-slate-700">{item.type}</span>
                    <span className={`rounded-md px-2 py-1 text-xs font-semibold ${statusTone(item.status)}`}>{item.status}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
                  <p className="text-sm text-slate-700">Submitted by: {item.submitter}</p>
                  <p className="text-sm text-slate-600">Submitted: {item.submittedAt ? new Date(item.submittedAt).toLocaleString() : "Date unavailable"}</p>
                  {item.details.map((detail) => <p key={detail} className="break-words text-sm text-slate-600">{detail}</p>)}
                  {item.type === "assessment" && !item.canReview && <p className="text-sm font-medium text-amber-800">Assessment review schema is not installed; no status has been saved.</p>}
                  {item.attachmentUrl && item.type === "beneficiary" && <a href={item.attachmentUrl} target="_blank" rel="noreferrer" className="inline-flex text-sm font-semibold text-emerald-700 underline">View submitted photo</a>}
                  {item.type === "agreement" && (item.attachmentName || item.attachmentUrl) && <button type="button" disabled={busyId === item.id} onClick={() => void openAgreement(item)} className="inline-flex rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50">Open signed agreement</button>}
                  {!item.attachmentUrl && !item.attachmentName && <p className="text-xs text-slate-500">No attachment is recorded for this submission.</p>}
                  {item.resourceHref && <Link href={item.resourceHref} className="inline-flex text-sm font-semibold text-emerald-700 underline">Open beneficiary record</Link>}
                </div>

                <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
                  {pending && item.canReview !== false && <>
                    <button type="button" disabled={busyId === item.id} onClick={() => void updateStatus(item, "approve")} className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Approve</button>
                    <button type="button" disabled={busyId === item.id} onClick={() => void updateStatus(item, "reject")} className="rounded-md bg-rose-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Reject</button>
                  </>}
                  {terminal && <button type="button" disabled={busyId === item.id} onClick={() => void updateStatus(item, "reopen")} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50">Reopen review</button>}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Operational reports are generated analytics rather than submitted review records. <Link href="/reports" className="font-semibold text-emerald-700 underline">Open reports</Link>.
      </aside>
    </section>
  );
}
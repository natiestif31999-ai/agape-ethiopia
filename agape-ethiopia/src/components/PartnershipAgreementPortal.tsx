"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type AgreementFormState = {
  organization_name: string;
  organization_type: string;
  contact_person: string;
  email: string;
  phone: string;
  region: string;
  city: string;
  address: string;
  agreement_number: string;
  message: string;
};
import { getSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/layout/SupabaseProvider";
import { useLanguage } from "@/components/layout/LanguageProvider";
import OfficialAgreementEditor from "@/components/OfficialAgreementEditor";

type AgreementRecord = {
  id: string;
  organization_name: string;
  organization_type: string;
  contact_person: string;
  email: string;
  phone: string;
  region: string;
  city: string;
  address: string;
  agreement_file_url: string | null;
  agreement_file_name: string | null;
  agreement_file_path: string | null;
  uploaded_by: string | null;
  status: string;
  notes: string | null;
  internal_notes: string | null;
  submitted_at: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};

const organizationTypes = [
  "Hospital",
  "Clinic",
  "Rehabilitation Center",
  "NGO",
  "Government Organization",
  "Charity",
  "Church",
  "Other",
] as const;

const statusOptions = ["Pending Review", "Pending", "Under Review", "Approved", "Rejected"] as const;

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

function isPdfFile(file: File | null) {
  if (!file) {
    return false;
  }

  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export default function PartnershipAgreementPortal() {
  const { t } = useLanguage();
  const { isAdmin, isStaff } = useAuth();
  const [form, setForm] = useState<AgreementFormState>({
    organization_name: "",
    organization_type: organizationTypes[0],
    contact_person: "",
    email: "",
    phone: "",
    region: "",
    city: "",
    address: "",
    agreement_number: "",
    message: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackTone, setFeedbackTone] = useState<"success" | "error">("success");
  const [agreements, setAgreements] = useState<AgreementRecord[]>([]);
  const [isLoadingAgreements, setIsLoadingAgreements] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});

  const canManageAgreements = isAdmin || isStaff;

  const loadAgreements = useCallback(async () => {
    try {
      setIsLoadingAgreements(true);
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("organization_agreements")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (error) {
        throw error;
      }

      setAgreements((data as AgreementRecord[]) ?? []);
    } catch (error) {
      console.error("Unable to load agreements:", error);
      setFeedback(t("unableToLoadApplications"));
      setFeedbackTone("error");
    } finally {
      setIsLoadingAgreements(false);
    }
  }, [t]);

  useEffect(() => {
    if (!canManageAgreements) {
      return;
    }

    void loadAgreements();
  }, [canManageAgreements, loadAgreements]);

  const filteredAgreements = useMemo(() => {
    return agreements.filter((agreement) => {
      const matchesSearch = [agreement.organization_name, agreement.organization_type, agreement.contact_person, agreement.email, agreement.status]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || agreement.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [agreements, search, statusFilter]);

  async function resolveSignedAgreementUrl(agreementId: string, agreementEmail?: string | null) {
    try {
      const query = new URLSearchParams();
      if (agreementEmail) {
        query.set("email", agreementEmail);
      }
      query.set("public", "1");
      const response = await fetch(`/api/organization-agreements/${agreementId}/file?${query.toString()}`);
      const result = (await response.json()) as { url?: string };
      return response.ok ? result.url ?? null : null;
    } catch (error) {
      console.error("Agreement signed URL generation exception:", error);
      return null;
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFile) {
      setFeedback(t("uploadAgreementSelectPdf") || "Please select a PDF agreement.");
      setFeedbackTone("error");
      return;
    }

    if (!isPdfFile(selectedFile)) {
      setFeedback(t("uploadAgreementPdfOnly"));
      setFeedbackTone("error");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setFeedback(t("uploadAgreementSize"));
      setFeedbackTone("error");
      return;
    }

    const requiredFields = [form.organization_name, form.organization_type, form.contact_person, form.email, form.phone, form.region, form.city, form.address];
    if (requiredFields.some((value) => !value.trim())) {
      setFeedback(t("uploadAgreementValidation"));
      setFeedbackTone("error");
      return;
    }

    try {
      setIsUploading(true);
      const submissionData = new FormData();
      Object.entries(form).forEach(([key, value]) => submissionData.append(key, value));
      submissionData.append("signed_pdf", selectedFile);
      const response = await fetch("/api/organization-agreements", {
        method: "POST",
        body: submissionData,
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "Unable to upload agreement.");
      }

      setFeedback(t("uploadAgreementSuccess"));
      setFeedbackTone("success");
      setForm({
        organization_name: "",
        organization_type: organizationTypes[0],
        contact_person: "",
        email: "",
        phone: "",
        region: "",
        city: "",
        address: "",
        agreement_number: "",
        message: "",
      });
      setSelectedFile(null);
      if (canManageAgreements) {
        await loadAgreements();
      }
    } catch (error) {
      console.error("Agreement upload failed:", error);
      const errorMessage = error instanceof Error ? error.message : "";

      if (errorMessage.includes("storage is temporarily unavailable") || errorMessage.includes("Bucket not found")) {
        setFeedback(t("uploadAgreementStorageUnavailable") || "Agreement storage is temporarily unavailable.");
      } else if (errorMessage.includes("permission") || errorMessage.includes("unauthorized")) {
        setFeedback(t("uploadAgreementPermissionDenied") || "You do not have permission to upload agreements.");
      } else if (errorMessage.includes("saved") || errorMessage.includes("record")) {
        setFeedback(t("uploadAgreementRecordFailed") || "The agreement was uploaded, but saving its record failed. Please try again.");
      } else {
        setFeedback(t("uploadAgreementError"));
      }
      setFeedbackTone("error");
    } finally {
      setIsUploading(false);
    }
  }

  async function updateAgreement(id: string, changes: Partial<AgreementRecord>) {
    try {
      const response = await fetch(`/api/organization-agreements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: changes.status, internal_notes: changes.internal_notes }),
      });
      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error || "Unable to save agreement review.");
      }
      await loadAgreements();
    } catch (error) {
      console.error("Unable to update agreement:", error);
      setFeedback(t("unableToSaveChanges"));
      setFeedbackTone("error");
    }
  }

  async function openAgreement(agreement: AgreementRecord) {
    try {
      let fileUrl = agreement.agreement_file_url;
      if (!fileUrl && agreement.agreement_file_path) {
        fileUrl = await resolveSignedAgreementUrl(agreement.id, agreement.email);
      }

      if (!fileUrl) {
        setFeedback(t("agreementUnavailable") || "This agreement is not available right now.");
        setFeedbackTone("error");
        return;
      }

      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Unable to open agreement:", error);
      setFeedback(t("agreementUnavailable") || "This agreement is not available right now.");
      setFeedbackTone("error");
    }
  }

  async function getAgreementDownloadUrl(agreement: AgreementRecord) {
    if (agreement.agreement_file_url) {
      return agreement.agreement_file_url;
    }

    if (!agreement.agreement_file_path) {
      return null;
    }

    return resolveSignedAgreementUrl(agreement.id, agreement.email);
  }

  async function handleDelete(id: string, filePath: string | null) {
    try {
      const supabase = getSupabaseClient();
      if (filePath) {
        await supabase.storage.from("organization-agreements").remove([filePath]);
      }
      const { error } = await supabase.from("organization_agreements").delete().eq("id", id);
      if (error) {
        throw error;
      }
      await loadAgreements();
    } catch (error) {
      console.error("Unable to delete agreement:", error);
      setFeedback(t("unableToSaveChanges"));
      setFeedbackTone("error");
    }
  }

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-6 shadow-sm md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">{t("partnerPortalTitle")}</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl">{t("partnerPortalHeroTitle")}</h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-700">{t("partnerPortalHeroDescription")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#download-agreement" className="rounded-full bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800">
                {t("downloadAgreement")}
              </a>
              <a href="#upload-agreement" className="rounded-full border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700">
                {t("uploadSignedAgreementTitle")}
              </a>
              <a href="#online-agreement" className="rounded-full border border-amber-300 bg-amber-50 px-5 py-3 font-semibold text-amber-800">Fill &amp; sign online</a>
            </div>
          </div>
          <div className="rounded-3xl border border-emerald-200 bg-white/80 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">{t("partnershipInformation")}</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li><span className="font-semibold text-slate-900">{t("partnershipMission")}</span> {t("partnershipMissionText")}</li>
              <li><span className="font-semibold text-slate-900">{t("partnershipBenefits")}</span> {t("partnershipBenefitsText")}</li>
              <li><span className="font-semibold text-slate-900">{t("partnershipWhoCanJoin")}</span> {t("partnershipWhoCanJoinText")}</li>
              <li><span className="font-semibold text-slate-900">{t("partnershipProcess")}</span> {t("partnershipProcessText")}</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="download-agreement" className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">{t("officialAgreement")}</span>
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">{t("officialAgreementTitle")}</h2>
          <p className="mt-3 text-slate-600">{t("officialAgreementDescription")}</p>
          <a href="/Agape Agreement.pdf" download className="mt-6 inline-flex rounded-full bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800">
            {t("downloadAgreement")}
          </a>
        </div>

        <div id="upload-agreement" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">{t("uploadSignedAgreementTitle")}</span>
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">{t("uploadSignedAgreementTitle")}</h2>
          <p className="mt-3 text-slate-600">{t("uploadSignedAgreementDescription")}</p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              {t("organizationName")}
              <input
                value={form.organization_name}
                onChange={(event) => setForm((value) => ({ ...value, organization_name: event.target.value }))}
                className="rounded-2xl border border-slate-300 px-4 py-3"
                required
              />
            </label>

            <label className="grid gap-1 text-sm font-medium text-slate-700">
              {t("organizationType")}
              <select
                value={form.organization_type}
                onChange={(event) => setForm((value) => ({ ...value, organization_type: event.target.value }))}
                className="rounded-2xl border border-slate-300 px-4 py-3"
                required
              >
                {organizationTypes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1 text-sm font-medium text-slate-700">
              {t("contactPerson")}
              <input
                value={form.contact_person}
                onChange={(event) => setForm((value) => ({ ...value, contact_person: event.target.value }))}
                className="rounded-2xl border border-slate-300 px-4 py-3"
                required
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                {t("email")}
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))}
                  className="rounded-2xl border border-slate-300 px-4 py-3"
                  required
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                {t("phone")}
                <input
                  value={form.phone}
                  onChange={(event) => setForm((value) => ({ ...value, phone: event.target.value }))}
                  className="rounded-2xl border border-slate-300 px-4 py-3"
                  required
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                {t("region")}
                <input
                  value={form.region}
                  onChange={(event) => setForm((value) => ({ ...value, region: event.target.value }))}
                  className="rounded-2xl border border-slate-300 px-4 py-3"
                  required
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                {t("city")}
                <input
                  value={form.city}
                  onChange={(event) => setForm((value) => ({ ...value, city: event.target.value }))}
                  className="rounded-2xl border border-slate-300 px-4 py-3"
                  required
                />
              </label>
            </div>

            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Message (optional)
              <textarea
                value={form.message}
                onChange={(event) => setForm((value) => ({ ...value, message: event.target.value }))}
                className="min-h-24 rounded-2xl border border-slate-300 px-4 py-3"
                maxLength={2000}
              />
            </label>

            <label className="grid gap-1 text-sm font-medium text-slate-700">
              {t("address")}
              <textarea
                value={form.address}
                onChange={(event) => setForm((value) => ({ ...value, address: event.target.value }))}
                className="min-h-24 rounded-2xl border border-slate-300 px-4 py-3"
                required
              />
            </label>

            <label className="grid gap-1 text-sm font-medium text-slate-700">
              {t("agreementNumber")}
              <input
                value={form.agreement_number}
                onChange={(event) => setForm((value) => ({ ...value, agreement_number: event.target.value }))}
                className="rounded-2xl border border-slate-300 px-4 py-3"
              />
            </label>

            <label className="grid gap-1 text-sm font-medium text-slate-700">
              {t("uploadSignedPdf")}
              <input
                type="file"
                accept="application/pdf"
                onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                className="rounded-2xl border border-dashed border-slate-300 px-4 py-3"
                required
              />
            </label>

            <p className="text-sm text-slate-500">{t("uploadAgreementLimit")}</p>

            <button type="submit" disabled={isUploading} className="rounded-full bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
              {isUploading ? t("uploadingAgreement") : t("uploadAgreement")}
            </button>
          </form>

          {feedback && (
            <p className={`mt-4 rounded-2xl px-4 py-3 text-sm ${feedbackTone === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
              {feedback}
            </p>
          )}
        </div>
      </section>

      <OfficialAgreementEditor />

      {canManageAgreements && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">{t("agreementManagement")}</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">{t("agreementManagementTitle")}</h2>
              <p className="mt-2 text-slate-600">{t("agreementManagementDescription")}</p>
            </div>
            <div className="flex flex-col gap-3 md:min-w-[18rem]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-300 px-4 py-3"
                placeholder={t("searchAgreements")}
              />
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3">
                <option value="All">{t("allStatuses")}</option>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoadingAgreements ? (
            <div className="mt-6 text-sm text-slate-600">{t("loadingAgreements")}</div>
          ) : filteredAgreements.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">{t("noAgreements")}</div>
          ) : (
            <div className="mt-6 space-y-4">
              {filteredAgreements.map((agreement) => (
                <article key={agreement.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900">{agreement.organization_name}</h3>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{agreement.organization_type}</span>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700">{agreement.status}</span>
                      </div>
                      <p className="text-sm text-slate-600">{agreement.contact_person} • {agreement.email} • {agreement.phone}</p>
                      <p className="text-sm text-slate-600">{agreement.region}, {agreement.city}</p>
                      <p className="text-sm text-slate-600">{agreement.address}</p>
                      <p className="text-sm text-slate-500">{agreement.agreement_file_name}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => openAgreement(agreement)} className="rounded-full border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">
                        {t("open")}
                      </button>
                      {agreement.agreement_file_path && (
                        <button
                          type="button"
                          onClick={async () => {
                            const url = await getAgreementDownloadUrl(agreement);
                            if (!url) {
                              setFeedback(t("agreementUnavailable") || "This agreement is not available right now.");
                              setFeedbackTone("error");
                              return;
                            }
                            window.open(url, "_blank", "noopener,noreferrer");
                          }}
                          className="rounded-full border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
                        >
                          {t("download")}
                        </button>
                      )}
                      <button type="button" onClick={() => updateAgreement(agreement.id, { status: "Approved" })} className="rounded-full bg-emerald-700 px-3 py-2 text-sm font-semibold text-white">
                        {t("approve")}
                      </button>
                      <button type="button" onClick={() => updateAgreement(agreement.id, { status: "Rejected" })} className="rounded-full bg-amber-600 px-3 py-2 text-sm font-semibold text-white">
                        {t("reject")}
                      </button>
                      <button type="button" onClick={() => updateAgreement(agreement.id, { status: "Pending" })} className="rounded-full border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">
                        {t("pending")}
                      </button>
                      <button type="button" onClick={() => handleDelete(agreement.id, agreement.agreement_file_path)} className="rounded-full border border-rose-300 px-3 py-2 text-sm font-medium text-rose-700">
                        {t("delete")}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
                    <label className="grid gap-1 text-sm font-medium text-slate-700">
                      Review comment / rejection reason (optional)
                      <textarea
                        value={draftNotes[agreement.id] ?? agreement.internal_notes ?? agreement.notes ?? ""}
                        onChange={(event) => setDraftNotes((value) => ({ ...value, [agreement.id]: event.target.value }))}
                        className="min-h-20 rounded-2xl border border-slate-300 px-3 py-2"
                      />
                    </label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => updateAgreement(agreement.id, { internal_notes: draftNotes[agreement.id] ?? agreement.internal_notes ?? agreement.notes ?? "" })} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                        {t("save")}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

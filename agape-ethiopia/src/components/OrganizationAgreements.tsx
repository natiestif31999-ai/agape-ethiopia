"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/layout/LanguageProvider";

type Organization = {
  id: string;
  name?: string;
  type?: string;
};

export default function OrganizationAgreements() {
  const { t } = useLanguage();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const supabase = getSupabaseClient();
    supabase.from("organizations").select("id,name,type").then((res: { data: Organization[] | null }) => {
      setOrganizations((res.data as Organization[]) ?? []);
    });
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOrg || !file) {
      setStatus(t("register.public.validation.required"));
      return;
    }
    const supabase = getSupabaseClient();
    const filePath = `agreements/${selectedOrg}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from("organization-agreements").upload(filePath, file as File);
    if (uploadError) {
      setStatus((t("saveFailed") || "Save failed:") + " " + uploadError.message);
      return;
    }

    const { error } = await supabase.from("organization_agreements").insert({
      organization_id: selectedOrg,
      bucket: "organization-agreements",
      object_path: filePath,
    });

    if (error) {
      setStatus((t("saveFailed") || "Save failed:") + " " + error.message);
      return;
    }

    setStatus(t("settings.saved") || "Uploaded");
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">{t("organization.agreements")}</h2>
      <p className="mt-2 text-slate-600">{t("organization.downloadAgreement")}</p>

      <div className="mt-4">
        <a className="underline" href="/placeholder-agreement.pdf" download>
          {t("organization.downloadAgreement")}
        </a>
      </div>

      <form onSubmit={handleUpload} className="mt-6 grid gap-4 lg:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("organization.type")}
          <select value={selectedOrg} onChange={(e) => setSelectedOrg(e.target.value)} className="rounded-xl border border-slate-300 px-4 py-3">
            <option value="">{t("selectDisabilityType")}</option>
            {organizations.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("organization.uploadAgreement")}
          <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
        </label>

        <div className="lg:col-span-2">
          <button type="submit" className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white">{t("upload") || "Upload"}</button>
        </div>

        <p className="text-sm text-slate-500 lg:col-span-2">{status}</p>
      </form>
    </section>
  );
}

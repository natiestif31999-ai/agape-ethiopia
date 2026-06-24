"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import type { FormEvent } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

type Beneficiary = {
  id: string;
  registration_number?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  phone?: string;
  region?: string;
  kebele?: string;
  photo_url?: string;
  created_at?: string;
};

type EquipmentSummary = Record<string, string>;

export default function BeneficiarySearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [equipmentType, setEquipmentType] = useState("");
  const [results, setResults] = useState<Beneficiary[]>([]);
  const [equipmentSummary, setEquipmentSummary] = useState<EquipmentSummary>({});
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const [status, setStatus] = useState(t("searchPlaceholder") || "Search beneficiaries by name, reg. number, phone, region, kebele or equipment type.");

  useEffect(() => {
    void loadRecentBeneficiaries();
  }, []);

  async function loadRecentBeneficiaries() {
    setLoading(true);
    setStatus("Loading recent beneficiary records...");

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("beneficiaries")
      .select("id,registration_number,first_name,middle_name,last_name,phone,region,kebele,photo_url")
      .order("created_at", { ascending: false })
      .limit(25);

    if (error) {
      setStatus(`Unable to load beneficiaries: ${error.message}`);
      setLoading(false);
      return;
    }

    setResults(data ?? []);
    setEquipmentSummary({});
    setStatus("Showing the most recent beneficiary records.");
    setLoading(false);
  }

  async function searchBeneficiaries(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("Searching beneficiaries...");
    setEquipmentSummary({});

    const trimmedSearch = searchTerm.trim();
    const trimmedEquipmentType = equipmentType.trim();

    try {
      const supabase = getSupabaseClient();
      let beneficiaryCandidates: Beneficiary[] = [];
      let beneficiaryIds: string[] = [];

      if (trimmedSearch) {
        const orFilter = [
          `registration_number.ilike.%${trimmedSearch}%`,
          `first_name.ilike.%${trimmedSearch}%`,
          `middle_name.ilike.%${trimmedSearch}%`,
          `last_name.ilike.%${trimmedSearch}%`,
          `phone.ilike.%${trimmedSearch}%`,
          `region.ilike.%${trimmedSearch}%`,
          `kebele.ilike.%${trimmedSearch}%`,
        ].join(",");

        const { data, error } = await supabase
          .from("beneficiaries")
          .select("id,registration_number,first_name,middle_name,last_name,phone,region,kebele,photo_url")
          .or(orFilter)
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;
        beneficiaryCandidates = data ?? [];
      }

      if (trimmedEquipmentType) {
        const { data: distributions, error: distributionError } = await supabase
          .from("equipment_distributions")
          .select("beneficiary_id,equipment_type")
          .ilike("equipment_type", `%${trimmedEquipmentType}%`)
          .limit(200);

        if (distributionError) throw distributionError;

        const distributionList = (distributions ?? []) as Array<{ beneficiary_id?: string; equipment_type?: string }>;
        const assignmentIds = Array.from(new Set(distributionList.flatMap((item) => (item.beneficiary_id ? [item.beneficiary_id] : []))));

        if (assignmentIds.length > 0) {
          const { data, error } = await supabase
            .from("beneficiaries")
            .select("id,registration_number,first_name,middle_name,last_name,phone,region,kebele,photo_url")
            .in("id", assignmentIds)
            .order("created_at", { ascending: false })
            .limit(50);

          if (error) throw error;

          beneficiaryCandidates = [...beneficiaryCandidates, ...(data ?? [])];
        }
      }

      if (!trimmedSearch && !trimmedEquipmentType) {
        await loadRecentBeneficiaries();
        return;
      }

      const uniqueById = new Map(beneficiaryCandidates.map((item) => [item.id, item]));
      beneficiaryCandidates = Array.from(uniqueById.values()).slice(0, 50);
      beneficiaryIds = beneficiaryCandidates.map((item) => item.id);

      if (beneficiaryIds.length > 0) {
        const { data: distributions, error: distributionError } = await supabase
          .from("equipment_distributions")
          .select("beneficiary_id,equipment_type")
          .in("beneficiary_id", beneficiaryIds)
          .limit(200);

        if (distributionError) throw distributionError;

        const assignmentList = (distributions ?? []) as Array<{ beneficiary_id?: string; equipment_type?: string }>;
        const summary: EquipmentSummary = {};
        assignmentList.forEach((assignment) => {
          const beneficiaryId = assignment.beneficiary_id;
          if (!beneficiaryId) return;
          const existing = summary[beneficiaryId] ? `${summary[beneficiaryId]}, ${assignment.equipment_type ?? "Unknown"}` : assignment.equipment_type ?? "Unknown";
          summary[beneficiaryId] = existing;
        });

        setEquipmentSummary(summary);
      }

      setResults(beneficiaryCandidates);
      setStatus(
        beneficiaryCandidates.length > 0
          ? `Found ${beneficiaryCandidates.length} beneficiary record(s).`
          : "No beneficiary records match your search."
      );
    } catch (error) {
      if (error instanceof Error) {
        setStatus(`Search failed: ${error.message}`);
      } else {
        setStatus("Search failed due to an unexpected error.");
      }
    } finally {
      setLoading(false);
    }
  }

  const resultCount = results.length;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{t("searchBeneficiaries")}</h2>
          <p className="mt-2 text-slate-600">{t("searchPlaceholder")}</p>
        </div>
        <Link href="/beneficiaries/new" className="inline-flex rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800">
          New beneficiary
        </Link>
      </div>

      <form onSubmit={searchBeneficiaries} className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Search term
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Equipment type
          <input
            value={equipmentType}
            onChange={(event) => setEquipmentType(event.target.value)}
            placeholder="Wheelchair, crutches, walker"
            className="rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>

        <button type="submit" className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white md:col-span-2 hover:bg-slate-800">
          {loading ? "Searching..." : "Search beneficiaries"}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-500">{status}</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">Beneficiary</th>
              <th className="px-4 py-3">Registration #</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Region</th>
              <th className="px-4 py-3">Kebele</th>
              <th className="px-4 py-3">Equipment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {results.map((beneficiary) => (
              <tr key={beneficiary.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {beneficiary.photo_url ? (
                      <img src={beneficiary.photo_url} alt="photo" className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-slate-100" />
                    )}
                    <Link href={`/beneficiaries/${beneficiary.id}`} className="font-semibold text-slate-900 hover:text-emerald-700">
                      {[beneficiary.first_name, beneficiary.middle_name, beneficiary.last_name].filter(Boolean).join(" ") || "Unknown beneficiary"}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3">{beneficiary.registration_number ?? "—"}</td>
                <td className="px-4 py-3">{beneficiary.phone ?? "—"}</td>
                <td className="px-4 py-3">{beneficiary.region ?? "—"}</td>
                <td className="px-4 py-3">{beneficiary.kebele ?? "—"}</td>
                <td className="px-4 py-3">{equipmentSummary[beneficiary.id] ?? "—"}</td>
              </tr>
            ))}
            {resultCount === 0 && !loading && (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={6}>
                  No beneficiary matches yet. Try a broader search or register a new beneficiary.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

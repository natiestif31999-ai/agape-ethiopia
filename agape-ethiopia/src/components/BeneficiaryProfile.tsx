"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import BeneficiaryAssessmentForm from "@/components/BeneficiaryAssessmentForm";
import EquipmentAssignmentForm from "@/components/EquipmentAssignmentForm";
import { useLanguage } from "@/components/layout/LanguageProvider";

type BeneficiaryDetails = {
  id: string;
  registration_number?: string;
  registration_date?: string;
  first_name?: string;
  fathers_name?: string;
  grandfathers_name?: string;
  date_of_birth?: string;
  gender?: string;
  phone?: string;
  region?: string;
  kifle_ketema?: string;
  woreda_zone?: string;
  photo_url?: string;
  house_number?: string;
  notes?: string;
};

type AssessmentRecord = {
  id: string;
  assessment_date?: string;
  measurements?: string;
  wheelchair_fit?: string;
  notes?: string;
  recommendations?: string;
};

type EquipmentRecord = {
  id: string;
  issue_date?: string;
  equipment_type?: string;
  size?: string;
  notes?: string;
};

export default function BeneficiaryProfile({ beneficiaryId }: { beneficiaryId: string }) {
  const [beneficiary, setBeneficiary] = useState<BeneficiaryDetails | null>(null);
  const { t } = useLanguage();
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [equipment, setEquipment] = useState<EquipmentRecord[]>([]);
  const [status, setStatus] = useState("Loading beneficiary profile...");

  const loadProfile = useCallback(async () => {
    if (!beneficiaryId) {
      setStatus("No beneficiary selected.");
      return;
    }

    setStatus("Loading beneficiary record and history...");
    const supabase = getSupabaseClient();

    const [beneficiaryResult, assessmentResult, equipmentResult] = await Promise.all([
      supabase
        .from("beneficiaries")
        .select(
          "id,registration_number,registration_date,first_name,fathers_name,grandfathers_name,date_of_birth,gender,phone,region,kifle_ketema,woreda_zone,house_number,notes,photo_url"
        )
        .eq("id", beneficiaryId)
        .single(),
      supabase
        .from("assessments")
        .select("id,assessment_date,measurements,wheelchair_fit,notes,recommendations")
        .eq("beneficiary_id", beneficiaryId)
        .order("assessment_date", { ascending: false })
        .limit(20),
      supabase
        .from("equipment_assignments")
        .select("id,issue_date,equipment_type,size,notes")
        .eq("beneficiary_id", beneficiaryId)
        .order("issue_date", { ascending: false })
        .limit(20),
    ]);

    if (beneficiaryResult.error) {
      setStatus(`Unable to load beneficiary: ${beneficiaryResult.error.message}`);
      return;
    }

    setBeneficiary(beneficiaryResult.data ?? null);
    setAssessments(assessmentResult.data ?? []);
    setEquipment(equipmentResult.data ?? []);
    setStatus("Beneficiary profile loaded.");
  }, [beneficiaryId]);

  useEffect(() => {
    let mounted = true;

    async function runLoad() {
      if (!mounted) return;
      await loadProfile();
    }

    void runLoad();

    return () => {
      mounted = false;
    };
  }, [loadProfile]);

  const renderSection = (title: string, children: ReactNode) => (
    <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Beneficiary Profile</h2>
        <p className="mt-2 text-slate-600">View registration details, mobility assessments, and equipment assignments.</p>
        <p className="mt-4 text-sm text-slate-500">{status}</p>
      </div>

      {beneficiary ? (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6">
            {renderSection(
              "Registration details",
              <div className="grid gap-3">
                {(() => {
                  const fullName = [beneficiary.first_name, beneficiary.fathers_name, beneficiary.grandfathers_name]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <>
                      {[
                        ["Registration number", beneficiary.registration_number],
                        ["Registration date", beneficiary.registration_date],
                        [t("firstName"), fullName || "—"],
                        ["Date of birth", beneficiary.date_of_birth],
                        [t("gender"), beneficiary.gender],
                        [t("phone"), beneficiary.phone],
                        [t("region"), beneficiary.region],
                        [t("kifleKetema"), beneficiary.kifle_ketema],
                        [t("woredaZone"), beneficiary.woreda_zone],
                        [t("houseNumber"), beneficiary.house_number],
                        [t("notes"), beneficiary.notes],
                      ].map(([label, value]) => (
                        <div key={label} className="grid gap-1 rounded-2xl bg-white p-4 shadow-sm">
                          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{label}</p>
                          <p className="text-base font-medium text-slate-900">{value || "—"}</p>
                        </div>
                      ))}
                    </>
                  );
                })()}
              </div>
            )}

            {renderSection(
              "Assessments",
              assessments.length > 0 ? (
                <div className="space-y-4">
                  {assessments.map((assessment) => (
                    <div key={assessment.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-sm text-slate-500">{assessment.assessment_date || "Unknown date"}</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">Mobility assessment</p>
                      <p className="mt-2 text-sm text-slate-600">Measurements: {assessment.measurements || "Not recorded"}</p>
                      <p className="mt-2 text-sm text-slate-600">Wheelchair fitting: {assessment.wheelchair_fit || "Not recorded"}</p>
                      <p className="mt-2 text-sm text-slate-600">Recommendations: {assessment.recommendations || "Not recorded"}</p>
                      <p className="mt-2 text-sm text-slate-500">{assessment.notes || "No additional notes."}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No assessments found for this beneficiary.</p>
              )
            )}
          </div>

          <div className="space-y-6">
            {renderSection(
              "Equipment assignments",
              equipment.length > 0 ? (
                <div className="space-y-4">
                  {equipment.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-sm text-slate-500">{item.issue_date || "Unknown issue date"}</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">{item.equipment_type || "Equipment item"}</p>
                      <p className="mt-2 text-sm text-slate-600">Size: {item.size || "Not specified"}</p>
                      <p className="mt-2 text-sm text-slate-500">{item.notes || "No notes provided."}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No equipment assignments found for this beneficiary.</p>
              )
            )}

            <BeneficiaryAssessmentForm beneficiaryId={beneficiaryId} onCreated={loadProfile} />
            <EquipmentAssignmentForm beneficiaryId={beneficiaryId} onCreated={loadProfile} />
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">A valid beneficiary ID is required to display profile details.</p>
        </div>
      )}
    </div>
  );
}

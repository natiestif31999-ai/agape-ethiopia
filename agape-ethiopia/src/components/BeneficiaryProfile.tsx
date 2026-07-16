"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import BeneficiaryAssessmentForm from "@/components/BeneficiaryAssessmentForm";
import EquipmentDistributionForm from "@/components/EquipmentDistributionForm";
import { useLanguage } from "@/components/layout/LanguageProvider";

type BeneficiaryDetails = {
  id: string;
  registration_number?: string;
  registration_date?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: string;
  phone?: string;
  region?: string;
  kifle_ketema?: string;
  kebele?: string;
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
  distribution_date?: string;
  equipment_type?: string;
  equipment_size?: string;
  distribution_location?: string;
  received_by?: string;
  signature_confirmed?: boolean;
  notes?: string;
};

export default function BeneficiaryProfile({ beneficiaryId }: { beneficiaryId: string }) {
  const [beneficiary, setBeneficiary] = useState<BeneficiaryDetails | null>(null);
  const { t } = useLanguage();
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [equipment, setEquipment] = useState<EquipmentRecord[]>([]);
  const [status, setStatus] = useState(t("loadingRecord"));

  const loadProfile = useCallback(async () => {
    if (!beneficiaryId) {
      setStatus(t("noBeneficiarySelected"));
      return;
    }

    setStatus(t("loadingRecord"));
    const supabase = getSupabaseClient();

    const [beneficiaryResult, assessmentResult, equipmentResult] = await Promise.all([
      supabase
        .from("beneficiaries")
        .select(
          "id,registration_number,registration_date,first_name,middle_name,last_name,date_of_birth,gender,phone,region,kifle_ketema,kebele,house_number,notes,photo_url"
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
        .from("equipment_distributions")
        .select("id,distribution_date,equipment_type,equipment_size,distribution_location,received_by,signature_confirmed,notes")
        .eq("beneficiary_id", beneficiaryId)
        .order("distribution_date", { ascending: false })
        .limit(20),
    ]);

    if (beneficiaryResult.error) {
      setStatus(t("unableToLoadBeneficiary") + " " + beneficiaryResult.error.message);
      return;
    }

    setBeneficiary(beneficiaryResult.data ?? null);
    setAssessments(assessmentResult.data ?? []);
    setEquipment(equipmentResult.data ?? []);
    setStatus(t("profileLoaded"));
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
        <h2 className="text-2xl font-semibold text-slate-900">{t("beneficiaryProfile")}</h2>
        <p className="mt-2 text-slate-600">{t("beneficiaryProfileDescription")}</p>
        <p className="mt-4 text-sm text-slate-500">{status}</p>
      </div>

      {beneficiary ? (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6">
            {renderSection(
              t("registrationDetails"),
              <div className="grid gap-3">
                {(() => {
                  const fullName = [beneficiary.first_name, beneficiary.middle_name, beneficiary.last_name]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <>
                      {[
                        [t("registrationNumber"), beneficiary.registration_number],
                        [t("registrationDate"), beneficiary.registration_date],
                        [t("firstName"), fullName || t("unknown")],
                        [t("dateOfBirth"), beneficiary.date_of_birth],
                        [t("gender"), beneficiary.gender],
                        [t("phone"), beneficiary.phone],
                        [t("region"), beneficiary.region],
                        [t("kifleKetema"), beneficiary.kifle_ketema],
                        [t("kebele"), beneficiary.kebele],
                        [t("houseNumber"), beneficiary.house_number],
                        [t("notes"), beneficiary.notes],
                      ].map(([label, value]) => (
                        <div key={label} className="grid gap-1 rounded-2xl bg-white p-4 shadow-sm">
                          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{label}</p>
                          <p className="text-base font-medium text-slate-900">{value || t("notRecorded")}</p>
                        </div>
                      ))}
                    </>
                  );
                })()}
              </div>
            )}

            {renderSection(
              t("assessments"),
              assessments.length > 0 ? (
                <div className="space-y-4">
                  {assessments.map((assessment) => (
                    <div key={assessment.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-sm text-slate-500">{assessment.assessment_date || t("unknownDate")}</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">{t("mobilityAssessment")}</p>
                      <p className="mt-2 text-sm text-slate-600">{t("measurements")}: {assessment.measurements || t("notRecorded")}</p>
                      <p className="mt-2 text-sm text-slate-600">{t("wheelchairFitting")}: {assessment.wheelchair_fit || t("notRecorded")}</p>
                      <p className="mt-2 text-sm text-slate-600">{t("recommendations")}: {assessment.recommendations || t("notRecorded")}</p>
                      <p className="mt-2 text-sm text-slate-500">{assessment.notes || t("noAdditionalNotes")}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">{t("noAssessmentsFound")}</p>
              )
            )}
          </div>

          <div className="space-y-6">
            {renderSection(
              t("equipmentDistributions"),
              equipment.length > 0 ? (
                <div className="space-y-4">
                  {equipment.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-sm text-slate-500">{item.distribution_date || t("unknownDate")}</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">{item.equipment_type || t("item")}</p>
                      <p className="mt-2 text-sm text-slate-600">{t("size")}: {item.equipment_size || t("notSpecified")}</p>
                      <p className="mt-2 text-sm text-slate-600">{t("location")}: {item.distribution_location || t("notRecorded")}</p>
                      <p className="mt-2 text-sm text-slate-600">{t("receivedBy")}: {item.received_by || t("unknown")}</p>
                      <p className="mt-2 text-sm text-slate-500">{item.notes || t("noNotesProvided")}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">{t("noEquipmentDistributionsFound")}</p>
              )
            )}

            <BeneficiaryAssessmentForm beneficiaryId={beneficiaryId} onCreated={loadProfile} />
            <EquipmentDistributionForm beneficiaryId={beneficiaryId} onCreated={loadProfile} />
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">{t("validation.validBeneficiaryIdRequired")}</p>
        </div>
      )}
    </div>
  );
}

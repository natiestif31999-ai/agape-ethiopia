"use client";

import { useEffect, useState } from "react";

export default function ImpactHero() {
  const [requestCount, setRequestCount] = useState(0);
  const [donationCount, setDonationCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [requestsResponse, donationsResponse] = await Promise.all([fetch("/api/requests"), fetch("/api/donations")]);
        const [requestsResult, donationsResult] = await Promise.all([requestsResponse.json().catch(() => ({ data: [] })), donationsResponse.json().catch(() => ({ data: [] }))]);

        if (!mounted) return;

        setRequestCount(requestsResult?.data?.length ?? 0);
        setDonationCount(donationsResult?.data?.length ?? 0);
      } catch (error) {
        if (mounted) {
          console.warn("Impact summary load failed:", error);
          setRequestCount(0);
          setDonationCount(0);
        }
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 p-8 text-white shadow-xl">
      <p className="text-sm uppercase tracking-[0.35em] text-emerald-100">Master Home</p>
      <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold md:text-4xl">Matching mobility support to urgent requests in real time.</h2>
          <p className="mt-4 text-emerald-50/90 md:text-lg">
            Agape Ethiopia’s dashboard turns incoming donations and beneficiary requests into a live logistics flow for wheelchairs, mobility aids, and urgent support coordination.
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 p-4 backdrop-blur md:min-w-80">
          <p className="text-sm text-emerald-100">Live matching insight</p>
          <p className="mt-2 text-2xl font-semibold">{requestCount} pending requests → {donationCount} donation records</p>
          <p className="mt-1 text-sm text-emerald-100/90">This is the live operational snapshot the admin panel uses to prioritize next matching actions.</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          [requestCount.toString(), "urgent mobility requests"],
          [donationCount.toString(), "donation records in flight"],
          ["Live", "Supabase sync status"],
        ].map(([value, label]) => (
          <article key={label} className="rounded-2xl border border-white/10 bg-white/8 p-4">
            <p className="text-3xl font-semibold">{value}</p>
            <p className="text-sm text-emerald-100/90">{label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

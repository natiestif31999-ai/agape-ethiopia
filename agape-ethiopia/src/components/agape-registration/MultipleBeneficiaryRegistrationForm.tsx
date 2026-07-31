"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";

type BeneficiaryCard = {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  phone: string;
  region: string;
  kifle_ketema: string;
  kebele: string;
  house_number: string;
  disability_type: string;
  notes: string;
  photoDataUrl: string;
  previewOpen: boolean;
  status: "draft" | "queued" | "submitted" | "failed";
  error?: string;
};

const STORAGE_KEY = "agape-registration-offline-queue";

function createEmptyCard(): BeneficiaryCard {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    phone: "",
    region: "",
    kifle_ketema: "",
    kebele: "",
    house_number: "",
    disability_type: "",
    notes: "",
    photoDataUrl: "",
    previewOpen: false,
    status: "draft",
  };
}

function readQueue() {
  if (typeof window === "undefined") {
    return [] as Array<Record<string, unknown>>;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Array<Record<string, unknown>>) : [];
  } catch {
    return [] as Array<Record<string, unknown>>;
  }
}

function writeQueue(items: Array<Record<string, unknown>>) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function dataUrlToFile(dataUrl: string, fileName = "photo.jpg") {
  if (!dataUrl) {
    return null;
  }

  const [, base64] = dataUrl.split(",");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new File([bytes], fileName, { type: "image/jpeg" });
}

export default function MultipleBeneficiaryRegistrationForm() {
  const { t } = useLanguage();
  const [cards, setCards] = useState<BeneficiaryCard[]>([createEmptyCard()]);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);

  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", handleStatusChange);
    window.addEventListener("offline", handleStatusChange);

    return () => {
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      void flushQueue();
    }
  }, [isOnline]);

  const queuedCount = readQueue().length;

  function updateCard(id: string, field: keyof BeneficiaryCard, value: string | boolean) {
    setCards((current) => current.map((card) => (card.id === id ? { ...card, [field]: value } : card)));
  }

  function addCard() {
    setCards((current) => [...current, createEmptyCard()]);
  }

  function duplicateCard(id: string) {
    setCards((current) => {
      const source = current.find((card) => card.id === id);
      if (!source) {
        return current;
      }

      const copy = { ...source, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, status: "draft" as const, error: undefined };
      const index = current.findIndex((card) => card.id === id);
      const next = [...current];
      next.splice(index + 1, 0, copy);
      return next;
    });
  }

  function deleteCard(id: string) {
    setCards((current) => current.filter((card) => card.id !== id));
  }

  function previewCard(id: string) {
    setCards((current) => current.map((card) => (card.id === id ? { ...card, previewOpen: !card.previewOpen } : card)));
  }

  function handlePhotoChange(id: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateCard(id, "photoDataUrl", String(reader.result ?? ""));
    };
    reader.readAsDataURL(file);
  }

  async function submitCard(card: BeneficiaryCard) {
    const formData = new FormData();
    formData.append("first_name", card.first_name);
    formData.append("middle_name", card.middle_name);
    formData.append("last_name", card.last_name);
    formData.append("gender", card.gender);
    formData.append("phone", card.phone);
    formData.append("region", card.region);
    formData.append("kifle_ketema", card.kifle_ketema);
    formData.append("kebele", card.kebele);
    formData.append("house_number", card.house_number);
    formData.append("disability_type", card.disability_type);
    formData.append("notes", card.notes);
    if (card.photoDataUrl) {
      const photoFile = dataUrlToFile(card.photoDataUrl, `${card.first_name || "photo"}.jpg`);
      if (photoFile) {
        formData.append("photo", photoFile);
      }
    }

    if (!navigator.onLine) {
      const queued = readQueue();
      queued.push({ ...card, queuedAt: new Date().toISOString() });
      writeQueue(queued);
      setFeedback(t("offlineQueued"));
      return { ok: true, queued: true };
    }

    const response = await fetch("/api/public-registration", {
      method: "POST",
      body: formData,
    });

    const body = await response.json().catch(() => null);
    if (!response.ok) {
      const queued = readQueue();
      queued.push({ ...card, queuedAt: new Date().toISOString(), lastError: body?.error || body?.errors?.[0] || t("submitFailed") });
      writeQueue(queued);
      return { ok: false, queued: true, error: body?.error || body?.errors?.[0] || t("submitFailed") };
    }

    return { ok: true, queued: false };
  }

  async function flushQueue() {
    const queuedItems = readQueue();
    if (!queuedItems.length) {
      return;
    }

    const remaining: Array<Record<string, unknown>> = [];
    for (const item of queuedItems) {
      const card = item as BeneficiaryCard;
      const saved = await submitCard(card);
      if (!saved.ok) {
        remaining.push({ ...card, lastError: saved.error });
      }
    }

    writeQueue(remaining);
    setFeedback(t("queueSynced"));
  }

  async function handleSubmitAll(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback("");

    try {
      const results = await Promise.all(cards.map(async (card) => {
        const isValid = card.first_name && card.last_name && card.gender && card.phone && card.region && card.kebele;
        if (!isValid) {
          return { id: card.id, ok: false, error: t("register.public.validation.required") };
        }

        const submitted = await submitCard(card);
        return { id: card.id, ok: submitted.ok, error: submitted.error };
      }));

      const failed = results.filter((result) => !result.ok);
      setFeedback(
        failed.length
          ? `${t("submitPartial")}: ${failed.length}`
          : t("submitAllSuccess")
      );

      if (isOnline) {
        await flushQueue();
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">{t("multiRegistration")}</p>
            <h1 className="text-2xl font-semibold text-slate-900">{t("multiRegistrationTitle")}</h1>
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            {isOnline ? t("onlineStatus") : t("offlineStatus")}
          </div>
        </div>

        <form onSubmit={handleSubmitAll} className="mt-6 space-y-4">
          {cards.map((card, index) => (
            <article key={card.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-slate-900">{t("beneficiary")} {index + 1}</h2>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => previewCard(card.id)} className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700">{t("preview")}</button>
                  <button type="button" onClick={() => duplicateCard(card.id)} className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700">{t("duplicate")}</button>
                  <button type="button" onClick={() => deleteCard(card.id)} className="rounded-full border border-rose-300 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{t("delete")}</button>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  {t("firstName")}
                  <input value={card.first_name} onChange={(event) => updateCard(card.id, "first_name", event.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3" required />
                </label>
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  {t("fathersName")}
                  <input value={card.middle_name} onChange={(event) => updateCard(card.id, "middle_name", event.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3" />
                </label>
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  {t("grandfathersName")}
                  <input value={card.last_name} onChange={(event) => updateCard(card.id, "last_name", event.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3" required />
                </label>
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  {t("gender")}
                  <select value={card.gender} onChange={(event) => updateCard(card.id, "gender", event.target.value)} className="rounded-2xl border border-slate-300 bg-white px-4 py-3" required>
                    <option value="">{t("selectGender")}</option>
                    <option value="male">{t("male")}</option>
                    <option value="female">{t("female")}</option>
                  </select>
                </label>
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  {t("phone")}
                  <input value={card.phone} onChange={(event) => updateCard(card.id, "phone", event.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3" required />
                </label>
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  {t("region")}
                  <input value={card.region} onChange={(event) => updateCard(card.id, "region", event.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3" required />
                </label>
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  {t("kifleKetema")}
                  <input value={card.kifle_ketema} onChange={(event) => updateCard(card.id, "kifle_ketema", event.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3" />
                </label>
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  {t("kebele")}
                  <input value={card.kebele} onChange={(event) => updateCard(card.id, "kebele", event.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3" required />
                </label>
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  {t("houseNumber")}
                  <input value={card.house_number} onChange={(event) => updateCard(card.id, "house_number", event.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3" />
                </label>
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  {t("disabilityType")}
                  <input value={card.disability_type} onChange={(event) => updateCard(card.id, "disability_type", event.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3" />
                </label>
                <label className="grid gap-1 text-sm font-medium text-slate-700 lg:col-span-2">
                  {t("uploadPhotoLabel")}
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => handlePhotoChange(card.id, event)} className="rounded-2xl border border-slate-300 bg-white px-4 py-3" />
                </label>
                <label className="grid gap-1 text-sm font-medium text-slate-700 lg:col-span-3">
                  {t("notes")}
                  <textarea value={card.notes} onChange={(event) => updateCard(card.id, "notes", event.target.value)} className="min-h-24 rounded-2xl border border-slate-300 px-4 py-3" />
                </label>
              </div>

              {card.previewOpen ? (
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-white p-4 text-sm text-slate-700">
                  <p><strong>{t("beneficiary")}</strong>: {card.first_name} {card.middle_name} {card.last_name}</p>
                  <p><strong>{t("phone")}</strong>: {card.phone}</p>
                  <p><strong>{t("region")}</strong>: {card.region}</p>
                  <p><strong>{t("kebele")}</strong>: {card.kebele}</p>
                  <p><strong>{t("disabilityType")}</strong>: {card.disability_type || t("unknown")}</p>
                </div>
              ) : null}

              {card.error ? <p className="mt-3 text-sm font-medium text-rose-700">{card.error}</p> : null}
            </article>
          ))}

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={addCard} className="rounded-2xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700">{t("newRegistration")}</button>
            <button type="submit" disabled={isSubmitting} className="rounded-2xl bg-emerald-700 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400">{isSubmitting ? t("saving") : t("save")}</button>
            <button type="button" onClick={flushQueue} className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 font-semibold text-emerald-800">{t("tryAgain")}</button>
          </div>

          <p className="text-sm text-slate-600">{feedback || `${t("loading")} ${queuedCount}`}</p>
        </form>
      </section>
    </main>
  );
}

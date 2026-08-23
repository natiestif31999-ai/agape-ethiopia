/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";

type PageState = { width: number; height: number; image: HTMLCanvasElement };
type AgreementValues = {
  organizationName: string;
  organizationType: string;
  representativeName: string;
  email: string;
  phone: string;
  region: string;
  city: string;
  address: string;
  message: string;
  signingDate: string;
};

const initialValues: AgreementValues = {
  organizationName: "",
  organizationType: "",
  representativeName: "",
  email: "",
  phone: "",
  region: "",
  city: "",
  address: "",
  message: "",
  signingDate: new Date().toISOString().slice(0, 10),
};

export default function OfficialAgreementEditor() {
  const [pages, setPages] = useState<PageState[]>([]);
  const [values, setValues] = useState(initialValues);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [signatureMethod, setSignatureMethod] = useState<"drawn" | "image">("drawn");
  const [drawing, setDrawing] = useState(false);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [previousSubmissionId, setPreviousSubmissionId] = useState<string | null>(null);
  const [statusId, setStatusId] = useState("");
  const [statusEmail, setStatusEmail] = useState("");
  const [statusResult, setStatusResult] = useState<{ status: string; response: string | null; id: string } | null>(null);
  const signatureRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setStatusId(window.localStorage.getItem("agape-agreement-submission-id") || "");
    setPreviousSubmissionId(window.localStorage.getItem("agape-agreement-submission-id"));
    let cancelled = false;
    void import("pdfjs-dist/legacy/build/pdf.mjs").then(async (pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.mjs", import.meta.url).toString();
      const document = await pdfjs.getDocument({ url: "/Agape Agreement.pdf" }).promise;
      const rendered: PageState[] = [];
      for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
        const page = await document.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.35 });
        const canvas = window.document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvas, canvasContext: canvas.getContext("2d")!, viewport }).promise;
        rendered.push({ width: viewport.width, height: viewport.height, image: canvas });
      }
      if (!cancelled) setPages(rendered);
    }).catch(() => setFeedback("The official agreement could not be opened."));
    return () => { cancelled = true; };
  }, []);

  function update(field: keyof AgreementValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function drawSignature(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = signatureRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const context = canvas.getContext("2d");
    if (!context) return;
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);
    if (event.type === "pointerdown") {
      context.beginPath();
      context.moveTo(x, y);
      setDrawing(true);
      setSignatureMethod("drawn");
      return;
    }
    if (!drawing) return;
    context.lineTo(x, y);
    context.stroke();
    setSignatureDataUrl(canvas.toDataURL("image/png"));
  }

  function clearSignature() {
    const canvas = signatureRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDataUrl(null);
    setDrawing(false);
  }

  function uploadSignature(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSignatureDataUrl(String(reader.result));
      setSignatureMethod("image");
    };
    reader.readAsDataURL(file);
  }

  function payload(action: "preview" | "submit") {
    return {
      action,
      ...values,
      signatureDataUrl,
      signatureMethod,
      previousSubmissionId,
    };
  }

  async function previewAgreement() {
    const requiredValues = [values.organizationName, values.organizationType, values.representativeName, values.email, values.phone, values.region, values.city, values.address, values.signingDate];
    if (!signatureDataUrl || requiredValues.some((value) => !value.trim())) {
      setFeedback("Complete the partner information and draw or upload a signature.");
      return;
    }
    setBusy(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/organization-agreements/online", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload("preview")) });
      if (!response.ok) throw new Error(((await response.json()) as { error?: string }).error || "Preview could not be generated.");
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(await response.blob()));
      setMode("preview");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Preview could not be generated.");
    } finally {
      setBusy(false);
    }
  }

  async function submitAgreement() {
    setBusy(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/organization-agreements/online", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload("submit")) });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "The signed agreement could not be submitted.");
      setFeedback("Your completed Agape Ethiopia agreement was submitted for review.");
      setStatusEmail(values.email);
      const submissionId = (result as { submissionId?: string }).submissionId;
      if (submissionId) {
        window.localStorage.setItem("agape-agreement-submission-id", submissionId);
        setStatusId(submissionId);
        setPreviousSubmissionId(submissionId);
      }
      setValues(initialValues);
      setSignatureDataUrl(null);
      setMode("edit");
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      clearSignature();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "The signed agreement could not be submitted.");
    } finally {
      setBusy(false);
    }
  }

  async function lookupStatus(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    setStatusResult(null);
    const response = await fetch(`/api/organization-agreements/status?id=${encodeURIComponent(statusId)}&email=${encodeURIComponent(statusEmail)}`);
    const result = (await response.json()) as { error?: string; submission?: { id: string; status: string; response: string | null } };
    if (!response.ok || !result.submission) {
      setFeedback(result.error || "No matching submission was found.");
      return;
    }
    setStatusResult(result.submission);
    if (result.submission.status === "Rejected") setPreviousSubmissionId(result.submission.id);
  }

  const inputClass = "rounded-xl border border-slate-300 px-3 py-2 text-sm";
  return (
    <section id="online-agreement" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">Actual PDF editor</span>
      <h2 className="mt-4 text-2xl font-semibold text-slate-900">Fill &amp; Sign the Official Agreement</h2>
      <p className="mt-3 text-slate-600">This editor uses the original three-page Agape Ethiopia PDF. Your entries and signature are embedded into a completed PDF copy.</p>
      {feedback && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{feedback}</p>}
      <form onSubmit={lookupStatus} className="mt-5 grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label className="grid gap-1 text-sm font-medium text-slate-700">Submission ID<input className={inputClass} required value={statusId} onChange={(event) => setStatusId(event.target.value)} placeholder="Your submission ID" /></label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">Submission email<input className={inputClass} required type="email" value={statusEmail} onChange={(event) => setStatusEmail(event.target.value)} placeholder="Email used for submission" /></label>
        <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" type="submit">Check status</button>
      </form>
      {statusResult && <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950"><strong>Status: {statusResult.status}</strong>{statusResult.response && <p className="mt-1">Staff/Admin response: {statusResult.response}</p>}{statusResult.status === "Rejected" && <p className="mt-2 font-medium">You can correct the official PDF and submit a new version below.</p>}</div>}

      {mode === "edit" && (
        <>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <input className={inputClass} required placeholder="Organization name" value={values.organizationName} onChange={(e) => update("organizationName", e.target.value)} />
            <input className={inputClass} required placeholder="Representative name" value={values.representativeName} onChange={(e) => update("representativeName", e.target.value)} />
            <input className={inputClass} required placeholder="Organization / partnership type" value={values.organizationType} onChange={(e) => update("organizationType", e.target.value)} />
            <input className={inputClass} required type="email" placeholder="Email" value={values.email} onChange={(e) => update("email", e.target.value)} />
            <input className={inputClass} required placeholder="Phone" value={values.phone} onChange={(e) => update("phone", e.target.value)} />
            <input className={inputClass} required placeholder="Region" value={values.region} onChange={(e) => update("region", e.target.value)} />
            <input className={inputClass} required placeholder="City" value={values.city} onChange={(e) => update("city", e.target.value)} />
            <input className={inputClass} required placeholder="Address" value={values.address} onChange={(e) => update("address", e.target.value)} />
            <input className={inputClass} required type="date" value={values.signingDate} onChange={(e) => update("signingDate", e.target.value)} />
            <input className={inputClass} placeholder="Message (optional)" value={values.message} onChange={(e) => update("message", e.target.value)} />
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold text-slate-900">Signature</h3><button type="button" onClick={clearSignature} className="text-sm font-medium text-rose-700">Clear</button></div>
            <p className="mt-1 text-sm text-slate-600">Draw with a mouse, finger, or stylus. You can also upload a signature image.</p>
            <canvas ref={signatureRef} width={720} height={180} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); drawSignature(event); }} onPointerMove={drawSignature} onPointerUp={(event) => { event.currentTarget.releasePointerCapture(event.pointerId); setDrawing(false); }} onPointerCancel={() => setDrawing(false)} className="mt-3 h-36 w-full touch-none rounded-xl border border-dashed border-slate-400 bg-white" />
            <label className="mt-3 inline-flex cursor-pointer rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">Upload signature image<input className="sr-only" type="file" accept="image/png,image/jpeg" onChange={uploadSignature} /></label>
          </div>

            <div className="mt-6 overflow-auto rounded-2xl border border-slate-200 bg-slate-100 p-3">
            <p className="mb-3 text-sm font-medium text-slate-700">Official agreement with editable fields placed directly over the original PDF</p>
            {pages.length === 0 ? <p className="p-6 text-sm text-slate-600">Opening official PDF...</p> : pages.map((page, index) => <div key={index} className="relative mx-auto mb-4 w-fit max-w-full shadow-lg"><img src={page.image.toDataURL("image/png")} alt={`Official agreement page ${index + 1}`} className="block h-auto max-w-full" style={{ width: page.width }} />{index === 0 && <div className="absolute inset-0"><input aria-label="Agreement date on PDF" className="absolute left-[31%] top-[12%] w-[17%] bg-white/70 text-xs text-emerald-900 outline-none" value={values.signingDate} onChange={(e) => update("signingDate", e.target.value)} /><input aria-label="Organization name on PDF" className="absolute left-[25%] top-[23%] w-[60%] bg-white/70 text-xs text-emerald-900 outline-none" value={values.organizationName} onChange={(e) => update("organizationName", e.target.value)} /><input aria-label="Organization address on PDF" className="absolute left-[25%] top-[26%] w-[60%] bg-white/70 text-xs text-emerald-900 outline-none" value={values.address} onChange={(e) => update("address", e.target.value)} /></div>}{index === 2 && <div className="absolute inset-0"><input aria-label="Organization signature name on PDF" className="absolute left-[52%] top-[25%] w-[20%] bg-white/70 text-xs text-emerald-900 outline-none" value={values.organizationName} onChange={(e) => update("organizationName", e.target.value)} /><input aria-label="Partner signature name on PDF" className="absolute left-[52%] top-[28%] w-[20%] bg-white/70 text-xs text-emerald-900 outline-none" value={values.representativeName} onChange={(e) => update("representativeName", e.target.value)} />{signatureDataUrl && <img src={signatureDataUrl} alt="Signature preview on official PDF" className="absolute left-[70%] top-[28%] h-[8%] w-[22%] object-contain" />}</div>}</div>)}
          </div>
          <button disabled={busy || pages.length === 0} type="button" onClick={previewAgreement} className="mt-5 rounded-full bg-amber-700 px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? "Preparing PDF preview..." : "Preview completed PDF"}</button>
        </>
      )}

      {mode === "preview" && previewUrl && <div className="mt-6"><h3 className="font-semibold text-slate-900">Completed PDF preview</h3><iframe title="Completed Agape Ethiopia agreement preview" src={previewUrl} className="mt-3 h-[70vh] w-full rounded-xl border border-slate-300" /><div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={() => setMode("edit")} className="rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-700">Edit PDF fields</button><button disabled={busy} type="button" onClick={submitAgreement} className="rounded-full bg-emerald-700 px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? "Submitting..." : "Submit Signed Agreement"}</button></div></div>}
    </section>
  );
}

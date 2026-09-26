import { useRef, useState } from "react";
import { Image, Linking, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { File, Paths } from "expo-file-system";
import { WEB_API_URL } from "./config";
import { userFacingRequestError } from "./requestErrors";

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

const agreementFields: Array<{ key: keyof AgreementValues; label: string; optional?: boolean; keyboardType?: "default" | "email-address" | "phone-pad" }> = [
  { key: "organizationName", label: "Organization name" },
  { key: "organizationType", label: "Organization / partnership type" },
  { key: "representativeName", label: "Representative name" },
  { key: "email", label: "Email", keyboardType: "email-address" },
  { key: "phone", label: "Phone", keyboardType: "phone-pad" },
  { key: "region", label: "Region" },
  { key: "city", label: "City" },
  { key: "address", label: "Address" },
  { key: "signingDate", label: "Signing date (YYYY-MM-DD)" },
  { key: "message", label: "Message", optional: true },
];

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, Math.min(offset + 0x8000, bytes.length)));
  }
  return btoa(binary);
}

export default function OfficialAgreementMobile() {
  const [values, setValues] = useState(initialValues);
  const [signature, setSignature] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [previewReady, setPreviewReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [submissionId, setSubmissionId] = useState("");
  const [previousSubmissionId, setPreviousSubmissionId] = useState("");
  const [statusEmail, setStatusEmail] = useState("");
  const [agreementStatus, setAgreementStatus] = useState("");
  const submitInProgress = useRef(false);

  function update(field: keyof AgreementValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setPreviewReady(false);
  }

  async function chooseSignature() {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8 });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (asset.mimeType !== "image/png" && asset.mimeType !== "image/jpeg") {
      setFeedback("Choose a PNG or JPEG signature image.");
      return;
    }
    setSignature(asset);
    setPreviewReady(false);
    setFeedback("");
  }

  async function signatureDataUrl() {
    if (!signature) throw new Error("Add a signature image before continuing.");
    const image = new File(signature.uri);
    const bytes = await image.bytes();
    if (bytes.byteLength > 2 * 1024 * 1024) throw new Error("Choose a signature image smaller than 2 MB.");
    const mimeType = signature.mimeType === "image/png" ? "image/png" : "image/jpeg";
    return `data:${mimeType};base64,${bytesToBase64(bytes)}`;
  }

  async function requestAgreement(action: "preview" | "submit") {
    if (!WEB_API_URL) throw new Error("The agreement service is unavailable.");
    const required = [values.organizationName, values.organizationType, values.representativeName, values.email, values.phone, values.region, values.city, values.address, values.signingDate];
    if (required.some((value) => !value.trim())) throw new Error("Complete all required partner information.");

    const response = await fetch(`${WEB_API_URL}/api/organization-agreements/online`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        ...values,
        signatureDataUrl: await signatureDataUrl(),
        signatureMethod: "image",
        previousSubmissionId: previousSubmissionId || undefined,
      }),
    });

    if (action === "preview") {
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(body?.error ?? "The agreement preview could not be generated.");
      }
      const preview = new File(Paths.cache, `agape-agreement-preview-${Date.now()}.pdf`);
      preview.write(new Uint8Array(await response.arrayBuffer()));
      setPreviewReady(true);
      await Linking.openURL(preview.uri);
      setFeedback("The completed agreement preview was opened. Submit when it is ready.");
      return;
    }

    const body = await response.json().catch(() => null) as { submissionId?: string; error?: string } | null;
    if (!response.ok || !body?.submissionId) throw new Error(body?.error ?? "The agreement could not be submitted.");
    setSubmissionId(body.submissionId);
    setPreviousSubmissionId(body.submissionId);
    setStatusEmail(values.email);
    setAgreementStatus("Pending Review");
    setFeedback("The completed agreement was submitted for review.");
    setPreviewReady(false);
  }

  async function previewAgreement() {
    setBusy(true);
    setFeedback("");
    try {
      await requestAgreement("preview");
    } catch (error) {
      setFeedback(userFacingRequestError(error, "The agreement preview could not be generated."));
    } finally {
      setBusy(false);
    }
  }

  async function submitAgreement() {
    if (submitInProgress.current) return;
    submitInProgress.current = true;
    setBusy(true);
    setFeedback("");
    try {
      await requestAgreement("submit");
    } catch (error) {
      setFeedback(userFacingRequestError(error, "The agreement could not be submitted."));
    } finally {
      submitInProgress.current = false;
      setBusy(false);
    }
  }

  async function checkStatus() {
    if (!WEB_API_URL || !submissionId.trim() || !statusEmail.trim()) {
      setFeedback("Enter the submission ID and matching email address.");
      return;
    }
    setBusy(true);
    setFeedback("");
    try {
      const query = `id=${encodeURIComponent(submissionId.trim())}&email=${encodeURIComponent(statusEmail.trim())}`;
      const response = await fetch(`${WEB_API_URL}/api/organization-agreements/status?${query}`);
      const body = await response.json().catch(() => null) as { submission?: { status: string; response: string | null }; error?: string } | null;
      if (!response.ok || !body?.submission) throw new Error(body?.error ?? "No matching submission was found.");
      setAgreementStatus(body.submission.status);
      if (body.submission.status === "Rejected") setPreviousSubmissionId(submissionId.trim());
      setFeedback(body.submission.response || "Status updated from the agreement service.");
    } catch (error) {
      setFeedback(userFacingRequestError(error, "Agreement status could not be checked."));
    } finally {
      setBusy(false);
    }
  }

  async function downloadAgreement() {
    if (!WEB_API_URL || !submissionId.trim() || !statusEmail.trim()) {
      setFeedback("Enter the submission ID and matching email address.");
      return;
    }
    setBusy(true);
    setFeedback("");
    try {
      const path = `/api/organization-agreements/${encodeURIComponent(submissionId.trim())}/file?public=1&email=${encodeURIComponent(statusEmail.trim())}`;
      const response = await fetch(`${WEB_API_URL}${path}`);
      const body = await response.json().catch(() => null) as { url?: string; error?: string } | null;
      if (!response.ok || !body?.url) throw new Error(body?.error ?? "The agreement file is unavailable.");
      await Linking.openURL(body.url);
      setFeedback("The signed agreement file was opened.");
    } catch (error) {
      setFeedback(userFacingRequestError(error, "The agreement file could not be opened."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Fill and sign the official agreement</Text>
      <Text style={styles.body}>Complete the partner information and choose a PNG or JPEG signature. The existing service generates and stores the official PDF.</Text>
      {agreementFields.map(({ key, label, optional, keyboardType }) => (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>{label}{optional ? "" : " *"}</Text>
          <TextInput
            value={values[key]}
            onChangeText={(value) => update(key, value)}
            keyboardType={keyboardType ?? "default"}
            autoCapitalize={key === "email" ? "none" : "sentences"}
            placeholder={label}
            placeholderTextColor="#87928C"
            style={styles.input}
          />
        </View>
      ))}
      {signature ? <Image source={{ uri: signature.uri }} style={styles.signaturePreview} resizeMode="contain" /> : null}
      <Button label={signature ? "Change signature image" : "Choose signature image"} onPress={() => void chooseSignature()} secondary />
      <Button label={busy ? "Working..." : "Preview completed PDF"} onPress={() => void previewAgreement()} disabled={busy} />
      <Button label={busy ? "Working..." : "Submit signed agreement"} onPress={() => void submitAgreement()} disabled={busy || !previewReady} secondary />
      {agreementStatus ? <Text style={styles.status}>Status: {agreementStatus}</Text> : null}
      {feedback ? <Text accessibilityRole="alert" style={styles.feedback}>{feedback}</Text> : null}
      <Text style={styles.heading}>Check agreement status or open its file</Text>
      <TextInput value={submissionId} onChangeText={setSubmissionId} placeholder="Submission ID" placeholderTextColor="#87928C" style={styles.input} autoCapitalize="none" />
      <TextInput value={statusEmail} onChangeText={setStatusEmail} placeholder="Submission email" placeholderTextColor="#87928C" style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      <Button label={busy ? "Working..." : "Check status"} onPress={() => void checkStatus()} disabled={busy} secondary />
      <Button label={busy ? "Working..." : "Open submitted agreement"} onPress={() => void downloadAgreement()} disabled={busy} secondary />
    </View>
  );
}

function Button({ label, onPress, secondary = false, disabled = false }: { label: string; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled} style={[styles.button, secondary && styles.secondaryButton, disabled && styles.disabledButton]}>
      <Text style={[styles.buttonText, secondary && styles.secondaryButtonText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 24, paddingTop: 20, borderTopWidth: 1, borderTopColor: "#DCE8E2" },
  heading: { color: "#16332F", fontSize: 19, fontWeight: "800", marginTop: 12, marginBottom: 8 },
  body: { color: "#58706A", lineHeight: 22, marginBottom: 16 },
  field: { marginBottom: 8 },
  label: { color: "#36534C", fontWeight: "700", fontSize: 14, marginBottom: 6 },
  input: { minHeight: 50, borderRadius: 10, borderWidth: 1, borderColor: "#C9D8D0", backgroundColor: "#FFFFFF", paddingHorizontal: 14, color: "#16332F", fontSize: 16, marginBottom: 8 },
  signaturePreview: { width: "100%", height: 100, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#C9D8D0", borderRadius: 8, marginTop: 8 },
  status: { color: "#19544D", fontWeight: "800", marginTop: 12 },
  feedback: { color: "#36534C", lineHeight: 21, marginTop: 10 },
  button: { minHeight: 50, borderRadius: 10, backgroundColor: "#0E766E", alignItems: "center", justifyContent: "center", paddingHorizontal: 16, marginTop: 10 },
  buttonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },
  secondaryButton: { backgroundColor: "#E1ECE7" },
  secondaryButtonText: { color: "#19544D" },
  disabledButton: { opacity: 0.55 },
});

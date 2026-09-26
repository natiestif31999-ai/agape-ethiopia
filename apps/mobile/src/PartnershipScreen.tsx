import { useRef, useState } from "react";
import { Linking, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import { WEB_API_URL } from "./config";
import OfficialAgreementMobile from "./OfficialAgreementMobile";
import { userFacingRequestError } from "./requestErrors";
import { Button } from "./ui";
import { useTranslation } from "./i18n";

type Props = { onBack: () => void };

export default function PartnershipScreen({ onBack }: Props) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ organization_name: "", organization_type: "", contact_person: "", email: "", phone: "", region: "", city: "", address: "", message: "" });
  const [submissionId, setSubmissionId] = useState("");
  const [statusEmail, setStatusEmail] = useState("");
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [status, setStatus] = useState("");
  const uploadInProgress = useRef(false);

  function update(key: keyof typeof form, value: string) { setForm((current) => ({ ...current, [key]: value })); }

  async function pick() {
    const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf", copyToCacheDirectory: true });
    if (!result.canceled) setFile(result.assets[0]);
  }

  async function upload() {
    if (!WEB_API_URL) { setStatus(t("webApiMissing")); return; }
    if (!file) { setStatus(t("choosePdfFirst")); return; }
    if (uploadInProgress.current) return;
    uploadInProgress.current = true;
    setStatus(t("uploading"));
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      const signedPdf = new File(file.uri);
      data.append("signed_pdf", signedPdf, file.name);
      const response = await fetch(`${WEB_API_URL}/api/organization-agreements`, { method: "POST", body: data });
      const body = await response.json().catch(() => null) as { submissionId?: string; error?: string } | null;
      if (!response.ok) throw new Error(body?.error ?? t("uploadFailed"));
      setSubmissionId(body?.submissionId ?? "");
      setStatusEmail(form.email);
      setStatus(t("uploadSuccess"));
    } catch (error) { setStatus(userFacingRequestError(error, t("uploadFailed"))); }
    finally { uploadInProgress.current = false; }
  }

  async function openAgreement() {
    if (!WEB_API_URL) { setStatus(t("internetRequired")); return; }
    if (!submissionId.trim() || !statusEmail.trim()) { setStatus(t("enterAgreement")); return; }
    setStatus(t("preparingDownload"));
    try {
      const response = await fetch(`${WEB_API_URL}/api/organization-agreements/${encodeURIComponent(submissionId.trim())}/file?public=1&email=${encodeURIComponent(statusEmail.trim())}`);
      const body = await response.json().catch(() => null) as { url?: string; error?: string } | null;
      if (!response.ok || !body?.url) throw new Error(body?.error ?? t("unavailable"));
      await Linking.openURL(body.url);
      setStatus(t("opened"));
    } catch (error) { setStatus(userFacingRequestError(error, t("uploadFailed"))); }
  }

  async function checkStatus() {
    if (!WEB_API_URL) { setStatus(t("internetRequired")); return; }
    if (!submissionId.trim() || !statusEmail.trim()) { setStatus(t("enterAgreement")); return; }
    try {
      const query = `id=${encodeURIComponent(submissionId.trim())}&email=${encodeURIComponent(statusEmail.trim())}`;
      const response = await fetch(`${WEB_API_URL}/api/organization-agreements/status?${query}`);
      const body = await response.json().catch(() => null) as { submission?: { status: string; response: string | null }; error?: string } | null;
      if (!response.ok || !body?.submission) throw new Error(body?.error ?? t("unavailable"));
      setStatus(`Status: ${body.submission.status}${body.submission.response ? ` · ${body.submission.response}` : ""}`);
    } catch (error) { setStatus(error instanceof Error ? error.message : t("uploadFailed")); }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>{t("partnership")}</Text>
        <Text style={styles.heading}>{t("partnershipTitle")}</Text>
        <Text style={styles.subtitle}>{t("partnershipBody")}</Text>
        <Button label="View official agreement" secondary onPress={() => void Linking.openURL(`${WEB_API_URL}/Agape%20Agreement.pdf`)} />
        <Text style={styles.section}>{t("submitAgreement")}</Text>
        {([ ["organization_name", "organizationName"], ["organization_type", "organizationType"], ["contact_person", "contactPerson"], ["email", "email"], ["phone", "phone"], ["region", "region"], ["city", "city"], ["address", "address"] ] as const).map(([key, labelKey]) => (
          <View key={key} style={styles.field}>
            <Text style={styles.label}>{t(labelKey)} *</Text>
            <TextInput value={form[key]} onChangeText={(value) => update(key, value)} placeholder={t(labelKey)} placeholderTextColor="#87928C" style={styles.input} />
          </View>
        ))}
        <TextInput value={form.message} onChangeText={(value) => update("message", value)} placeholder={t("notesPlaceholder")} placeholderTextColor="#87928C" style={styles.input} />
        <Button label={file ? `Selected: ${file.name}` : t("choosePdf")} secondary onPress={pick} />
        <Button label={t("upload")} onPress={upload} />
        <OfficialAgreementMobile />
        <Text style={styles.section}>{t("openAgreement")}</Text>
        <Text style={styles.helper}>{t("enterAgreement")}</Text>
        <TextInput value={submissionId} onChangeText={setSubmissionId} placeholder={t("submissionId")} placeholderTextColor="#87928C" style={styles.input} />
        <TextInput value={statusEmail} onChangeText={setStatusEmail} keyboardType="email-address" placeholder={t("matchingEmail")} placeholderTextColor="#87928C" style={styles.input} autoCapitalize="none" />
        <Button label="Check agreement status" secondary onPress={checkStatus} />
        <Button label={t("download")} secondary onPress={openAgreement} />
        {status ? <Text accessibilityRole="alert" style={styles.status}>{status}</Text> : null}
        <Button label={t("backHome")} secondary onPress={onBack} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: "#F6F8F4" }, container: { padding: 24, paddingBottom: 52 }, eyebrow: { color: "#0E766E", fontSize: 12, fontWeight: "800", letterSpacing: 1.4, marginBottom: 10 }, heading: { color: "#16332F", fontSize: 30, lineHeight: 36, fontWeight: "800", marginBottom: 10 }, subtitle: { color: "#58706A", fontSize: 16, lineHeight: 24, marginBottom: 20 }, section: { color: "#16332F", fontSize: 19, fontWeight: "800", marginTop: 12, marginBottom: 12 }, helper: { color: "#6B7C76", lineHeight: 20, marginBottom: 12 }, field: { marginBottom: 15 }, label: { color: "#36534C", fontWeight: "700", fontSize: 14, marginBottom: 8 }, input: { minHeight: 52, borderRadius: 14, borderWidth: 1, borderColor: "#C9D8D0", backgroundColor: "#FFFFFF", paddingHorizontal: 15, color: "#16332F", fontSize: 16, marginBottom: 12 }, status: { color: "#36534C", lineHeight: 21, marginTop: 14 }
});

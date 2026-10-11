type DiagnosticValue = string | number | boolean | null | undefined;
type DiagnosticDetails = Record<string, DiagnosticValue>;

const diagnosticsEnabled =
  (typeof __DEV__ !== "undefined" && __DEV__) || process.env.EXPO_PUBLIC_REGISTRATION_DIAGNOSTICS === "true";

function safeOrigin(value: unknown) {
  if (typeof value !== "string" || !value) return undefined;
  try {
    return new URL(value).origin;
  } catch {
    return "invalid_origin";
  }
}

function errorCategory(message: unknown, status: unknown) {
  const text = typeof message === "string" ? message.toLowerCase() : "";
  if (text.includes("already registered")) return "duplicate";
  if (text.includes("did not confirm") || text.includes("missing remote id")) return "missing_remote_id";
  if (text.includes("network") || text.includes("timeout") || text.includes("fetch")) return "network_error";
  if (typeof status === "number" && status >= 500) return "server_error";
  if (typeof status === "number" && status >= 400) return "http_error";
  return "operation_failed";
}

export function logRegistrationDiagnostic(event: string, details: DiagnosticDetails = {}) {
  if (!diagnosticsEnabled) return;

  const safe: DiagnosticDetails = {};
  for (const key of ["localId", "remoteId", "clientChangeId"] as const) {
    const value = details[key];
    if (typeof value === "string") safe[key] = value.slice(0, 12);
  }
  const origin = safeOrigin(details.host ?? details.endpoint);
  if (origin) safe.host = origin;
  for (const key of ["status", "online", "syncState", "operation", "records", "rows", "hasData", "attempt", "retryable"] as const) {
    const value = details[key];
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") safe[key] = value;
  }
  if (typeof details.errorCategory === "string") {
    safe.errorCategory = /^[a-z_]{1,40}$/.test(details.errorCategory) ? details.errorCategory : "operation_failed";
  } else if (details.message) {
    safe.errorCategory = errorCategory(details.message, details.status);
  }

  console.info("[agape-registration]", event, safe);
}
import assert from "node:assert/strict";
import test from "node:test";

process.env.EXPO_PUBLIC_REGISTRATION_DIAGNOSTICS = "true";
const { logRegistrationDiagnostic } = await import("../src/registrationDiagnostics.ts");

test("preview diagnostics emit an allowlisted redacted event only", () => {
  const originalInfo = console.info;
  const calls = [];
  console.info = (...args) => calls.push(args);
  try {
    logRegistrationDiagnostic("request-failed", {
      localId: "local-record-123456",
      host: "https://user:password@example.invalid/api?token=secret",
      firstName: "Private Name",
      phone: "+251900000000",
      authorization: "Bearer secret-token",
      message: "A private backend error with beneficiary details",
      status: 503,
    });
  } finally {
    console.info = originalInfo;
  }

  const output = JSON.stringify(calls);
  assert.match(output, /request-failed/);
  assert.match(output, /local-record/);
  assert.match(output, /https:\/\/example\.invalid/);
  assert.match(output, /server_error/);
  for (const privateValue of ["Private Name", "+251900000000", "password", "secret-token", "beneficiary details"]) {
    assert.equal(output.includes(privateValue), false);
  }
});
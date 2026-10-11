import assert from "node:assert/strict";
import test from "node:test";
import { beneficiaryStatusesForFilter, countBeneficiariesByStatus } from "../src/lib/beneficiaryAdminStatus.ts";

test("Admin Pending filter includes the public API status", () => {
  assert.deepEqual(beneficiaryStatusesForFilter("pending"), ["Pending Review", "pending", "registered"]);
  assert.equal(beneficiaryStatusesForFilter("all"), null);
});

test("Admin status counts recognize public API casing and labels", () => {
  assert.deepEqual(countBeneficiariesByStatus([
    { status: "Pending Review" },
    { status: "Approved" },
    { status: "Rejected" },
    { status: "registered" },
  ]), { approved: 1, pending: 2, rejected: 1 });
});
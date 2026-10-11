import assert from "node:assert/strict";
import test from "node:test";
import { persistPublicRegistration } from "../src/lib/publicRegistrationPersistence.ts";

test("public registration persists the payload and returns the server row", async () => {
  const rows = [];
  let lookupCount = 0;
  const payload = {
    first_name: "Test",
    last_name: "Beneficiary",
    disability_type: "Mobility diagnosis",
    wheelchair_size: "Large",
    specific_apparatus_need: "Walker",
  };
  const result = await persistPublicRegistration({
    findDuplicate: async () => {
      lookupCount += 1;
      return { data: [], error: null };
    },
    insert: async (received) => {
      const row = { ...received, id: "isolated-db-id" };
      rows.push(row);
      return { data: row, error: null };
    },
  }, payload);

  assert.equal(lookupCount, 1);
  assert.equal(rows.length, 1);
  assert.deepEqual(rows[0], { ...payload, id: "isolated-db-id" });
  assert.deepEqual(result, { kind: "created", data: rows[0] });
});

test("duplicate lookup prevents another insert", async () => {
  let insertCount = 0;
  const result = await persistPublicRegistration({
    findDuplicate: async () => ({ data: [{ id: "existing-id" }], error: null }),
    insert: async () => {
      insertCount += 1;
      return { data: null, error: null };
    },
  }, { phone: "+251911000000" });

  assert.deepEqual(result, { kind: "duplicate" });
  assert.equal(insertCount, 0);
});

test("database lookup and insert failures never report a created registration", async () => {
  const lookupFailure = await persistPublicRegistration({
    findDuplicate: async () => ({ data: null, error: { message: "lookup unavailable" } }),
    insert: async () => ({ data: { id: "unexpected" }, error: null }),
  }, {});
  const insertFailure = await persistPublicRegistration({
    findDuplicate: async () => ({ data: [], error: null }),
    insert: async () => ({ data: null, error: { message: "insert rejected" } }),
  }, {});

  assert.deepEqual(lookupFailure, { kind: "error", message: "lookup unavailable" });
  assert.deepEqual(insertFailure, { kind: "error", message: "insert rejected" });
});
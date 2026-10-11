import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import test, { after, before } from "node:test";
import { saveAndSyncBeneficiary, syncBeneficiaryQueue } from "../src/registrationQueue.ts";
import { submitRegistrationRequest } from "../src/registrationResponse.ts";

const savedByPhone = new Map();
const requestLog = [];
let server;
let endpoint;
let lostResponsePhone = "";

function sendJson(response, status, body) {
  response.writeHead(status, { "content-type": "application/json" });
  response.end(JSON.stringify(body));
}

before(async () => {
  server = createServer((request, response) => {
    void (async () => {
      const chunks = [];
      for await (const chunk of request) chunks.push(chunk);
      const headers = new Headers();
      for (const [key, value] of Object.entries(request.headers)) {
        if (typeof value === "string") headers.set(key, value);
      }
      const parsed = new Request("http://localhost/api/public-registration", {
        method: request.method,
        headers,
        body: Buffer.concat(chunks),
      });
      const form = await parsed.formData();
      const values = Object.fromEntries([...form.entries()].map(([key, value]) => [key, String(value)]));
      const phone = values.phone;
      requestLog.push({ method: request.method, url: request.url, changeId: request.headers["x-client-change-id"], values });

      if (savedByPhone.has(phone)) {
        sendJson(response, 409, { error: "This phone number is already registered." });
        return;
      }
      if (phone.endsWith("500")) {
        sendJson(response, 500, { error: "Isolated test server failure." });
        return;
      }

      const saved = { id: `test-server-${savedByPhone.size + 1}`, phone, registration_number: `TEST-${savedByPhone.size + 1}` };
      savedByPhone.set(phone, saved);
      if (phone === lostResponsePhone) {
        lostResponsePhone = "";
        response.destroy();
        return;
      }
      if (phone.endsWith("201")) {
        sendJson(response, 201, { data: { phone } });
        return;
      }
      sendJson(response, 201, { data: saved });
    })().catch(() => response.destroy());
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  endpoint = `http://127.0.0.1:${server.address().port}/api/public-registration`;
});

after(async () => {
  server.close();
  await once(server, "close");
});

function makeRecord(localId, phone, syncState = "PENDING_SYNC") {
  return {
    localId,
    clientChangeId: `change-${localId}`,
    firstName: "Test",
    middleName: "Middle",
    lastName: "Beneficiary",
    phone,
    region: "Addis Ababa",
    gender: "female",
    notes: "Isolated sync test",
    dateOfBirth: "1990-01-01",
    kifleKetema: "",
    kebele: "01",
    houseNumber: "",
    disabilityType: "Mobility diagnosis",
    wheelchairSize: "Large",
    specificApparatusNeed: "Walker",
    referralSource: "",
    syncState,
    createdAt: new Date(0).toISOString(),
  };
}

function localRepository() {
  const rows = new Map();
  return {
    rows,
    save: async (record) => rows.set(record.localId, { ...record }),
    update: async (record) => rows.set(record.localId, { ...record }),
  };
}

function submit(record) {
  return submitRegistrationRequest(record, endpoint);
}

test("single registration sends the expected multipart request and persists the confirmed server ID", async () => {
  const repository = localRepository();
  const record = makeRecord("single", "5550101", "SYNCING");
  const result = await saveAndSyncBeneficiary(record, repository.save, repository.update, submit);

  assert.equal(requestLog.at(-1).method, "POST");
  assert.equal(requestLog.at(-1).url, "/api/public-registration");
  assert.equal(new URL(endpoint).origin, `http://127.0.0.1:${server.address().port}`);
  assert.equal(requestLog.at(-1).changeId, record.clientChangeId);
  assert.deepEqual(
    Object.fromEntries(["first_name", "last_name", "date_of_birth", "gender", "phone", "region", "kebele", "disability_type", "wheelchair_size", "specific_apparatus_need"].map((key) => [key, requestLog.at(-1).values[key]])),
    {
      first_name: "Test",
      last_name: "Beneficiary",
      date_of_birth: "1990-01-01",
      gender: "female",
      phone: "5550101",
      region: "Addis Ababa",
      kebele: "01",
      disability_type: "Mobility diagnosis",
      wheelchair_size: "Large",
      specific_apparatus_need: "Walker",
    },
  );
  assert.equal(result.record.syncState, "SYNCED");
  assert.equal(repository.rows.get(record.localId).serverId, savedByPhone.get(record.phone).id);
  assert.equal(repository.rows.get(record.localId).syncState, "SYNCED");
});

test("HTTP failures and success responses without a record ID stay failed locally", async () => {
  for (const [localId, phone] of [["http-failure", "5550500"], ["missing-id", "5550201"]]) {
    const repository = localRepository();
    const result = await saveAndSyncBeneficiary(makeRecord(localId, phone, "SYNCING"), repository.save, repository.update, submit);
    assert.equal(result.record.syncState, "FAILED");
    assert.ok(result.error);
    assert.equal(repository.rows.get(localId).serverId, undefined);
  }
});

test("multiple registration continues after a partial failure and retains mobility fields", async () => {
  const repository = localRepository();
  const records = [makeRecord("batch-ok", "5550102"), makeRecord("batch-fail", "5550500")];
  for (const record of records) await repository.save(record);

  const result = await syncBeneficiaryQueue(records, repository.update, submit, endpoint);

  assert.deepEqual(result, { synced: 1, failed: 1 });
  assert.equal(repository.rows.get("batch-ok").syncState, "SYNCED");
  assert.ok(repository.rows.get("batch-ok").serverId);
  assert.equal(repository.rows.get("batch-fail").syncState, "FAILED");
  assert.equal(repository.rows.get("batch-fail").wheelchairSize, "Large");
  assert.equal(repository.rows.get("batch-fail").specificApparatusNeed, "Walker");
});

test("a lost response followed by retry does not insert a duplicate and is not falsely marked synced", async () => {
  const repository = localRepository();
  const record = makeRecord("ambiguous", "5550301");
  const initialSavedCount = savedByPhone.size;
  await repository.save(record);
  lostResponsePhone = record.phone;

  const first = await syncBeneficiaryQueue([record], repository.update, submit, endpoint);
  assert.deepEqual(first, { synced: 0, failed: 1 });
  assert.equal(repository.rows.get(record.localId).syncState, "FAILED");
  assert.ok(savedByPhone.get(record.phone).id);
  assert.equal(savedByPhone.size, initialSavedCount + 1);

  const failed = repository.rows.get(record.localId);
  const retry = await syncBeneficiaryQueue([failed], repository.update, submit, endpoint);
  assert.deepEqual(retry, { synced: 0, failed: 1 });
  assert.equal(repository.rows.get(record.localId).syncState, "FAILED");
  assert.equal(savedByPhone.size, initialSavedCount + 1);
});
import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import { DatabaseSync } from "node:sqlite";
import test, { after, before } from "node:test";
import { saveAndSyncBeneficiary, syncBeneficiaryQueue } from "../src/registrationQueue.ts";
import { submitRegistrationRequest } from "../src/registrationResponse.ts";
import { BENEFICIARY_INSERT_SQL, RECOVER_INTERRUPTED_SYNC_SQL, beneficiaryInsertValues } from "../src/storageSql.ts";

const savedByPhone = new Map();
const savedByChangeId = new Map();
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
      const changeId = request.headers["x-client-change-id"];
      requestLog.push({ method: request.method, url: request.url, changeId, values });

      if (changeId && savedByChangeId.has(changeId)) {
        sendJson(response, 200, { data: savedByChangeId.get(changeId) });
        return;
      }

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
      if (changeId) savedByChangeId.set(changeId, saved);
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

test("SQLite queue insert persists all beneficiary fields with matching bindings", () => {
  const database = new DatabaseSync(":memory:");
  const columns = BENEFICIARY_INSERT_SQL.match(/beneficiary_queue \(([\s\S]*?)\) VALUES/)?.[1]
    .split(",")
    .map((column) => column.trim());
  assert.ok(columns?.length);
  database.exec(`CREATE TABLE beneficiary_queue (${columns.map((column) => `${column} TEXT`).join(", ")})`);

  const record = makeRecord("sqlite-save", "5550111", "PENDING_SYNC");
  const values = beneficiaryInsertValues(record);
  assert.equal(values.length, columns.length);
  database.prepare(BENEFICIARY_INSERT_SQL).run(...values);

  const saved = database.prepare("SELECT * FROM beneficiary_queue WHERE local_id = ?").get(record.localId);
  assert.equal(saved.client_change_id, record.clientChangeId);
  assert.equal(saved.disability_type, record.disabilityType);
  assert.equal(saved.wheelchair_size, record.wheelchairSize);
  assert.equal(saved.specific_apparatus_need, record.specificApparatusNeed);
  assert.equal(saved.sync_state, record.syncState);
  database.close();
});

test("SQLite restart recovery makes interrupted uploads retryable without changing synced records", () => {
  const database = new DatabaseSync(":memory:");
  database.exec("CREATE TABLE beneficiary_queue (local_id TEXT PRIMARY KEY, sync_state TEXT, error TEXT)");
  database.prepare("INSERT INTO beneficiary_queue VALUES (?, ?, ?)").run("interrupted", "SYNCING", "old error");
  database.prepare("INSERT INTO beneficiary_queue VALUES (?, ?, ?)").run("confirmed", "SYNCED", null);

  database.exec(RECOVER_INTERRUPTED_SYNC_SQL);

  assert.deepEqual(database.prepare("SELECT local_id, sync_state, error FROM beneficiary_queue ORDER BY local_id").all().map((row) => ({ ...row })), [
    { local_id: "confirmed", sync_state: "SYNCED", error: null },
    { local_id: "interrupted", sync_state: "PENDING_SYNC", error: null },
  ]);
  database.close();
});

test("a local database write failure is reported before any network submission", async () => {
  let submitCount = 0;
  let localSavedCount = 0;
  const result = await saveAndSyncBeneficiary(
    makeRecord("local-write-failure", "5550112", "SYNCING"),
    async () => { throw new Error("isolated SQLite write failure"); },
    async () => undefined,
    async (record) => {
      submitCount += 1;
      return record;
    },
    () => { localSavedCount += 1; },
  );

  assert.equal(result.localSaved, false);
  assert.equal(result.record.syncState, "FAILED");
  assert.equal(submitCount, 0);
  assert.equal(localSavedCount, 0);
});

test("single registration sends the expected multipart request and persists the confirmed server ID", async () => {
  const repository = localRepository();
  const record = makeRecord("single", "5550101", "SYNCING");
  const result = await saveAndSyncBeneficiary(record, repository.save, repository.update, submit);

  assert.equal(requestLog.at(-1).method, "POST");
  assert.equal(requestLog.at(-1).url, "/api/public-registration");
  assert.equal(new URL(endpoint).origin, `http://127.0.0.1:${server.address().port}`);
  assert.equal(requestLog.at(-1).changeId, record.clientChangeId);
  assert.equal(requestLog.at(-1).values.client_change_id, record.clientChangeId);
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

test("a lost response followed by retry confirms the original record without a duplicate", async () => {
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
  assert.deepEqual(retry, { synced: 1, failed: 0 });
  assert.equal(repository.rows.get(record.localId).syncState, "SYNCED");
  assert.equal(repository.rows.get(record.localId).serverId, savedByPhone.get(record.phone).id);
  assert.equal(savedByPhone.size, initialSavedCount + 1);
});
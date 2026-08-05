# Phase 2 — Safe Migration Plan (detailed)

Purpose: Provide a non-destructive, testable sequence to evolve the database schema to match Agape paper forms and enable the registration-number generator. Each step includes verification, rollback guidance, and estimated priority.

---
## Preliminaries (required)
- Take a full database snapshot (pg_dump) and store securely.
- Provision a staging database and restore the snapshot.
- Run test suite (if present) and `npm run build` against current code to capture baseline.

## Step 1 — Additive Schema Changes (Low Risk)
Apply to staging first.

1.1 Add `region_code` to `beneficiaries` (already drafted in `2026-08-05-registration-number-per-region.sql`).
  - Backfill via deterministic heuristic or admin-supplied mapping.
  - Verify: SELECT COUNT(*) WHERE region_code IS NULL.
  - Rollback: DROP COLUMN region_code (if added only in this migration).

1.2 Create `registration_counters` table and generator function (draft present).
  - DO NOT enable trigger until seeding is complete.
  - Verify function compiles and `registration_counters` exists.
  - Rollback: DROP FUNCTION and DROP TABLE.

1.3 Add numeric assessment columns with `_value` suffix (draft present).
  - No renames yet; additive only.
  - Verify: columns exist and accept numeric inserts.
  - Rollback: DROP columns if needed.

1.4 Add support tables: `import_jobs`, `report_exports`, `delivery_signatures`, `sync_queue`, `wheelchair_models`, `guardians` (draft present).
  - Verify indexes created.
  - Rollback: DROP TABLES.

**Testing**: basic inserts into new tables and numeric columns, verify constraints pass.

## Step 2 — Backfill & Data Quality
2.1 Backfill numeric fields from text columns where safe (use regex filters).
  - Query: UPDATE assessments SET seat_width_value = seat_width::numeric WHERE seat_width ~ '^[0-9]+(\\.[0-9]+)?$'
  - Collect rows failing cast into `assessments_import_issues` table for manual review.
  - Verify: spot-check converted values.
  - Rollback: none (recorded in backup); manual cleanup if necessary.

2.2 Backfill `region_code` using mapping or heuristic.
  - Create `region_mapping` temporary table with admin corrections.
  - Verify counts by region.

2.3 Seed `registration_counters` for each region using existing `registration_number` values.
  - Parse existing registration_number strings to extract region and numeric suffix.
  - Set counter = max(numeric_suffix) for each region_code.
  - Example script included in `migrations/analysis/seed_registration_counters.sql`.
  - Verify: ensure no duplicates with existing registration_number after seeding.

## Step 3 — Enable Registration Trigger (Controlled)
3.1 After seeding and validation, enable the trigger that writes registration numbers on INSERT.
  - Deploy trigger function but do not drop legacy generator function immediately (if present).
  - Perform concurrency test: simulate 100 parallel inserts with region_code = 'AA' and ensure unique numbers.
  - Verify: no duplicates and format matches regex.
  - Rollback: disable trigger and restore `registration_counters` from snapshot; check conflicts.

## Step 4 — Application Update (Dual-Write Transition)
4.1 Update server-side code to perform dual-write: write legacy columns AND new normalized columns on save.
  - For registrations: write `region_code` and ensure `registration_number` left to DB trigger.
  - For assessments: write both textual and numeric `_value` columns until fully validated.
  - Update TypeScript types in `src/lib/types.ts` and any data mappers.
  - Deploy to staging and run integration tests.

4.2 Monitor logs and backfill gaps manually if any rows missed.

## Step 5 — Consolidation & Cleanup (Delayed)
5.1 After 2–4 weeks of verification in staging/prod, schedule removal of legacy columns.
  - Steps: Add new canonical column names (without suffix) if desired, backfill, update app, then DROP old columns.
  - Always provide migration rollback scripts and maintain backups.

5.2 Consolidate `organization_agreements` definitions and audit logs shape.

## Step 6 — RLS Harden & Security
6.1 Update RLS policies to use `auth.uid()` with `public.users` lookup for role checks (Admin vs Staff).
6.2 Ensure service-role key is only used server-side (no exposure in client bundle).
6.3 Add audit triggers for new tables (e.g., `import_jobs`, `report_exports`, `sync_queue`) to `audit_logs`.

## Step 7 — Testing Checklist
- Registration concurrency test
- Assessment numeric cast validation
- Excel import preview -> `import_jobs`
- Delivery signature reference flow
- RLS policy checks for Staff/Admin
- Build and type-check: `npm install && npm run lint && npm run build`

## Rollback Strategy
- For additive migrations: DROP the added objects in reverse order if needed.
- Always restore from DB snapshot for any destructive rollback.

---
Generated: 2026-08-05

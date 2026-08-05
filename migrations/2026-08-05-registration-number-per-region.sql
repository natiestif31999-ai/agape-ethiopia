-- Migration: Per-region atomic registration number generator
-- Non-destructive: adds counters table, region_code, generator function, and protective constraints

BEGIN;

-- 1) Add a normalized `region_code` to beneficiaries (do not remove existing `region`)
ALTER TABLE IF EXISTS beneficiaries
  ADD COLUMN IF NOT EXISTS region_code text;

-- 2) Backfill `region_code` from existing `region` values using a simple, reversible rule
--    (uppercase letters from region name, first 3 characters, non-letters removed)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='beneficiaries' AND column_name='region') THEN
    EXECUTE $$
      UPDATE beneficiaries
      SET region_code = upper(substring(regexp_replace(coalesce(region, ''), '[^A-Za-z]', '', 'g') FROM 1 FOR 3))
      WHERE region_code IS NULL OR region_code = ''
    $$;
  END IF;
END$$;

-- 3) Create a per-region counter table to ensure atomic increments
CREATE TABLE IF NOT EXISTS registration_counters (
  region_code text PRIMARY KEY,
  counter bigint NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- 4) Function to generate registration numbers in format AG-MO-ETH-<REG>-000001
CREATE OR REPLACE FUNCTION generate_registration_number_per_region()
RETURNS trigger AS $$
DECLARE
  rc text;
  seqval bigint;
BEGIN
  -- If already provided, keep it
  IF NEW.registration_number IS NOT NULL AND NEW.registration_number <> '' THEN
    RETURN NEW;
  END IF;

  -- Determine region code: prefer explicit region_code, fallback to derived region value
  rc := (CASE
    WHEN (NEW.region_code IS NOT NULL AND NEW.region_code <> '') THEN upper(NEW.region_code)
    WHEN (NEW.region IS NOT NULL AND NEW.region <> '') THEN upper(substring(regexp_replace(NEW.region, '[^A-Za-z]', '', 'g') FROM 1 FOR 3))
    ELSE 'UNK'
  END);

  -- Ensure a counter row exists and atomically increment using UPSERT with RETURNING
  INSERT INTO registration_counters(region_code, counter, updated_at)
    VALUES (rc, 1, now())
  ON CONFLICT (region_code) DO UPDATE
    SET counter = registration_counters.counter + 1,
        updated_at = now()
  RETURNING counter INTO seqval;

  -- Compose standardized registration number
  NEW.registration_number := 'AG-MO-ETH-' || rc || '-' || lpad(seqval::text, 6, '0');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5) Attach trigger (safe: only created if column exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='beneficiaries' AND column_name='registration_number') THEN
    -- Drop existing trigger if it exists to ensure latest function is used
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_generate_registration_number_per_region') THEN
      EXECUTE 'DROP TRIGGER IF EXISTS trg_generate_registration_number_per_region ON beneficiaries';
    END IF;
    EXECUTE 'CREATE TRIGGER trg_generate_registration_number_per_region BEFORE INSERT ON beneficiaries FOR EACH ROW EXECUTE FUNCTION generate_registration_number_per_region()';
  END IF;
END$$;

-- 6) Enforce format for registration_number to prevent accidental edits
ALTER TABLE IF EXISTS beneficiaries
  ADD CONSTRAINT IF NOT EXISTS beneficiaries_registration_number_format_check
  CHECK (registration_number IS NULL OR registration_number ~ '^AG-MO-ETH-[A-Z0-9]{1,10}-\d{6}$');

-- 7) Ensure unique index exists for registration_number
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_beneficiaries_registration_number_unique') THEN
    CREATE UNIQUE INDEX idx_beneficiaries_registration_number_unique ON beneficiaries(registration_number);
  END IF;
END$$;

COMMIT;

-- NOTES:
-- - This migration creates a per-region counter table and a safe trigger-based generator.
-- - It backfills `region_code` by a reversible heuristic; you may want to provide an admin UI or mapping table
--   if your organization prefers explicit region codes.
-- - Existing registration_number values are preserved; new inserts will receive AG-MO-ETH-<REG>-NNNNNN numbers.

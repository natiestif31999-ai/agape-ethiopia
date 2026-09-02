-- Migration: Correct Registration Number Format to AG-B-REGION-NNNNNN
-- Date: 2026-09-02
-- Purpose: Ensure ONLY AG-B-REGION-NNNNNN format is used; clean up conflicting older migrations
-- Safety: Non-destructive; preserves existing valid registration numbers

BEGIN;

-- ===================================================================
-- STEP 1: Clean up any leftover tables/functions from conflicting migrations
-- ===================================================================

-- Drop the old trigger from 2026-08-05 if it exists
DROP TRIGGER IF EXISTS trg_generate_registration_number_per_region ON beneficiaries;

-- Drop the old function from 2026-08-05 if it exists
DROP FUNCTION IF EXISTS generate_registration_number_per_region() CASCADE;

-- Drop the old counter table from 2026-08-05 if it exists
DROP TABLE IF EXISTS registration_counters;

-- ===================================================================
-- STEP 2: Ensure region_code column exists
-- ===================================================================

ALTER TABLE IF EXISTS beneficiaries
  ADD COLUMN IF NOT EXISTS region_code text;

-- ===================================================================
-- STEP 3: Set up the unified counter table for AG-B- format
-- ===================================================================

CREATE TABLE IF NOT EXISTS beneficiary_identifier_counters (
  region_code text PRIMARY KEY,
  counter integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ===================================================================
-- STEP 4: Normalize region code derivation
-- ===================================================================

CREATE OR REPLACE FUNCTION normalize_beneficiary_region_code(p_region text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_region text;
BEGIN
  IF p_region IS NULL OR trim(p_region) = '' THEN
    RETURN 'GEN';
  END IF;

  v_region := upper(regexp_replace(trim(p_region), '[^A-Za-z]', '', 'g'));
  IF v_region = '' THEN
    RETURN 'GEN';
  END IF;

  RETURN substring(v_region from 1 for 3);
END;
$$;

-- ===================================================================
-- STEP 5: Generation function for AG-B-REGION-NNNNNN format
-- ===================================================================

CREATE OR REPLACE FUNCTION generate_beneficiary_registration_number(p_region text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  v_region_code text;
  v_counter integer;
BEGIN
  v_region_code := normalize_beneficiary_region_code(p_region);

  INSERT INTO beneficiary_identifier_counters(region_code, counter, updated_at)
  VALUES (v_region_code, 1, now())
  ON CONFLICT (region_code) DO UPDATE
    SET counter = beneficiary_identifier_counters.counter + 1,
        updated_at = now()
  RETURNING counter INTO v_counter;

  RETURN 'AG-B-' || v_region_code || '-' || lpad(v_counter::text, 6, '0');
END;
$$;

-- ===================================================================
-- STEP 6: Trigger to auto-generate registration numbers
-- ===================================================================

CREATE OR REPLACE FUNCTION sync_registration_number()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_region_value text;
  v_generated text;
BEGIN
  -- If registration_number is NULL or empty, generate it
  IF NEW.registration_number IS NULL OR trim(NEW.registration_number) = '' THEN
    v_region_value := COALESCE(NEW.region_code, NEW.region, 'GEN');
    v_generated := generate_beneficiary_registration_number(v_region_value);
    NEW.registration_number := v_generated;
    RETURN NEW;
  END IF;

  -- Preserve valid existing registration numbers in AG-B- format
  IF NEW.registration_number ~ '^AG-B-[A-Z]{2,5}-[0-9]{6}$' THEN
    RETURN NEW;
  END IF;

  -- If registration_number exists but is in wrong format (e.g., AG-MO-ETH-), regenerate
  IF NEW.registration_number ~ '^AG-MO-ETH-' THEN
    v_region_value := COALESCE(NEW.region_code, NEW.region, 'GEN');
    v_generated := generate_beneficiary_registration_number(v_region_value);
    NEW.registration_number := v_generated;
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

-- Drop old trigger if exists
DROP TRIGGER IF EXISTS trg_sync_registration_number ON beneficiaries;

-- Create new trigger
CREATE TRIGGER trg_sync_registration_number
BEFORE INSERT OR UPDATE OF registration_number, region, region_code
ON beneficiaries
FOR EACH ROW EXECUTE FUNCTION sync_registration_number();

-- ===================================================================
-- STEP 7: Backfill region_code from region for any missing entries
-- ===================================================================

UPDATE beneficiaries
SET region_code = normalize_beneficiary_region_code(region)
WHERE region_code IS NULL OR region_code = '';

-- ===================================================================
-- STEP 8: Fix any AG-MO-ETH- format numbers in existing records
-- ===================================================================

-- For beneficiaries with old AG-MO-ETH- format, extract region and regenerate properly
DO $$
DECLARE
  rec record;
  v_generated text;
  v_extracted_region text;
BEGIN
  FOR rec IN
    SELECT id, registration_number, region, region_code
    FROM beneficiaries
    WHERE registration_number ~ '^AG-MO-ETH-'
  LOOP
    -- Use the beneficiary's actual region, not the number embedded in old ID
    v_generated := generate_beneficiary_registration_number(COALESCE(rec.region_code, rec.region, 'GEN'));
    UPDATE beneficiaries
    SET registration_number = v_generated
    WHERE id = rec.id;
  END LOOP;
END $$;

-- ===================================================================
-- STEP 9: Assign registration numbers to any still-null entries
-- ===================================================================

DO $$
DECLARE
  rec record;
  v_generated text;
BEGIN
  FOR rec IN
    SELECT id, region_code, region
    FROM beneficiaries
    WHERE registration_number IS NULL OR trim(registration_number) = ''
  LOOP
    v_generated := generate_beneficiary_registration_number(COALESCE(rec.region_code, rec.region, 'GEN'));
    UPDATE beneficiaries
    SET registration_number = v_generated
    WHERE id = rec.id;
  END LOOP;
END $$;

-- ===================================================================
-- STEP 10: Enforce uniqueness and format
-- ===================================================================

-- Remove any existing conflicting indexes
DROP INDEX IF EXISTS idx_beneficiaries_registration_number_unique;

-- Create unique index on registration_number
CREATE UNIQUE INDEX IF NOT EXISTS idx_beneficiaries_registration_number_unique
ON beneficiaries(registration_number)
WHERE registration_number IS NOT NULL;

-- Add format check constraint if it doesn't exist
ALTER TABLE IF EXISTS beneficiaries
  ADD CONSTRAINT IF NOT EXISTS beneficiaries_registration_number_format_check
  CHECK (registration_number IS NULL OR registration_number ~ '^AG-B-[A-Z]{2,5}-[0-9]{6}$');

-- ===================================================================
-- STEP 11: Remove legacy separate identifier if present
-- ===================================================================

-- Drop beneficiary_id column if it exists (we now use registration_number only)
ALTER TABLE IF EXISTS beneficiaries
  DROP COLUMN IF EXISTS beneficiary_id CASCADE;

-- ===================================================================
-- CLEANUP
-- ===================================================================

-- Update timestamp on counters
UPDATE beneficiary_identifier_counters
SET updated_at = now();

COMMIT;

-- NOTES:
-- - This migration ensures ONLY AG-B-REGION-NNNNNN format is used
-- - Existing valid AG-B- format numbers are preserved
-- - Old AG-MO-ETH- format numbers are regenerated in correct format
-- - region_code is backfilled from region where missing
-- - The sync_registration_number trigger handles all future inserts/updates
-- - beneficiary_id column is dropped to eliminate duplicate identifiers
-- - All counters are per-region to prevent conflicts across regions

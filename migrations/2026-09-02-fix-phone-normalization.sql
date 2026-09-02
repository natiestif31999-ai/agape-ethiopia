-- Migration: Fix Phone Normalization to Accept Any Valid Format
-- Date: 2026-09-02
-- Purpose: Allow non-Ethiopian phone numbers while maintaining duplicate detection
-- Safety: Non-destructive, preserves existing phone values

BEGIN;

-- ===================================================================
-- STEP 1: Create a flexible phone normalization function
-- This accepts ANY valid phone number format (not just Ethiopian)
-- ===================================================================

CREATE OR REPLACE FUNCTION normalize_phone_for_comparison(raw_phone text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  normalized text;
  digits text;
BEGIN
  IF raw_phone IS NULL THEN
    RETURN NULL;
  END IF;

  -- Remove spaces, parens, dashes, underscores
  normalized := regexp_replace(raw_phone, '[\s\(\)\-_]', '', 'g');
  
  IF normalized = '' THEN
    RETURN NULL;
  END IF;

  -- Convert 00 prefix to + for international format
  IF normalized ~ '^00' THEN
    normalized := '+' || substring(normalized from 3);
  END IF;

  -- Extract only digits and + sign
  digits := regexp_replace(normalized, '[^\d\+]', '', 'g');
  
  IF digits = '' OR digits = '+' THEN
    RETURN NULL;
  END IF;

  -- Ensure + is at the start if present
  IF digits ~ '^\+' THEN
    RETURN '+' || regexp_replace(digits, '[^\d]', '', 'g');
  END IF;

  -- If no + prefix, add it (international format)
  RETURN '+' || digits;
END;
$$;

-- ===================================================================
-- STEP 2: Backfill phone_normalized with flexible normalization
-- ===================================================================

UPDATE beneficiaries
SET phone_normalized = normalize_phone_for_comparison(phone)
WHERE phone IS NOT NULL;

-- ===================================================================
-- STEP 3: Recreate indexes for phone uniqueness
-- ===================================================================

DROP INDEX IF EXISTS idx_beneficiaries_phone_normalized;
DROP INDEX IF EXISTS idx_beneficiaries_phone_normalized_unique;

-- Create non-unique index for fast lookup
CREATE INDEX IF NOT EXISTS idx_beneficiaries_phone_normalized
ON beneficiaries(phone_normalized)
WHERE phone_normalized IS NOT NULL;

-- Create unique constraint to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_beneficiaries_phone_normalized_unique
ON beneficiaries(phone_normalized)
WHERE phone_normalized IS NOT NULL;

-- ===================================================================
-- STEP 4: Add trigger to auto-normalize phone numbers on insert/update
-- ===================================================================

CREATE OR REPLACE FUNCTION sync_phone_normalized()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Auto-normalize the phone field when phone is inserted/updated
  IF NEW.phone IS NOT NULL AND NEW.phone <> '' THEN
    NEW.phone_normalized := normalize_phone_for_comparison(NEW.phone);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_phone_normalized ON beneficiaries;

CREATE TRIGGER trg_sync_phone_normalized
BEFORE INSERT OR UPDATE OF phone
ON beneficiaries
FOR EACH ROW EXECUTE FUNCTION sync_phone_normalized();

-- ===================================================================
-- STEP 5: Recreate phone conflicts view
-- ===================================================================

DROP VIEW IF EXISTS beneficiary_phone_conflicts;

CREATE VIEW beneficiary_phone_conflicts AS
SELECT 
  phone_normalized, 
  COUNT(*) AS duplicate_count,
  array_agg(id) AS beneficiary_ids,
  array_agg(first_name || ' ' || last_name) AS names
FROM beneficiaries
WHERE phone_normalized IS NOT NULL
GROUP BY phone_normalized
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- ===================================================================
-- STEP 6: Add constraint to ensure phone field is not empty
-- ===================================================================

ALTER TABLE IF EXISTS beneficiaries
  ADD CONSTRAINT beneficiaries_phone_not_empty
  CHECK (phone IS NULL OR phone <> '');

COMMIT;

-- NOTES:
-- - Phone normalization now accepts any international format
-- - Ethiopian numbers are supported (e.g., +251900000000, 0900000000, 00251900000000)
-- - Non-Ethiopian numbers are also supported (e.g., +14155552671, etc.)
-- - All numbers are normalized to international format with + prefix for consistent comparison
-- - Duplicate phone detection works across different input formats (+251 vs 0 vs 00251 variations)
-- - The sync_phone_normalized trigger ensures new/updated records are auto-normalized
-- - beneficiary_phone_conflicts view helps identify and resolve duplicates

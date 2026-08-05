-- Seed `registration_counters` from existing `beneficiaries.registration_number` values.
-- This script is read-only safe if run within a transaction preview; it populates counters to avoid duplicate issuance.

BEGIN;

-- Create temporary table to parse registration_number
CREATE TEMP TABLE tmp_reg_numbers AS
SELECT id,
       registration_number,
       regexp_replace(registration_number, '^AG-MO-ETH-','') AS tail_part
FROM beneficiaries
WHERE registration_number IS NOT NULL AND registration_number <> '';

-- Extract region and numeric suffix
ALTER TABLE tmp_reg_numbers ADD COLUMN region_code text;
ALTER TABLE tmp_reg_numbers ADD COLUMN seqnum bigint;

UPDATE tmp_reg_numbers
SET region_code = upper(split_part(tail_part, '-', 1)),
    seqnum = (CASE WHEN split_part(tail_part, '-', 2) ~ '^[0-9]+$' THEN split_part(tail_part, '-', 2)::bigint ELSE NULL END);

-- Aggregate max per region
CREATE TEMP TABLE tmp_max_per_region AS
SELECT region_code, max(seqnum) AS max_seq
FROM tmp_reg_numbers
WHERE region_code IS NOT NULL
GROUP BY region_code;

-- Insert or update registration_counters with max values
INSERT INTO registration_counters(region_code, counter, updated_at)
SELECT region_code, COALESCE(max_seq, 0), now()
FROM tmp_max_per_region
ON CONFLICT (region_code) DO UPDATE
  SET counter = GREATEST(registration_counters.counter, EXCLUDED.counter),
      updated_at = now();

COMMIT;

-- NOTE: Run this in staging first and inspect tmp_max_per_region results before committing in production.

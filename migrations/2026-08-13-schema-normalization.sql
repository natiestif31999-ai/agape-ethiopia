-- Migration: Schema Normalization and Column Fixes
-- Date: 2026-08-13
-- Purpose: Fix column naming issues, normalize data types, and improve schema consistency

BEGIN;

-- Fix column naming: Father's_name -> fathers_name (apostrophe causes SQL issues)
-- This needs to be done carefully to preserve data
ALTER TABLE IF EXISTS beneficiaries
  RENAME COLUMN IF EXISTS "Father's_name" TO fathers_name;

-- Ensure consistent naming for grandfathers_name
ALTER TABLE IF EXISTS beneficiaries
  RENAME COLUMN IF EXISTS grandfathers_name TO grandfathers_name; -- Already correct, ensures consistency

-- Add missing numeric assessment columns (for accurate measurements)
ALTER TABLE IF EXISTS assessments
  ADD COLUMN IF NOT EXISTS seat_width_value numeric,
  ADD COLUMN IF NOT EXISTS seat_depth_value numeric,
  ADD COLUMN IF NOT EXISTS back_height_value numeric,
  ADD COLUMN IF NOT EXISTS hip_width_value numeric,
  ADD COLUMN IF NOT EXISTS shoulder_width_value numeric,
  ADD COLUMN IF NOT EXISTS lower_leg_length_value numeric,
  ADD COLUMN IF NOT EXISTS upper_leg_length_value numeric,
  ADD COLUMN IF NOT EXISTS height_value numeric,
  ADD COLUMN IF NOT EXISTS weight_value numeric,
  ADD COLUMN IF NOT EXISTS foot_rest_height_value numeric,
  ADD COLUMN IF NOT EXISTS arm_rest_height_value numeric,
  ADD COLUMN IF NOT EXISTS head_support boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS lateral_support boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS special_needs text;

-- Ensure beneficiaries table has all required NOT NULL constraints properly
-- (These should have default values or be nullable as appropriate)
ALTER TABLE IF EXISTS beneficiaries
  ALTER COLUMN first_name SET NOT NULL;

-- Add indexes for common search queries
CREATE INDEX IF NOT EXISTS idx_beneficiaries_region ON beneficiaries(region);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_kebele ON beneficiaries(kebele);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_phone ON beneficiaries(phone);
CREATE INDEX IF NOT EXISTS idx_assessments_assessment_date ON assessments(assessment_date);
CREATE INDEX IF NOT EXISTS idx_equipment_distributions_distribution_date ON equipment_distributions(distribution_date);

-- Add check constraint to ensure registration number format when provided
-- Note: Full format validation (AG-MO-ETH-REGION-000001) should be enforced at application level
ALTER TABLE IF EXISTS beneficiaries
  ADD CONSTRAINT check_registration_number_not_empty 
  CHECK (registration_number IS NULL OR registration_number != '');

-- Ensure status column has valid values
ALTER TABLE IF EXISTS beneficiaries
  ADD CONSTRAINT check_beneficiary_status 
  CHECK (status IN ('registered', 'assessed', 'matched', 'delivered', 'follow-up', 'completed', 'inactive'));

-- Create registration_counters table if it doesn't exist (for atomic registration number generation)
CREATE TABLE IF NOT EXISTS registration_counters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region text NOT NULL UNIQUE,
  current_sequence integer DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT check_sequence_positive CHECK (current_sequence >= 0)
);

-- Enable RLS on registration_counters
ALTER TABLE registration_counters ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for registration_counters (authenticated users can read, staff can update)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'registration_counters' AND policyname = 'registration_counters_select') THEN
    CREATE POLICY registration_counters_select ON registration_counters FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'registration_counters' AND policyname = 'registration_counters_update') THEN
    CREATE POLICY registration_counters_update ON registration_counters FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
END$$;

-- Create a function to atomically get the next registration number
CREATE OR REPLACE FUNCTION get_next_registration_number(p_region text)
RETURNS text AS $$
DECLARE
  v_next_seq integer;
  v_region_code text;
BEGIN
  -- Lock the row for update to ensure atomicity
  UPDATE registration_counters
  SET current_sequence = current_sequence + 1,
      updated_at = now()
  WHERE region = p_region
  RETURNING current_sequence INTO v_next_seq;

  -- If no row exists, create one
  IF v_next_seq IS NULL THEN
    INSERT INTO registration_counters (region, current_sequence, updated_at)
    VALUES (p_region, 1, now())
    RETURNING current_sequence INTO v_next_seq;
  END IF;

  -- Format: AG-MO-ETH-REGION-000001
  -- Normalize region code
  v_region_code := UPPER(SUBSTRING(p_region, 1, 2)); -- First 2 chars of region
  
  RETURN CONCAT('AG-MO-ETH-', v_region_code, '-', LPAD(v_next_seq::text, 6, '0'));
END;
$$ LANGUAGE plpgsql;

COMMIT;

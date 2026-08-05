-- Migration: Add numeric assessment measurement columns (non-destructive)
-- Adds new numeric columns with _value suffix to avoid collisions with existing text columns

BEGIN;

ALTER TABLE IF EXISTS assessments
  ADD COLUMN IF NOT EXISTS seat_width_value numeric,
  ADD COLUMN IF NOT EXISTS seat_depth_value numeric,
  ADD COLUMN IF NOT EXISTS back_height_value numeric,
  ADD COLUMN IF NOT EXISTS lower_leg_length_value numeric,
  ADD COLUMN IF NOT EXISTS upper_leg_length_value numeric,
  ADD COLUMN IF NOT EXISTS hip_width_value numeric,
  ADD COLUMN IF NOT EXISTS shoulder_width_value numeric,
  ADD COLUMN IF NOT EXISTS weight_value numeric,
  ADD COLUMN IF NOT EXISTS height_value numeric,
  ADD COLUMN IF NOT EXISTS foot_rest_height_value numeric,
  ADD COLUMN IF NOT EXISTS arm_rest_height_value numeric;

-- Add boolean/structured fields
ALTER TABLE IF EXISTS assessments
  ADD COLUMN IF NOT EXISTS head_support boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS lateral_support boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS cushion_recommendation text,
  ADD COLUMN IF NOT EXISTS special_needs text;

-- Backfill numeric columns from existing textual columns if safe
DO $$
BEGIN
  -- Attempt to cast common textual columns into the new numeric columns when values are numeric
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='assessments' AND column_name='seat_width') THEN
    EXECUTE $$
      UPDATE assessments
      SET seat_width_value = NULLIF(trim(seat_width), '')::numeric
      WHERE seat_width ~ '^[0-9]+(\.[0-9]+)?$';
    $$;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='assessments' AND column_name='seat_depth') THEN
    EXECUTE $$
      UPDATE assessments
      SET seat_depth_value = NULLIF(trim(seat_depth), '')::numeric
      WHERE seat_depth ~ '^[0-9]+(\.[0-9]+)?$';
    $$;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='assessments' AND column_name='weight') THEN
    EXECUTE $$
      UPDATE assessments
      SET weight_value = NULLIF(trim(weight), '')::numeric
      WHERE weight ~ '^[0-9]+(\.[0-9]+)?$';
    $$;
  END IF;

  -- Additional casts can be added later in the Phase 2 migration plan where needed
END$$;

-- Index for quick lookup
CREATE INDEX IF NOT EXISTS idx_assessments_beneficiary_id ON assessments(beneficiary_id);

COMMIT;

-- NOTES:
-- - New numeric fields use a _value suffix to avoid immediate collisions with existing text columns.
-- - After verification and app updates, we can consolidate names and drop or rename old textual columns.

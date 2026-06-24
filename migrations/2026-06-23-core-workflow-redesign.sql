BEGIN;

-- Beneficiary table updates
ALTER TABLE IF EXISTS beneficiaries
  ADD COLUMN IF NOT EXISTS registration_number text,
  ADD COLUMN IF NOT EXISTS middle_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS kebele text,
  ADD COLUMN IF NOT EXISTS photo_url text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_beneficiaries_registration_number_unique'
  ) THEN
    CREATE UNIQUE INDEX idx_beneficiaries_registration_number_unique ON beneficiaries(registration_number);
  END IF;
END$$;

-- Assessment table updates
ALTER TABLE IF EXISTS assessments
  ADD COLUMN IF NOT EXISTS hip_width text,
  ADD COLUMN IF NOT EXISTS seat_depth text,
  ADD COLUMN IF NOT EXISTS back_height text,
  ADD COLUMN IF NOT EXISTS recommended_equipment text,
  ADD COLUMN IF NOT EXISTS recommended_size text,
  ADD COLUMN IF NOT EXISTS assessor_name text,
  ADD COLUMN IF NOT EXISTS assessment_date date,
  ADD COLUMN IF NOT EXISTS notes text;

-- Equipment distribution table
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS equipment_distributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid REFERENCES beneficiaries(id) ON DELETE CASCADE,
  equipment_type text NOT NULL,
  equipment_size text,
  distribution_date date NOT NULL DEFAULT CURRENT_DATE,
  distribution_location text,
  received_by text,
  signature_confirmed boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now()
);

COMMIT;

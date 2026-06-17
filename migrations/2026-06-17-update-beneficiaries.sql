-- Migration: Update beneficiaries table to Ethiopian naming, woreda/zone, photo storage,
-- automatic registration number and audit logging.

BEGIN;

-- 1) Add new columns
ALTER TABLE IF EXISTS beneficiaries
  ADD COLUMN IF NOT EXISTS fathers_name text,
  ADD COLUMN IF NOT EXISTS grandfathers_name text,
  ADD COLUMN IF NOT EXISTS woreda_zone text,
  ADD COLUMN IF NOT EXISTS photo_url text;

-- 2) Preserve existing data: copy middle_name -> fathers_name, last_name -> grandfathers_name, kebele -> woreda_zone
UPDATE beneficiaries SET
  fathers_name = COALESCE(fathers_name, middle_name),
  grandfathers_name = COALESCE(grandfathers_name, last_name),
  woreda_zone = COALESCE(woreda_zone, kebele)
WHERE TRUE;

-- 3) Create a sequence for the registration counter (global sequence)
CREATE SEQUENCE IF NOT EXISTS beneficiary_reg_seq START 1;

-- 4) Ensure registration_number unique
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_beneficiaries_registration_number_unique'
  ) THEN
    CREATE UNIQUE INDEX idx_beneficiaries_registration_number_unique ON beneficiaries(registration_number);
  END IF;
END$$;

-- 5) Create function to generate registration number in format AGE-YYYY-000001
CREATE OR REPLACE FUNCTION generate_registration_number()
RETURNS trigger AS $$
DECLARE
  seqval bigint;
  regnum text;
BEGIN
  IF NEW.registration_number IS NOT NULL AND NEW.registration_number <> '' THEN
    RETURN NEW;
  END IF;
  seqval := nextval('beneficiary_reg_seq');
  regnum := 'AGE-' || to_char(CURRENT_DATE,'YYYY') || '-' || lpad(seqval::text,6,'0');
  NEW.registration_number := regnum;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6) Attach trigger to beneficiaries table
DROP TRIGGER IF EXISTS trg_generate_registration_number ON beneficiaries;
CREATE TRIGGER trg_generate_registration_number BEFORE INSERT ON beneficiaries
FOR EACH ROW EXECUTE FUNCTION generate_registration_number();

-- 7) Basic audit logging table and trigger for beneficiaries
CREATE TABLE IF NOT EXISTS audit_logs (
  id bigserial PRIMARY KEY,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  performed_by text,
  changes jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION log_beneficiary_changes()
RETURNS trigger AS $$
DECLARE
  payload jsonb;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    payload := to_jsonb(NEW);
    INSERT INTO audit_logs(action, table_name, record_id, changes)
    VALUES('INSERT', TG_TABLE_NAME, NEW.id, payload);
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    payload := jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW));
    INSERT INTO audit_logs(action, table_name, record_id, changes)
    VALUES('UPDATE', TG_TABLE_NAME, NEW.id, payload);
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    payload := to_jsonb(OLD);
    INSERT INTO audit_logs(action, table_name, record_id, changes)
    VALUES('DELETE', TG_TABLE_NAME, OLD.id, payload);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_beneficiaries ON beneficiaries;
CREATE TRIGGER trg_audit_beneficiaries AFTER INSERT OR UPDATE OR DELETE ON beneficiaries
FOR EACH ROW EXECUTE FUNCTION log_beneficiary_changes();

-- 8) Optionally drop legacy columns (keep them commented for safety)
-- ALTER TABLE beneficiaries DROP COLUMN IF EXISTS middle_name;
-- ALTER TABLE beneficiaries DROP COLUMN IF EXISTS last_name;
-- ALTER TABLE beneficiaries DROP COLUMN IF EXISTS kebele;

COMMIT;

-- Notes:
-- - This migration preserves existing data by copying the old name columns into the new fields.
-- - Registration numbers will be generated automatically on insert using a global sequence. If you need yearly resetting counters, replace the sequence logic with a per-year counter table.
-- - Create a storage bucket named "beneficiary-photos" in Supabase storage and ensure public access or signed URLs as appropriate.
-- - Run this migration with a DB user that has ALTER TABLE privileges.

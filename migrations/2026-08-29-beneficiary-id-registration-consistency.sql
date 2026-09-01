BEGIN;

ALTER TABLE IF EXISTS beneficiaries
  ADD COLUMN IF NOT EXISTS region_code text;

-- Keep the existing registration_number as the only business identifier.
-- If a legacy beneficiary_id column exists, reconcile it into registration_number;
-- then remove the duplicate identifier column.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'beneficiaries'
      AND column_name = 'beneficiary_id'
  ) THEN
    UPDATE beneficiaries
    SET registration_number = COALESCE(NULLIF(trim(registration_number), ''), beneficiary_id)
    WHERE registration_number IS NULL OR registration_number = '';

    UPDATE beneficiaries
    SET registration_number = beneficiary_id
    WHERE registration_number IS NULL
      AND beneficiary_id IS NOT NULL
      AND trim(beneficiary_id) <> '';
  END IF;
END $$;

-- Normalize region-derived registration numbers to AG-B-<REGION>-NNNNNN.
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

CREATE TABLE IF NOT EXISTS beneficiary_identifier_counters (
  region_code text PRIMARY KEY,
  counter integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

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

CREATE OR REPLACE FUNCTION sync_registration_number()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_region_value text;
  v_generated text;
BEGIN
  -- Only registration_number is the business identifier.
  IF NEW.registration_number IS NULL OR trim(NEW.registration_number) = '' THEN
    v_region_value := COALESCE(NEW.region_code, NEW.region, 'GEN');
    v_generated := generate_beneficiary_registration_number(v_region_value);
    NEW.registration_number := v_generated;
    RETURN NEW;
  END IF;

  -- Preserve valid existing registration numbers.
  IF NEW.registration_number !~ '^AG-B-[A-Z]{2,5}-[0-9]{6}$' THEN
    v_region_value := COALESCE(NEW.region_code, NEW.region, 'GEN');
    v_generated := generate_beneficiary_registration_number(v_region_value);
    NEW.registration_number := v_generated;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_registration_number ON beneficiaries;
CREATE TRIGGER trg_sync_registration_number
BEFORE INSERT OR UPDATE OF registration_number, region, region_code
ON beneficiaries
FOR EACH ROW EXECUTE FUNCTION sync_registration_number();

DO $$
DECLARE
  rec record;
  v_generated text;
BEGIN
  FOR rec IN
    SELECT id, registration_number, region_code, region
    FROM beneficiaries
    WHERE registration_number IS NULL OR trim(registration_number) = ''
  LOOP
    v_generated := generate_beneficiary_registration_number(COALESCE(rec.region_code, rec.region, 'GEN'));
    UPDATE beneficiaries
    SET registration_number = v_generated
    WHERE id = rec.id;
  END LOOP;
END $$;

-- Remove legacy separate beneficiary_id column if present to prevent duplicate identifiers.
ALTER TABLE IF EXISTS beneficiaries
  DROP COLUMN IF EXISTS beneficiary_id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_beneficiaries_registration_number_unique
ON beneficiaries(registration_number)
WHERE registration_number IS NOT NULL;

COMMIT;

BEGIN;

ALTER TABLE IF EXISTS beneficiaries
  ADD COLUMN IF NOT EXISTS beneficiary_id text;

-- Normalize region code for the permanent identifier.
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

-- Single source of truth for the permanent identifier.
CREATE OR REPLACE FUNCTION generate_beneficiary_identifier(p_region text)
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

CREATE OR REPLACE FUNCTION sync_beneficiary_identifier()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_region_value text;
  v_generated text;
BEGIN
  IF NEW.beneficiary_id IS NULL AND NEW.registration_number IS NULL THEN
    v_region_value := COALESCE(NEW.region_code, NEW.region, 'GEN');
    v_generated := generate_beneficiary_identifier(v_region_value);
    NEW.beneficiary_id := v_generated;
    NEW.registration_number := v_generated;
    RETURN NEW;
  END IF;

  IF NEW.beneficiary_id IS NULL AND NEW.registration_number IS NOT NULL THEN
    NEW.beneficiary_id := NEW.registration_number;
    RETURN NEW;
  END IF;

  IF NEW.registration_number IS NULL AND NEW.beneficiary_id IS NOT NULL THEN
    NEW.registration_number := NEW.beneficiary_id;
    RETURN NEW;
  END IF;

  IF NEW.beneficiary_id <> NEW.registration_number THEN
    RAISE EXCEPTION 'beneficiary_id and registration_number must match exactly';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_beneficiary_identifier ON beneficiaries;
CREATE TRIGGER trg_sync_beneficiary_identifier
BEFORE INSERT OR UPDATE OF beneficiary_id, registration_number, region, region_code
ON beneficiaries
FOR EACH ROW EXECUTE FUNCTION sync_beneficiary_identifier();

DO $$
DECLARE
  rec record;
  v_generated text;
BEGIN
  FOR rec IN
    SELECT id, region_code, region, registration_number, beneficiary_id
    FROM beneficiaries
    WHERE beneficiary_id IS NULL
       OR registration_number IS NULL
       OR beneficiary_id <> registration_number
  LOOP
    IF rec.registration_number IS NULL AND rec.beneficiary_id IS NULL THEN
      SELECT generate_beneficiary_identifier(COALESCE(rec.region_code, rec.region, 'GEN'))
      INTO v_generated;

      UPDATE beneficiaries
      SET beneficiary_id = v_generated,
          registration_number = v_generated
      WHERE id = rec.id;
    ELSIF rec.registration_number IS NULL THEN
      UPDATE beneficiaries
      SET registration_number = rec.beneficiary_id
      WHERE id = rec.id;
    ELSIF rec.beneficiary_id IS NULL THEN
      UPDATE beneficiaries
      SET beneficiary_id = rec.registration_number
      WHERE id = rec.id;
    ELSE
      UPDATE beneficiaries
      SET beneficiary_id = rec.registration_number,
          registration_number = rec.registration_number
      WHERE id = rec.id;
    END IF;
  END LOOP;
END $$;

ALTER TABLE IF EXISTS beneficiaries
  ADD CONSTRAINT IF NOT EXISTS beneficiaries_identifier_consistency
  CHECK (beneficiary_id IS NULL OR registration_number IS NULL OR beneficiary_id = registration_number);

CREATE UNIQUE INDEX IF NOT EXISTS idx_beneficiaries_beneficiary_id_unique
ON beneficiaries(beneficiary_id)
WHERE beneficiary_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_beneficiaries_registration_number_unique
ON beneficiaries(registration_number)
WHERE registration_number IS NOT NULL;

COMMIT;

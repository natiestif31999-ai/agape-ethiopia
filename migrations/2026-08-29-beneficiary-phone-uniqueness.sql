BEGIN;

ALTER TABLE IF EXISTS beneficiaries
  ADD COLUMN IF NOT EXISTS phone_normalized text;

CREATE OR REPLACE FUNCTION normalize_ethiopian_phone(raw_phone text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  digits text;
BEGIN
  IF raw_phone IS NULL THEN
    RETURN NULL;
  END IF;

  digits := regexp_replace(raw_phone, '[^0-9]', '', 'g');
  IF digits = '' THEN
    RETURN NULL;
  END IF;

  IF digits LIKE '251%' THEN
    digits := substring(digits from 4);
  END IF;

  IF digits LIKE '0%' THEN
    digits := substring(digits from 2);
  END IF;

  IF length(digits) = 9 AND left(digits, 1) = '9' THEN
    RETURN '+251' || digits;
  END IF;

  RETURN NULL;
END;
$$;

UPDATE beneficiaries
SET phone_normalized = normalize_ethiopian_phone(phone)
WHERE phone_normalized IS NULL;

CREATE INDEX IF NOT EXISTS idx_beneficiaries_phone_normalized
ON beneficiaries(phone_normalized)
WHERE phone_normalized IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_beneficiaries_phone_normalized_unique
ON beneficiaries(phone_normalized)
WHERE phone_normalized IS NOT NULL;

CREATE OR REPLACE VIEW beneficiary_phone_conflicts AS
SELECT phone_normalized, COUNT(*) AS duplicate_count
FROM beneficiaries
WHERE phone_normalized IS NOT NULL
GROUP BY phone_normalized
HAVING COUNT(*) > 1;

COMMIT;

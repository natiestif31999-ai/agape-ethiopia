-- Concurrency test: simulate parallel inserts to verify registration generator uniqueness
-- WARNING: run this only in staging/test DB.

-- Use pg_sleep to simulate timing and insert multiple rows across multiple sessions.

BEGIN;

CREATE TEMP TABLE tmp_test_insert_results(
  id uuid,
  registration_number text
);

-- Insert loop: this is a simple single-session emulation; for real concurrency run multiple psql sessions in parallel.
DO $$
DECLARE
  i integer;
  rec RECORD;
BEGIN
  FOR i IN 1..50 LOOP
    INSERT INTO beneficiaries(first_name, registration_date, region_code)
    VALUES ('Test', CURRENT_DATE, 'TST')
    RETURNING id, registration_number INTO rec;

    INSERT INTO tmp_test_insert_results(id, registration_number) VALUES (rec.id, rec.registration_number);
  END LOOP;
END$$;

-- Inspect duplicates
SELECT registration_number, count(*) FROM tmp_test_insert_results GROUP BY registration_number HAVING count(*) > 1;

COMMIT;

-- For high-confidence concurrency testing, run multiple copies of this script in parallel shells.

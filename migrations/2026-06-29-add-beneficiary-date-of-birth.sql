-- Migration: add missing date_of_birth field to beneficiaries

BEGIN;

ALTER TABLE IF EXISTS beneficiaries
  ADD COLUMN IF NOT EXISTS date_of_birth date;

COMMIT;

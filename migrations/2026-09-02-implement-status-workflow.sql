-- Migration: Ensure Beneficiary Status Workflow is Properly Implemented
-- Date: 2026-09-02
-- Purpose: Guarantee status column exists with correct defaults and constraints
-- Safety: Non-destructive, idempotent

BEGIN;

-- ===================================================================
-- STEP 1: Ensure status column exists on beneficiaries
-- ===================================================================

ALTER TABLE IF EXISTS beneficiaries
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'Pending Review';

-- ===================================================================
-- STEP 2: Define valid status values as a check constraint
-- ===================================================================

-- Drop existing check constraint if it exists
ALTER TABLE IF EXISTS beneficiaries
  DROP CONSTRAINT IF EXISTS beneficiaries_status_check;

-- Add new check constraint for valid statuses
ALTER TABLE IF EXISTS beneficiaries
  ADD CONSTRAINT beneficiaries_status_check
  CHECK (status IN ('Pending Review', 'Approved', 'Rejected', 'On Hold', 'Archived'));

-- ===================================================================
-- STEP 3: Set default status for existing null entries
-- ===================================================================

UPDATE beneficiaries
SET status = 'Pending Review'
WHERE status IS NULL;

-- ===================================================================
-- STEP 4: Ensure updated_at timestamp is maintained
-- ===================================================================

-- This should already exist from schema setup, but ensure it's present
ALTER TABLE IF EXISTS beneficiaries
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create or replace update trigger
CREATE OR REPLACE FUNCTION update_beneficiaries_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_beneficiaries_updated_at ON beneficiaries;

CREATE TRIGGER trg_update_beneficiaries_updated_at
BEFORE UPDATE ON beneficiaries
FOR EACH ROW
EXECUTE FUNCTION update_beneficiaries_updated_at();

-- ===================================================================
-- STEP 5: Create index on status for faster filtering
-- ===================================================================

CREATE INDEX IF NOT EXISTS idx_beneficiaries_status
ON beneficiaries(status);

-- ===================================================================
-- STEP 6: Create a view for pending beneficiaries (for staff convenience)
-- ===================================================================

DROP VIEW IF EXISTS pending_beneficiaries CASCADE;

CREATE VIEW pending_beneficiaries AS
SELECT 
  id,
  registration_number,
  first_name,
  middle_name,
  last_name,
  phone,
  region,
  kebele,
  status,
  created_at,
  updated_at
FROM beneficiaries
WHERE status = 'Pending Review'
ORDER BY created_at ASC;

-- ===================================================================
-- STEP 7: Create a view for approved beneficiaries
-- ===================================================================

DROP VIEW IF EXISTS approved_beneficiaries CASCADE;

CREATE VIEW approved_beneficiaries AS
SELECT 
  id,
  registration_number,
  first_name,
  middle_name,
  last_name,
  phone,
  region,
  kebele,
  status,
  created_at,
  updated_at
FROM beneficiaries
WHERE status = 'Approved'
ORDER BY created_at DESC;

-- ===================================================================
-- STEP 8: Create audit log function for status changes
-- ===================================================================

CREATE OR REPLACE FUNCTION log_beneficiary_status_change()
RETURNS trigger AS $$
DECLARE
  v_audit_table text := 'beneficiary_audit_log';
BEGIN
  -- Only log if status changed
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    -- Check if audit table exists before logging
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = v_audit_table) THEN
      EXECUTE format('INSERT INTO %I (beneficiary_id, field_name, old_value, new_value, changed_at) VALUES ($1, $2, $3, $4, now())',
        v_audit_table)
      USING NEW.id, 'status', OLD.status, NEW.status;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_log_status_change ON beneficiaries;

CREATE TRIGGER trg_log_status_change
AFTER UPDATE OF status ON beneficiaries
FOR EACH ROW
EXECUTE FUNCTION log_beneficiary_status_change();

COMMIT;

-- NOTES:
-- - Status column defaults to 'Pending Review' for all new beneficiaries
-- - Valid statuses are: Pending Review, Approved, Rejected, On Hold, Archived
-- - Status changes are automatically logged if beneficiary_audit_log table exists
-- - pending_beneficiaries and approved_beneficiaries views provide convenient access
-- - updated_at timestamp is automatically maintained by trigger
-- - Index on status allows fast filtering/reporting

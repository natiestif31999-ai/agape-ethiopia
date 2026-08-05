-- Migration: Support tables for imports/exports/signatures/sync and wheelchair models
-- Non-destructive: creates new tables to prepare for import/export, signatures, offline sync, and equipment master data

BEGIN;

-- Imports / Import jobs metadata
CREATE TABLE IF NOT EXISTS import_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text,
  file_url text,
  uploader uuid,
  status text DEFAULT 'pending', -- pending, processing, completed, failed
  mapping jsonb, -- column mapping configuration
  summary jsonb,
  errors jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE IF EXISTS import_jobs
  ADD CONSTRAINT IF NOT EXISTS import_jobs_status_check CHECK (status in ('pending','processing','completed','failed'));

-- Exports / Report exports metadata
CREATE TABLE IF NOT EXISTS report_exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type text,
  parameters jsonb,
  file_url text,
  format text,
  requested_by uuid,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE IF EXISTS report_exports
  ADD CONSTRAINT IF NOT EXISTS report_exports_format_check CHECK (format in ('xlsx','csv','pdf'));

-- Delivery signatures (store signed data or URL reference)
CREATE TABLE IF NOT EXISTS delivery_signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_confirmation_id uuid REFERENCES delivery_confirmations(id) ON DELETE CASCADE,
  signer_type text, -- beneficiary | staff | partner
  signer_name text,
  signature_url text, -- storage object URL or signed URL
  signature_data text, -- optional base64 or JSON metadata (avoid storing large binaries here)
  created_at timestamptz DEFAULT now()
);

-- Offline sync queue for client devices
CREATE TABLE IF NOT EXISTS sync_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_type text NOT NULL, -- e.g., 'insert_beneficiary','update_assessment'
  payload jsonb NOT NULL,
  source_device text,
  status text DEFAULT 'pending', -- pending, processing, synced, failed
  attempts integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE IF EXISTS sync_queue
  ADD CONSTRAINT IF NOT EXISTS sync_queue_status_check CHECK (status in ('pending','processing','synced','failed'));

-- Wheelchair / equipment master tables for consistent dropdowns and recommendations
CREATE TABLE IF NOT EXISTS wheelchair_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name text NOT NULL,
  device_type text, -- adult_wheelchair, children_wheelchair, crutches, walker
  default_size text,
  attributes jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS guardians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid REFERENCES beneficiaries(id) ON DELETE CASCADE,
  name text,
  relation text,
  phone text,
  address text,
  created_at timestamptz DEFAULT now()
);

-- Ensure indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_import_jobs_uploader ON import_jobs(uploader);
CREATE INDEX IF NOT EXISTS idx_report_exports_requested_by ON report_exports(requested_by);
CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status);
CREATE INDEX IF NOT EXISTS idx_wheelchair_models_type ON wheelchair_models(device_type);

COMMIT;

-- NOTES:
-- - These support tables enable safe import/export workflows, offline queueing, signature storage references, and a wheelchair models catalog.
-- - None of these changes remove or rename existing columns; they only add new tables/columns.

BEGIN;

-- Add additional wheelchair measurement fields to the existing assessments table
ALTER TABLE IF EXISTS assessments
  ADD COLUMN IF NOT EXISTS seat_width text,
  ADD COLUMN IF NOT EXISTS armrest_height text,
  ADD COLUMN IF NOT EXISTS footrest_length text,
  ADD COLUMN IF NOT EXISTS overall_height text,
  ADD COLUMN IF NOT EXISTS weight text;

-- Create delivery confirmations table to record wheelchair deliveries and signatures
CREATE TABLE IF NOT EXISTS delivery_confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid REFERENCES beneficiaries(id) ON DELETE SET NULL,
  beneficiary_name text,
  registration_number text,
  gender text,
  phone text,
  address text,
  wheelchair_type text,
  wheelchair_size text,
  serial_number text,
  delivery_date date DEFAULT CURRENT_DATE,
  beneficiary_signature text,
  partner_signature text,
  created_by uuid,
  created_at timestamptz DEFAULT now()
);

-- Organizations and agreements
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text,
  contact_name text,
  contact_phone text,
  contact_email text,
  address text,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS organization_agreements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  bucket text,
  object_path text,
  uploaded_by uuid,
  uploaded_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_delivery_confirmations_beneficiary ON delivery_confirmations(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_organization_agreements_org ON organization_agreements(organization_id);

-- Enable RLS and add conservative policies mirroring other tables
ALTER TABLE IF EXISTS delivery_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS organization_agreements ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'delivery_confirmations' AND policyname = 'delivery_confirmations_access_authenticated') THEN
    CREATE POLICY delivery_confirmations_access_authenticated ON delivery_confirmations FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'organizations' AND policyname = 'organizations_access_authenticated') THEN
    CREATE POLICY organizations_access_authenticated ON organizations FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'organization_agreements' AND policyname = 'organization_agreements_access_authenticated') THEN
    CREATE POLICY organization_agreements_access_authenticated ON organization_agreements FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
END$$;

COMMIT;

-- NOTE: Create a Supabase storage bucket named "organization-agreements" and ensure proper permissions. This cannot always be created via SQL depending on Supabase setup; create it via the Supabase dashboard or CLI if needed.

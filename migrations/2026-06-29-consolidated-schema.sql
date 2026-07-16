BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

ALTER TABLE IF EXISTS beneficiaries
  ADD COLUMN IF NOT EXISTS registration_number text,
  ADD COLUMN IF NOT EXISTS registration_date date DEFAULT CURRENT_DATE,

  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS Father's_name text,
  ADD COLUMN IF NOT EXISTS last_name text,

  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS gender text,

  ADD COLUMN IF NOT EXISTS phone text,

  ADD COLUMN IF NOT EXISTS region text,
  ADD COLUMN IF NOT EXISTS kifle_ketema text,
  ADD COLUMN IF NOT EXISTS kebele text,
  ADD COLUMN IF NOT EXISTS house_number text,

  ADD COLUMN IF NOT EXISTS disability_type text,
  ADD COLUMN IF NOT EXISTS referral_source text,

  ADD COLUMN IF NOT EXISTS photo_url text,

  ADD COLUMN IF NOT EXISTS notes text,

  ADD COLUMN IF NOT EXISTS status text DEFAULT 'registered',
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid REFERENCES beneficiaries(id) ON DELETE CASCADE,
  hip_width text,
  seat_depth text,
  back_height text,
  measurements text,
  wheelchair_fit text,
  recommended_equipment text,
  recommended_size text,
  assessor_name text,
  assessment_date date DEFAULT CURRENT_DATE,
  recommendations text,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS equipment_distributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid REFERENCES beneficiaries(id) ON DELETE CASCADE,
  equipment_type text NOT NULL,
  equipment_size text,
  distribution_date date DEFAULT CURRENT_DATE,
  distribution_location text,
  received_by text,
  signature_confirmed boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name text NOT NULL,
  item_type text NOT NULL,
  quantity integer DEFAULT 0,
  unit text,
  status text DEFAULT 'available',
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS follow_ups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid REFERENCES beneficiaries(id) ON DELETE CASCADE,
  follow_up_date date NOT NULL,
  status text DEFAULT 'scheduled',
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_name text,
  item_needed text,
  need_details text,
  beneficiary_id uuid REFERENCES beneficiaries(id) ON DELETE SET NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name text,
  item_type text,
  quantity integer DEFAULT 0,
  status text DEFAULT 'available',
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  email text,
  role text DEFAULT 'Staff',
  is_disabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id text,
  action text NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_beneficiaries_registration_number_unique'
  ) THEN
    CREATE UNIQUE INDEX idx_beneficiaries_registration_number_unique ON beneficiaries(registration_number);
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS idx_assessments_beneficiary ON assessments(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_equipment_distributions_beneficiary ON equipment_distributions(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory(status);
CREATE INDEX IF NOT EXISTS idx_followups_beneficiary ON follow_ups(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_beneficiaries_updated_at ON beneficiaries;
CREATE TRIGGER trg_beneficiaries_updated_at
BEFORE UPDATE ON beneficiaries
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_site_settings_updated_at ON site_settings;
CREATE TRIGGER trg_site_settings_updated_at
BEFORE UPDATE ON site_settings
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'beneficiaries' AND policyname = 'beneficiaries_select_all') THEN
    CREATE POLICY beneficiaries_select_all ON beneficiaries FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'beneficiaries' AND policyname = 'beneficiaries_insert_all') THEN
    CREATE POLICY beneficiaries_insert_all ON beneficiaries FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'beneficiaries' AND policyname = 'beneficiaries_update_authenticated') THEN
    CREATE POLICY beneficiaries_update_authenticated ON beneficiaries FOR UPDATE USING (auth.role() = 'authenticated');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'assessments' AND policyname = 'assessments_access_authenticated') THEN
    CREATE POLICY assessments_access_authenticated ON assessments FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'equipment_distributions' AND policyname = 'equipment_distributions_access_authenticated') THEN
    CREATE POLICY equipment_distributions_access_authenticated ON equipment_distributions FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'inventory' AND policyname = 'inventory_access_authenticated') THEN
    CREATE POLICY inventory_access_authenticated ON inventory FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'follow_ups' AND policyname = 'follow_ups_access_authenticated') THEN
    CREATE POLICY follow_ups_access_authenticated ON follow_ups FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'requests' AND policyname = 'requests_access_authenticated') THEN
    CREATE POLICY requests_access_authenticated ON requests FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'donations' AND policyname = 'donations_access_authenticated') THEN
    CREATE POLICY donations_access_authenticated ON donations FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'users' AND policyname = 'users_access_authenticated') THEN
    CREATE POLICY users_access_authenticated ON users FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'site_settings' AND policyname = 'site_settings_access_authenticated') THEN
    CREATE POLICY site_settings_access_authenticated ON site_settings FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'audit_logs' AND policyname = 'audit_logs_access_authenticated') THEN
    CREATE POLICY audit_logs_access_authenticated ON audit_logs FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
END$$;

COMMIT;

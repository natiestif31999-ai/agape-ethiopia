# 🚀 Apply Supabase Schema Migrations

## Problem
Your Supabase database is missing the `date_of_birth` column and other fields needed by the application.

## Solution
Apply the consolidated schema migration to fix all schema issues at once.

---

## Step 1: Open Supabase SQL Editor

1. Go to: https://app.supabase.com
2. Select your project: **rrejnfpvspjnpisgdhmb**
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**

---

## Step 2: Copy & Paste the Migration

Copy the SQL code below and paste it into the SQL Editor:

```sql
BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Add missing columns to beneficiaries table
ALTER TABLE IF EXISTS beneficiaries
  ADD COLUMN IF NOT EXISTS registration_number text,
  ADD COLUMN IF NOT EXISTS registration_date date DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS middle_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS kebele text,
  ADD COLUMN IF NOT EXISTS house_number text,
  ADD COLUMN IF NOT EXISTS photo_url text,
  ADD COLUMN IF NOT EXISTS disability_type text,
  ADD COLUMN IF NOT EXISTS referral_source text,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'registered',
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create assessments table
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

-- Create equipment_distributions table
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

-- Create inventory table
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

-- Create follow_ups table
CREATE TABLE IF NOT EXISTS follow_ups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid REFERENCES beneficiaries(id) ON DELETE CASCADE,
  follow_up_date date NOT NULL,
  status text DEFAULT 'scheduled',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create requests table
CREATE TABLE IF NOT EXISTS requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_name text,
  item_needed text,
  need_details text,
  beneficiary_id uuid REFERENCES beneficiaries(id) ON DELETE SET NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name text,
  item_type text,
  quantity integer DEFAULT 0,
  status text DEFAULT 'available',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create users table (if not exists)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  email text,
  role text DEFAULT 'Staff',
  is_disabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id text,
  action text NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create unique index for registration_number
CREATE UNIQUE INDEX IF NOT EXISTS idx_beneficiaries_registration_number_unique ON beneficiaries(registration_number);

-- Create other indexes
CREATE INDEX IF NOT EXISTS idx_assessments_beneficiary ON assessments(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_equipment_distributions_beneficiary ON equipment_distributions(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory(status);
CREATE INDEX IF NOT EXISTS idx_followups_beneficiary ON follow_ups(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach triggers
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

COMMIT;
```

---

## Step 3: Execute the Migration

1. Click the blue **Run** button (or press `Ctrl+Enter`)
2. Wait for it to complete (should see "Query succeeded")
3. ✅ All missing columns are now created!

---

## Step 4: Verify the Schema

1. Click **Table Editor** (left sidebar)
2. Select **beneficiaries** table
3. You should see all these columns:
   - ✅ `id`
   - ✅ `first_name`
   - ✅ `last_name`
   - ✅ `middle_name`
   - ✅ `date_of_birth` ← **This was missing!**
   - ✅ `gender`
   - ✅ `phone`
   - ✅ `region`
   - ✅ `kebele`
   - ✅ `house_number`
   - ✅ `registration_number`
   - ✅ `registration_date`
   - ✅ `photo_url`
   - ✅ `status`
   - ✅ `created_at`
   - ✅ `updated_at`

---

## Step 5: Test Registration

1. Start the dev server: `npm run dev`
2. Open http://localhost:3000
3. Navigate to **Register Beneficiary**
4. Fill in the form and submit
5. ✅ Should work without errors now!

---

## Why Did This Happen?

Your migration files exist locally, but they haven't been applied to your Supabase database. This is normal - you need to manually run migrations in Supabase's SQL editor.

---

## Prevent This In The Future

Create a `.sql` migration file in your project root for any future schema changes, then apply them the same way.

**Migration File Pattern:**
```
migrations/YYYY-MM-DD-description.sql
```

Example:
- `2026-06-29-add-beneficiary-date-of-birth.sql` ← Already exists!
- `2026-06-29-consolidated-schema.sql` ← Already exists!

Just need to run them in Supabase! 🚀


# ⚡ Quick Fix Guide - 5 Minutes

## The Error
```
Submission failed: Could not find the 'date_of_birth' column of 'beneficiaries' in the schema cache
```

## The Cause
Your Supabase database is missing the `date_of_birth` column.

---

## 🎯 Fix It Now (Copy & Paste)

### Step 1: Go to Supabase
https://app.supabase.com → Select your project → **SQL Editor** → **New Query**

### Step 2: Copy This SQL

```sql
BEGIN;

-- Add missing columns to beneficiaries table
ALTER TABLE beneficiaries
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS middle_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS kebele text,
  ADD COLUMN IF NOT EXISTS house_number text,
  ADD COLUMN IF NOT EXISTS photo_url text,
  ADD COLUMN IF NOT EXISTS disability_type text,
  ADD COLUMN IF NOT EXISTS referral_source text,
  ADD COLUMN IF NOT EXISTS registration_number text,
  ADD COLUMN IF NOT EXISTS registration_date date DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'registered',
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

COMMIT;
```

### Step 3: Run It
Paste into SQL Editor → Click **Run** button

### Step 4: Verify
Click **Table Editor** → Select **beneficiaries** → Check columns exist ✅

### Step 5: Test
Go back to app, test registration, it should work! 🎉

---

## That's It!

Your registration form should now work without the `date_of_birth` error.

**Need the full migration with all tables?** See [MIGRATION_INSTRUCTIONS.md](MIGRATION_INSTRUCTIONS.md)

---

## 📝 Remember
- Migrations are in `/migrations/` folder
- Apply them manually in Supabase SQL Editor
- Check that columns exist after applying


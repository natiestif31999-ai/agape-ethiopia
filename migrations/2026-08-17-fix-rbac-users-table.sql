-- Migration: Fix RBAC Users Table Schema
-- Date: 2026-08-17
-- Purpose: Ensure every authenticated Supabase user has a matching public.users profile row
--          with the RBAC columns required by the app.
-- Status: Critical - required for authentication and dashboard routing.

BEGIN;

CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY,
  email text,
  role text DEFAULT 'Staff' CHECK (role IN ('Admin', 'Staff')),
  is_disabled boolean DEFAULT false,
  password_change_required boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE IF EXISTS public.users
  ADD COLUMN IF NOT EXISTS role text DEFAULT 'Staff';

ALTER TABLE IF EXISTS public.users
  ADD COLUMN IF NOT EXISTS is_disabled boolean DEFAULT false;

ALTER TABLE IF EXISTS public.users
  ADD COLUMN IF NOT EXISTS password_change_required boolean DEFAULT false;

ALTER TABLE IF EXISTS public.users
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

ALTER TABLE IF EXISTS public.users
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'users_role_check'
  ) THEN
    ALTER TABLE public.users
      ADD CONSTRAINT users_role_check CHECK (role IN ('Admin', 'Staff'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'users_email_key'
  ) THEN
    CREATE UNIQUE INDEX users_email_key ON public.users(email);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_disabled ON public.users(is_disabled);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_select_self ON public.users;
DROP POLICY IF EXISTS users_select_admin ON public.users;
DROP POLICY IF EXISTS users_update_self ON public.users;
DROP POLICY IF EXISTS users_update_admin ON public.users;

CREATE POLICY users_select_self ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY users_select_admin ON public.users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users admin
      WHERE admin.id = auth.uid()
        AND admin.role = 'Admin'
        AND admin.is_disabled = false
    )
  );

CREATE POLICY users_update_self ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY users_update_admin ON public.users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users admin
      WHERE admin.id = auth.uid()
        AND admin.role = 'Admin'
        AND admin.is_disabled = false
    )
  );

UPDATE public.users
SET role = 'Staff'
WHERE role IS NULL;

UPDATE public.users
SET is_disabled = false
WHERE is_disabled IS NULL;

UPDATE public.users
SET password_change_required = false
WHERE password_change_required IS NULL;

UPDATE public.users
SET updated_at = COALESCE(updated_at, created_at, now())
WHERE updated_at IS NULL;

INSERT INTO public.users (id, email, role, is_disabled, password_change_required)
SELECT
  au.id,
  au.email,
  CASE
    WHEN au.email = 'admin@agapeethiopia.org' THEN 'Admin'
    ELSE 'Staff'
  END,
  false,
  false
FROM auth.users au
WHERE au.email IN (
  'admin@agapeethiopia.org',
  'natiestif31999@gmail.com',
  'agape@gmail.com',
  'natiestif@gmail.com'
)
ON CONFLICT (id) DO UPDATE
SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  is_disabled = EXCLUDED.is_disabled,
  password_change_required = EXCLUDED.password_change_required,
  updated_at = now();

COMMIT;

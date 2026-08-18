-- Migration: Fix recursive public.users RLS and preserve real profiles
-- Date: 2026-08-18
-- Purpose: Remove recursive users policies and replace them with safe, authenticated-only
--          access patterns. Keep the real Supabase auth users and public.users rows intact.

BEGIN;

-- -----------------------------------------------------------------------------
-- 0) Ensure the table and required columns exist.
-- -----------------------------------------------------------------------------
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

ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 1) Remove legacy recursive helpers/policies if they exist.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS users_select_self ON public.users;
DROP POLICY IF EXISTS users_select_admin ON public.users;
DROP POLICY IF EXISTS users_update_self ON public.users;
DROP POLICY IF EXISTS users_update_admin ON public.users;
DROP POLICY IF EXISTS users_insert_admin ON public.users;
DROP POLICY IF EXISTS users_delete_admin ON public.users;

DROP FUNCTION IF EXISTS auth.is_admin();
DROP FUNCTION IF EXISTS auth.is_staff();
DROP FUNCTION IF EXISTS public.get_current_user_role();
DROP FUNCTION IF EXISTS public.is_current_user_admin();

-- -----------------------------------------------------------------------------
-- 2) Create secure role helper functions.
--    These are SECURITY DEFINER and fixed search_path, so they do not recursively
--    trigger the public.users RLS policy evaluation.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid()
      AND u.role = 'Admin'
      AND u.is_disabled = false
  );
$$;

CREATE OR REPLACE FUNCTION auth.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid()
      AND u.is_disabled = false
      AND u.role IN ('Staff', 'Admin')
  );
$$;

REVOKE ALL ON FUNCTION auth.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION auth.is_staff() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION auth.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION auth.is_staff() TO authenticated;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog, auth
AS $$
  SELECT u.role::text
  FROM public.users u
  WHERE u.id = auth.uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog, auth
AS $$
  SELECT COALESCE(public.get_current_user_role(), '') = 'Admin';
$$;

REVOKE ALL ON FUNCTION public.get_current_user_role() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_current_user_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_current_user_admin() TO authenticated;

-- -----------------------------------------------------------------------------
-- 3) Safe public.users policies.
--    Policies must avoid direct recursive queries against public.users.
--    The only direct comparison is auth.uid() = id.
-- -----------------------------------------------------------------------------
CREATE POLICY users_select_self
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY users_select_admin
ON public.users
FOR SELECT
TO authenticated
USING (auth.is_admin());

CREATE POLICY users_update_self
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND role = public.get_current_user_role()
);

CREATE POLICY users_update_admin
ON public.users
FOR UPDATE
TO authenticated
USING (auth.is_admin())
WITH CHECK (auth.is_admin());

CREATE POLICY users_insert_admin
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.is_admin());

CREATE POLICY users_delete_admin
ON public.users
FOR DELETE
TO authenticated
USING (auth.is_admin());

-- -----------------------------------------------------------------------------
-- 4) Preserve known real user rows without querying auth.users from SQL.
--    If a profile row is missing, it should be created by the application after a
--    valid authenticated user is present; do not insert fake rows here.
-- -----------------------------------------------------------------------------
UPDATE public.users
SET role = 'Admin',
    is_disabled = false,
    password_change_required = false,
    updated_at = now()
WHERE lower(email) = 'admin@agapeethiopia.org'
  AND role IS DISTINCT FROM 'Admin';

UPDATE public.users
SET role = 'Staff',
    is_disabled = false,
    password_change_required = false,
    updated_at = now()
WHERE lower(email) IN (
  'natiestif31999@gmail.com',
  'agape@gmail.com',
  'natiestif@gmail.com'
)
AND role IS DISTINCT FROM 'Staff';

COMMIT;

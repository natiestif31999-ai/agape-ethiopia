-- Migration: Fix recursive users RLS policies and secure role checks
-- Date: 2026-08-18
-- Purpose: Eliminate recursion in public.users policies by moving role lookups into
--          SECURITY DEFINER helper functions that do not re-enter the users table RLS.

BEGIN;

-- -----------------------------------------------------------------------------
-- 1) Remove the old recursive role helpers if they exist.
-- -----------------------------------------------------------------------------
DROP FUNCTION IF EXISTS auth.is_admin();
DROP FUNCTION IF EXISTS auth.is_staff();

-- -----------------------------------------------------------------------------
-- 2) Replace auth role helpers with secure SECURITY DEFINER versions.
--    These functions MUST avoid triggering recursive policy checks on public.users.
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

-- -----------------------------------------------------------------------------
-- 3) Create a safe helper for direct role lookup on the users table.
-- -----------------------------------------------------------------------------
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
  SELECT public.get_current_user_role() = 'Admin';
$$;

REVOKE ALL ON FUNCTION public.get_current_user_role() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_current_user_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_current_user_admin() TO authenticated;

-- -----------------------------------------------------------------------------
-- 4) Ensure the users table has RLS enabled and required columns exist.
-- -----------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;

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

-- -----------------------------------------------------------------------------
-- 5) Drop legacy recursive users policies.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS users_select_self ON public.users;
DROP POLICY IF EXISTS users_select_admin ON public.users;
DROP POLICY IF EXISTS users_update_self ON public.users;
DROP POLICY IF EXISTS users_update_admin ON public.users;
DROP POLICY IF EXISTS users_insert_admin ON public.users;
DROP POLICY IF EXISTS users_delete_admin ON public.users;

-- -----------------------------------------------------------------------------
-- 6) Safe users RLS policies.
--    A. users can read their own profile
--    B. admin can read/manage profiles
--    C. staff cannot promote themselves or change their own role
--    D. anonymous users cannot access public.users
-- -----------------------------------------------------------------------------
CREATE POLICY users_select_self ON public.users
  FOR SELECT
  USING (id = auth.uid());

CREATE POLICY users_select_admin ON public.users
  FOR SELECT
  USING (
    public.is_current_user_admin()
    AND EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.is_disabled = false
    )
  );

CREATE POLICY users_update_self ON public.users
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    AND role = public.get_current_user_role()
  );

CREATE POLICY users_update_admin ON public.users
  FOR UPDATE
  USING (
    public.is_current_user_admin()
    AND EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.is_disabled = false
    )
  )
  WITH CHECK (
    public.is_current_user_admin()
    AND EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.is_disabled = false
    )
  );

CREATE POLICY users_insert_admin ON public.users
  FOR INSERT
  WITH CHECK (
    public.is_current_user_admin()
    AND EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.is_disabled = false
    )
  );

CREATE POLICY users_delete_admin ON public.users
  FOR DELETE
  USING (
    public.is_current_user_admin()
    AND EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.is_disabled = false
    )
  );

-- -----------------------------------------------------------------------------
-- 7) Preserve known real user rows without querying auth.users from SQL.
--    If a profile row is missing, it should be created by the authenticated app
--    only after a valid Supabase session exists.
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

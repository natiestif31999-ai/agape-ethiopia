-- Safe verification SQL for the users RLS repair.
-- This does not require querying auth.users directly.

SELECT 'public.users table exists' AS check_name,
       to_regclass('public.users') IS NOT NULL AS ok;

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'users'
ORDER BY ordinal_position;

SELECT COUNT(*) AS users_row_count
FROM public.users;

SELECT role, COUNT(*) AS row_count
FROM public.users
GROUP BY role
ORDER BY role;

SELECT relname, relrowsecurity
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname = 'users';

SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'users'
ORDER BY policyname;

SELECT id, email, role, is_disabled, password_change_required
FROM public.users
WHERE email IN (
  'admin@agapeethiopia.org',
  'natiestif31999@gmail.com',
  'agape@gmail.com',
  'natiestif@gmail.com'
)
ORDER BY email;

SELECT EXISTS (
  SELECT 1
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'users'
    AND (qual ILIKE '%public.users%' OR with_check ILIKE '%public.users%')
) AS recursive_policy_present;

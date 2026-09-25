-- Restrict CMS writes and unpublished post access to Admins.
-- This migration does not alter tables, data, grants, or authentication objects.

BEGIN;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS site_settings_access_authenticated ON public.site_settings;
DROP POLICY IF EXISTS site_settings_select_authenticated ON public.site_settings;
DROP POLICY IF EXISTS site_settings_insert_authenticated ON public.site_settings;
DROP POLICY IF EXISTS site_settings_update_authenticated ON public.site_settings;
DROP POLICY IF EXISTS site_settings_delete_authenticated ON public.site_settings;
DROP POLICY IF EXISTS site_settings_public_select ON public.site_settings;
DROP POLICY IF EXISTS site_settings_admin_select ON public.site_settings;
DROP POLICY IF EXISTS site_settings_admin_insert ON public.site_settings;
DROP POLICY IF EXISTS site_settings_admin_update ON public.site_settings;
DROP POLICY IF EXISTS site_settings_delete_admin ON public.site_settings;
DROP POLICY IF EXISTS site_settings_admin_manage ON public.site_settings;

CREATE POLICY site_settings_public_select
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY site_settings_admin_manage
  ON public.site_settings FOR ALL
  TO authenticated
  USING (auth.is_admin())
  WITH CHECK (auth.is_admin());

DROP POLICY IF EXISTS blog_posts_staff_manage ON public.blog_posts;
DROP POLICY IF EXISTS blog_posts_access_authenticated ON public.blog_posts;
DROP POLICY IF EXISTS blog_posts_select_authenticated ON public.blog_posts;
DROP POLICY IF EXISTS blog_posts_insert_authenticated ON public.blog_posts;
DROP POLICY IF EXISTS blog_posts_update_authenticated ON public.blog_posts;
DROP POLICY IF EXISTS blog_posts_delete_authenticated ON public.blog_posts;
DROP POLICY IF EXISTS blog_posts_public_select ON public.blog_posts;
DROP POLICY IF EXISTS blog_posts_admin_select ON public.blog_posts;
DROP POLICY IF EXISTS blog_posts_admin_manage ON public.blog_posts;

CREATE POLICY blog_posts_public_select
  ON public.blog_posts FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY blog_posts_admin_select
  ON public.blog_posts FOR SELECT
  TO authenticated
  USING (auth.is_admin());

CREATE POLICY blog_posts_admin_manage
  ON public.blog_posts FOR ALL
  TO authenticated
  USING (auth.is_admin())
  WITH CHECK (auth.is_admin());

COMMIT;

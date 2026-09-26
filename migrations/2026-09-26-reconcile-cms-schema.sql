-- Reconcile the live CMS schema with the existing Agape web application.
-- Safe for the legacy site_settings table: existing key/value rows are preserved.
-- This migration is additive and must be applied after reviewing the production diff.

BEGIN;

-- Create the table for fresh environments; this is a no-op on the existing table.
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text,
  description text,
  category text DEFAULT 'general',
  is_json boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Upgrade the older live table without replacing it or touching existing values.
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS category text DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS is_json boolean DEFAULT false;

-- Restore intended category metadata for the existing About keys only.
UPDATE public.site_settings
SET category = 'about'
WHERE key IN ('about_content', 'about_mission', 'about_title', 'about_vision')
  AND category = 'general';

INSERT INTO public.site_settings (key, value, category, description, is_json) VALUES
  ('homepage_hero_title', 'AGAPE MOBILITY ETHIOPIA', 'homepage', 'Hero section title', false),
  ('homepage_hero_subtitle', 'Supporting mobility, dignity, and inclusive access for persons with disabilities across Ethiopia.', 'homepage', 'Hero section subtitle', false),
  ('homepage_visit_us', '{"title":"Visit Us","description":"Meet our team and learn how we support mobility and inclusion across Ethiopia.","address":"Addis Ababa, Ethiopia","phone":"+251 900 000 000","email":"info@agapeethiopia.org","hours":"Mon-Sat | 8:00 AM - 5:00 PM"}', 'homepage', 'Visit Us section content', true),
  ('homepage_social_links', '{"facebook":"","instagram":"","linkedin":"","x":"","tiktok":"","telegram":"","youtube":""}', 'homepage', 'Social media links', true),
  ('homepage_beneficiary_count', '1,200+', 'homepage', 'Homepage beneficiaries-supported statistic', false),
  ('homepage_partner_count', '35+', 'homepage', 'Homepage partner-network statistic', false),
  ('about_title', 'About AGAPE Mobility Ethiopia', 'about', 'About page title', false),
  ('about_mission', 'To provide comprehensive mobility solutions and support for persons with disabilities across Ethiopia.', 'about', 'Mission statement', false),
  ('about_vision', 'A world where persons with disabilities have full access to mobility, dignity, and equal participation in society.', 'about', 'Vision statement', false),
  ('about_content', 'AGAPE Mobility Ethiopia is committed to providing quality equipment, assessments, and support services.', 'about', 'About page main content', false),
  ('about_social_links', '{"facebook":"","instagram":"","linkedin":"","x":"","tiktok":"","telegram":"","youtube":""}', 'about', 'About page social links', true),
  ('site_name', 'AGAPE MOBILITY ETHIOPIA', 'general', 'Organization name', false),
  ('site_email', 'info@agapeethiopia.org', 'general', 'Organization email', false),
  ('site_phone', '+251 900 000 000', 'general', 'Organization phone', false),
  ('site_logo_url', '/agape-logo.jpg', 'general', 'Logo URL', false)
ON CONFLICT (key) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  content text,
  excerpt text,
  featured_image_url text,
  author_id uuid,
  status text DEFAULT 'draft',
  is_featured boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_site_settings_category ON public.site_settings(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_featured ON public.blog_posts(is_featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);

CREATE OR REPLACE FUNCTION public.update_site_settings_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $$
BEGIN
  NEW.updated_at = pg_catalog.now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER trg_update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.update_site_settings_updated_at();

CREATE OR REPLACE FUNCTION public.update_blog_posts_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $$
BEGIN
  NEW.updated_at = pg_catalog.now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER trg_update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.update_blog_posts_updated_at();

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Remove known permissive/obsolete CMS policies before creating the final policy set.
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
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

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
  USING (public.is_admin_user());

CREATE POLICY blog_posts_admin_manage
  ON public.blog_posts FOR ALL
  TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Explicit, least-privilege Data API access for these two CMS relations.
REVOKE ALL PRIVILEGES ON TABLE public.site_settings FROM PUBLIC, anon, authenticated, service_role;
GRANT SELECT ON TABLE public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.site_settings TO authenticated;

REVOKE ALL PRIVILEGES ON TABLE public.blog_posts FROM PUBLIC, anon, authenticated, service_role;
GRANT SELECT ON TABLE public.blog_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.blog_posts TO authenticated;

COMMIT;

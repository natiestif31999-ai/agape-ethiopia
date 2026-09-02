-- Migration: Create site_settings table for CMS/Admin content management
-- Date: 2026-09-02
-- Purpose: Enable Admin to manage Home page, About page, blog posts, and social media links
-- Safety: Non-destructive, creates only if not exists

BEGIN;

-- ===================================================================
-- STEP 1: Create site_settings table
-- ===================================================================

CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text,
  description text,
  category text DEFAULT 'general',
  is_json boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ===================================================================
-- STEP 2: Insert default site settings
-- ===================================================================

INSERT INTO site_settings (key, value, category, description, is_json) VALUES
  ('homepage_hero_title', 'AGAPE MOBILITY ETHIOPIA', 'homepage', 'Hero section title', false),
  ('homepage_hero_subtitle', 'Supporting mobility, dignity, and inclusive access for persons with disabilities across Ethiopia.', 'homepage', 'Hero section subtitle', false),
  ('homepage_visit_us', '{"title":"Visit Us","description":"Meet our team and learn how we support mobility and inclusion across Ethiopia.","address":"Addis Ababa, Ethiopia","phone":"+251 900 000 000","email":"info@agapeethiopia.org","hours":"Mon–Sat | 8:00 AM – 5:00 PM"}', 'homepage', 'Visit Us section content', true),
  ('homepage_social_links', '{"facebook":"","instagram":"","linkedin":"","tiktok":"","telegram":"","youtube":""}', 'homepage', 'Social media links', true),
  ('about_title', 'About AGAPE Mobility Ethiopia', 'about', 'About page title', false),
  ('about_mission', 'To provide comprehensive mobility solutions and support for persons with disabilities across Ethiopia.', 'about', 'Mission statement', false),
  ('about_vision', 'A world where persons with disabilities have full access to mobility, dignity, and equal participation in society.', 'about', 'Vision statement', false),
  ('about_content', 'AGAPE Mobility Ethiopia is committed to providing quality equipment, assessments, and support services.', 'about', 'About page main content', false),
  ('about_social_links', '{"facebook":"","instagram":"","linkedin":"","tiktok":"","telegram":"","youtube":""}', 'about', 'About page social links', true),
  ('site_name', 'AGAPE MOBILITY ETHIOPIA', 'general', 'Organization name', false),
  ('site_email', 'info@agapeethiopia.org', 'general', 'Organization email', false),
  ('site_phone', '+251 900 000 000', 'general', 'Organization phone', false),
  ('site_logo_url', '/agape-logo.jpg', 'general', 'Logo URL', false)
ON CONFLICT (key) DO NOTHING;

-- ===================================================================
-- STEP 3: Create blog_posts table for homepage blog/news
-- ===================================================================

CREATE TABLE IF NOT EXISTS blog_posts (
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

-- ===================================================================
-- STEP 4: Create update triggers for timestamps
-- ===================================================================

CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_site_settings_updated_at ON site_settings;

CREATE TRIGGER trg_update_site_settings_updated_at
BEFORE UPDATE ON site_settings
FOR EACH ROW
EXECUTE FUNCTION update_site_settings_updated_at();

CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_blog_posts_updated_at ON blog_posts;

CREATE TRIGGER trg_update_blog_posts_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_blog_posts_updated_at();

-- ===================================================================
-- STEP 5: Create indexes for better performance
-- ===================================================================

CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
CREATE INDEX IF NOT EXISTS idx_site_settings_category ON site_settings(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_featured ON blog_posts(is_featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);

-- ===================================================================
-- STEP 6: Enable RLS on content tables
-- ===================================================================

ALTER TABLE IF EXISTS site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can read published site settings
DROP POLICY IF EXISTS site_settings_public_select ON site_settings;
CREATE POLICY site_settings_public_select ON site_settings 
  FOR SELECT 
  USING (true);

-- Admin only can manage site settings
DROP POLICY IF EXISTS site_settings_admin_manage ON site_settings;
CREATE POLICY site_settings_admin_manage ON site_settings 
  FOR ALL 
  USING (auth.is_admin())
  WITH CHECK (auth.is_admin());

-- Public can read published blog posts
DROP POLICY IF EXISTS blog_posts_public_select ON blog_posts;
CREATE POLICY blog_posts_public_select ON blog_posts 
  FOR SELECT 
  USING (status = 'published' OR auth.is_staff());

-- Staff and Admin can manage blog posts
DROP POLICY IF EXISTS blog_posts_staff_manage ON blog_posts;
CREATE POLICY blog_posts_staff_manage ON blog_posts 
  FOR ALL 
  USING (auth.is_staff())
  WITH CHECK (auth.is_staff());

COMMIT;

-- NOTES:
-- - site_settings table stores key-value pairs for CMS configuration
-- - blog_posts table stores homepage blog posts/announcements
-- - Both tables have automatic timestamps via triggers
-- - RLS policies enforce that only Admin can manage settings
-- - Public can read published site settings and blog posts
-- - Staff can create/edit blog posts
-- - JSON settings are marked with is_json flag for easy parsing

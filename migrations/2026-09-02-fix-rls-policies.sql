-- Migration: Fix RLS Policies for Proper Access Control
-- Date: 2026-09-02
-- Purpose: Enforce correct authorization for beneficiaries and related data
-- Security: Prevent unauthorized access to sensitive beneficiary information

BEGIN;

-- ===================================================================
-- STEP 1: Verify helper functions exist and are correct
-- ===================================================================

CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'Admin'
  );
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION auth.is_staff()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND (role = 'Staff' OR role = 'Admin')
  );
$$ LANGUAGE SQL STABLE;

-- ===================================================================
-- STEP 2: Fix BENEFICIARIES RLS Policies
-- ===================================================================

-- Drop all existing policies on beneficiaries
DROP POLICY IF EXISTS beneficiaries_select_all ON beneficiaries;
DROP POLICY IF EXISTS beneficiaries_public_select ON beneficiaries;
DROP POLICY IF EXISTS beneficiaries_insert_all ON beneficiaries;
DROP POLICY IF EXISTS beneficiaries_authenticated_insert ON beneficiaries;
DROP POLICY IF EXISTS beneficiaries_update_authenticated ON beneficiaries;
DROP POLICY IF EXISTS beneficiaries_staff_update ON beneficiaries;
DROP POLICY IF EXISTS beneficiaries_admin_delete ON beneficiaries;

-- Policy 1: Staff and Admin can SELECT all beneficiaries
CREATE POLICY beneficiaries_staff_select ON beneficiaries 
  FOR SELECT 
  USING (auth.is_staff());

-- Policy 2: Public (authenticated but not staff) can only see the public beneficiary list/directory
-- For now, authenticated non-staff users see nothing (can be expanded later for public directory)
-- This prevents beneficiary list from being accessible to the public
CREATE POLICY beneficiaries_public_select_restricted ON beneficiaries 
  FOR SELECT 
  USING (false);

-- Policy 3: Authenticated users can INSERT a beneficiary (self-registration)
CREATE POLICY beneficiaries_self_register ON beneficiaries 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Policy 4: Staff and Admin can UPDATE beneficiaries
CREATE POLICY beneficiaries_staff_update ON beneficiaries 
  FOR UPDATE 
  USING (auth.is_staff())
  WITH CHECK (auth.is_staff());

-- Policy 5: Only Admin can DELETE beneficiaries
CREATE POLICY beneficiaries_admin_delete ON beneficiaries 
  FOR DELETE 
  USING (auth.is_admin());

-- ===================================================================
-- STEP 3: Fix ASSESSMENTS RLS Policies
-- ===================================================================

DROP POLICY IF EXISTS assessments_access_authenticated ON assessments;
DROP POLICY IF EXISTS assessments_staff_access ON assessments;
DROP POLICY IF EXISTS assessments_beneficiary_view ON assessments;

-- Only staff and admin can access assessments
CREATE POLICY assessments_staff_access ON assessments 
  FOR ALL 
  USING (auth.is_staff())
  WITH CHECK (auth.is_staff());

-- ===================================================================
-- STEP 4: Fix EQUIPMENT_DISTRIBUTIONS RLS Policies
-- ===================================================================

DROP POLICY IF EXISTS equipment_distributions_access_authenticated ON equipment_distributions;
DROP POLICY IF EXISTS equipment_distributions_staff_access ON equipment_distributions;

-- Only staff and admin can access equipment distributions
CREATE POLICY equipment_distributions_staff_access ON equipment_distributions 
  FOR ALL 
  USING (auth.is_staff())
  WITH CHECK (auth.is_staff());

-- ===================================================================
-- STEP 5: Fix INVENTORY RLS Policies
-- ===================================================================

DROP POLICY IF EXISTS inventory_access_authenticated ON inventory;
DROP POLICY IF EXISTS inventory_staff_select ON inventory;
DROP POLICY IF EXISTS inventory_admin_update ON inventory;
DROP POLICY IF EXISTS inventory_admin_insert ON inventory;

-- 1. Staff and Admin can view inventory
CREATE POLICY inventory_staff_select ON inventory 
  FOR SELECT 
  USING (auth.is_staff());

-- 2. Only Admin can UPDATE inventory
CREATE POLICY inventory_admin_update ON inventory 
  FOR UPDATE 
  USING (auth.is_admin())
  WITH CHECK (auth.is_admin());

-- 3. Only Admin can INSERT inventory
CREATE POLICY inventory_admin_insert ON inventory 
  FOR INSERT 
  WITH CHECK (auth.is_admin());

-- ===================================================================
-- STEP 6: Fix FOLLOW_UPS RLS Policies
-- ===================================================================

DROP POLICY IF EXISTS follow_ups_access_authenticated ON follow_ups;
DROP POLICY IF EXISTS follow_ups_staff_access ON follow_ups;

-- Only staff and admin can access follow-ups
CREATE POLICY follow_ups_staff_access ON follow_ups 
  FOR ALL 
  USING (auth.is_staff())
  WITH CHECK (auth.is_staff());

-- ===================================================================
-- STEP 7: Fix REQUESTS RLS Policies
-- ===================================================================

DROP POLICY IF EXISTS requests_access_authenticated ON requests;
DROP POLICY IF EXISTS requests_staff_access ON requests;
DROP POLICY IF EXISTS requests_public_insert ON requests;

-- 1. Staff and Admin can access all requests
CREATE POLICY requests_staff_access ON requests 
  FOR ALL 
  USING (auth.is_staff())
  WITH CHECK (auth.is_staff());

-- 2. Authenticated/Anonymous users can INSERT requests (self-service)
CREATE POLICY requests_public_insert ON requests 
  FOR INSERT 
  WITH CHECK (auth.role() IS NOT NULL);

-- ===================================================================
-- STEP 8: Fix DONATIONS RLS Policies
-- ===================================================================

DROP POLICY IF EXISTS donations_access_authenticated ON donations;
DROP POLICY IF EXISTS donations_authenticated_insert ON donations;
DROP POLICY IF EXISTS donations_owner_select ON donations;
DROP POLICY IF EXISTS donations_staff_select ON donations;

-- 1. Authenticated users can INSERT donations (self-service donations)
CREATE POLICY donations_authenticated_insert ON donations 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- 2. Staff and Admin can view all donations
CREATE POLICY donations_staff_select ON donations 
  FOR SELECT 
  USING (auth.is_staff());

-- 3. Donors can view their own donations (if donor_id exists on table)
-- This is a nice-to-have for future enhancement
-- (conditional on table having a donor_id column that matches auth.uid())

-- ===================================================================
-- STEP 9: Fix BENEFICIARY_MESSAGES RLS Policies (if table exists)
-- ===================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'beneficiary_messages') THEN
    DROP POLICY IF EXISTS beneficiary_messages_staff_access ON beneficiary_messages;
    
    -- Only staff and admin can manage messages
    EXECUTE 'CREATE POLICY beneficiary_messages_staff_access ON beneficiary_messages 
      FOR ALL 
      USING (auth.is_staff())
      WITH CHECK (auth.is_staff())';
  END IF;
END $$;

-- ===================================================================
-- STEP 10: Fix SITE_SETTINGS / CMS RLS Policies (if table exists)
-- ===================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'site_settings') THEN
    DROP POLICY IF EXISTS site_settings_public_select ON site_settings;
    DROP POLICY IF EXISTS site_settings_admin_manage ON site_settings;
    
    -- Public can read published site settings
    EXECUTE 'CREATE POLICY site_settings_public_select ON site_settings 
      FOR SELECT 
      USING (true)';
    
    -- Only admin can manage site settings
    EXECUTE 'CREATE POLICY site_settings_admin_manage ON site_settings 
      FOR INSERT 
      WITH CHECK (auth.is_admin())';
    
    EXECUTE 'CREATE POLICY site_settings_admin_update ON site_settings 
      FOR UPDATE 
      USING (auth.is_admin())
      WITH CHECK (auth.is_admin())';
  END IF;
END $$;

-- ===================================================================
-- STEP 11: Fix USERS RLS Policies
-- ===================================================================

DROP POLICY IF EXISTS users_admin_manage ON users;
DROP POLICY IF EXISTS users_self_view ON users;

-- Users table: Only admins can manage users
CREATE POLICY users_admin_select ON users 
  FOR SELECT 
  USING (auth.is_admin());

CREATE POLICY users_admin_manage ON users 
  FOR ALL 
  USING (auth.is_admin())
  WITH CHECK (auth.is_admin());

-- ===================================================================
-- STEP 12: Enable RLS on all relevant tables
-- ===================================================================

ALTER TABLE IF EXISTS beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS equipment_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;

-- Enable conditionally
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'beneficiary_messages') THEN
    EXECUTE 'ALTER TABLE beneficiary_messages ENABLE ROW LEVEL SECURITY';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'site_settings') THEN
    EXECUTE 'ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY';
  END IF;
END $$;

-- ===================================================================
-- STEP 13: Storage Bucket Policies
-- ===================================================================

-- beneficiary-photos bucket: Staff/Admin can access, public can upload for registration
-- This requires Supabase storage policy setup through UI or separate storage migration

COMMIT;

-- NOTES:
-- - All SELECT queries are now restricted to authenticated staff/admin users
-- - Public visitors cannot see beneficiary data
-- - Beneficiary self-registration still works via INSERT policy with auth.role() = 'authenticated' OR 'anon'
-- - Admin-only operations (delete, user management, inventory management) are clearly restricted
-- - RLS is enabled on all tables
-- - Storage bucket policies should be set through Supabase dashboard or storage-specific migrations
-- - The helper functions auth.is_admin() and auth.is_staff() are the authoritative access-control mechanism

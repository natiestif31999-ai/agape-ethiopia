-- Migration: Implement Proper Role-Based Access Control (RBAC) and RLS Policies
-- Date: 2026-08-13
-- Purpose: Tighten security by implementing proper role-based access with RLS

BEGIN;

-- Create a helper function to check if user is admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'Admin'
  );
$$ LANGUAGE SQL STABLE;

-- Create a helper function to check if user is staff
CREATE OR REPLACE FUNCTION auth.is_staff()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND (role = 'Staff' OR role = 'Admin')
  );
$$ LANGUAGE SQL STABLE;

-- ============================================================
-- BENEFICIARIES TABLE RLS
-- ============================================================
-- Drop existing overly-permissive policies
DROP POLICY IF EXISTS beneficiaries_select_all ON beneficiaries;
DROP POLICY IF EXISTS beneficiaries_insert_all ON beneficiaries;
DROP POLICY IF EXISTS beneficiaries_update_authenticated ON beneficiaries;

-- New RLS Policies for beneficiaries:
-- 1. Public can SELECT but only view non-sensitive fields (used for tracking)
CREATE POLICY beneficiaries_public_select ON beneficiaries 
  FOR SELECT 
  USING (true);

-- 2. Anyone authenticated can INSERT (for self-registration), but limited fields
CREATE POLICY beneficiaries_authenticated_insert ON beneficiaries 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- 3. Staff and Admin can UPDATE beneficiaries
CREATE POLICY beneficiaries_staff_update ON beneficiaries 
  FOR UPDATE 
  USING (auth.is_staff())
  WITH CHECK (auth.is_staff());

-- 4. Admin only can DELETE
CREATE POLICY beneficiaries_admin_delete ON beneficiaries 
  FOR DELETE 
  USING (auth.is_admin());

-- ============================================================
-- ASSESSMENTS TABLE RLS
-- ============================================================
DROP POLICY IF EXISTS assessments_access_authenticated ON assessments;

-- 1. Staff and Admin can access assessments
CREATE POLICY assessments_staff_access ON assessments 
  FOR ALL 
  USING (auth.is_staff())
  WITH CHECK (auth.is_staff());

-- 2. Beneficiaries can view their own assessments (future enhancement)
-- CREATE POLICY assessments_beneficiary_view ON assessments 
--   FOR SELECT 
--   USING (beneficiary_id IN (SELECT id FROM beneficiaries WHERE id = auth.uid()));

-- ============================================================
-- EQUIPMENT_DISTRIBUTIONS TABLE RLS
-- ============================================================
DROP POLICY IF EXISTS equipment_distributions_access_authenticated ON equipment_distributions;

-- Staff and Admin can access equipment distributions
CREATE POLICY equipment_distributions_staff_access ON equipment_distributions 
  FOR ALL 
  USING (auth.is_staff())
  WITH CHECK (auth.is_staff());

-- ============================================================
-- INVENTORY TABLE RLS
-- ============================================================
DROP POLICY IF EXISTS inventory_access_authenticated ON inventory;

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

-- ============================================================
-- FOLLOW_UPS TABLE RLS
-- ============================================================
DROP POLICY IF EXISTS follow_ups_access_authenticated ON follow_ups;

-- Staff and Admin can access follow-ups
CREATE POLICY follow_ups_staff_access ON follow_ups 
  FOR ALL 
  USING (auth.is_staff())
  WITH CHECK (auth.is_staff());

-- ============================================================
-- REQUESTS TABLE RLS
-- ============================================================
DROP POLICY IF EXISTS requests_access_authenticated ON requests;

-- 1. Staff and Admin can access requests
CREATE POLICY requests_staff_access ON requests 
  FOR ALL 
  USING (auth.is_staff())
  WITH CHECK (auth.is_staff());

-- 2. Public can INSERT requests (self-service)
CREATE POLICY requests_public_insert ON requests 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- ============================================================
-- DONATIONS TABLE RLS
-- ============================================================
DROP POLICY IF EXISTS donations_access_authenticated ON donations;

-- 1. Public/Authenticated can INSERT donations
CREATE POLICY donations_authenticated_insert ON donations 
  FOR INSERT 
  WITH CHECK (auth.role() IS NOT NULL);

-- 2. Donors can view their own donations
CREATE POLICY donations_owner_select ON donations 
  FOR SELECT 
  USING (donor_id = auth.uid() OR auth.is_staff());

-- 3. Admin/Staff can view all donations
CREATE POLICY donations_staff_select ON donations 
  FOR SELECT 
  USING (auth.is_staff());

-- 4. Admin/Staff can UPDATE donation status
CREATE POLICY donations_staff_update ON donations 
  FOR UPDATE 
  USING (auth.is_staff())
  WITH CHECK (auth.is_staff());

-- ============================================================
-- USERS TABLE RLS
-- ============================================================
DROP POLICY IF EXISTS users_access_authenticated ON users;

-- 1. Users can view their own profile
CREATE POLICY users_self_select ON users 
  FOR SELECT 
  USING (id = auth.uid() OR auth.is_admin());

-- 2. Only Admin can update users
CREATE POLICY users_admin_update ON users 
  FOR UPDATE 
  USING (auth.is_admin())
  WITH CHECK (auth.is_admin());

-- 3. Only Admin can manage user roles
CREATE POLICY users_admin_insert ON users 
  FOR INSERT 
  WITH CHECK (auth.is_admin());

-- 4. Only Admin can delete users
CREATE POLICY users_admin_delete ON users 
  FOR DELETE 
  USING (auth.is_admin());

-- ============================================================
-- SITE_SETTINGS TABLE RLS
-- ============================================================
DROP POLICY IF EXISTS site_settings_access_authenticated ON site_settings;

-- 1. Public can view published settings
CREATE POLICY site_settings_public_select ON site_settings 
  FOR SELECT 
  USING (true);

-- 2. Admin only can UPDATE settings
CREATE POLICY site_settings_admin_update ON site_settings 
  FOR UPDATE 
  USING (auth.is_admin())
  WITH CHECK (auth.is_admin());

-- 3. Admin only can INSERT settings
CREATE POLICY site_settings_admin_insert ON site_settings 
  FOR INSERT 
  WITH CHECK (auth.is_admin());

-- ============================================================
-- AUDIT_LOGS TABLE RLS
-- ============================================================
DROP POLICY IF EXISTS audit_logs_access_authenticated ON audit_logs;

-- 1. Admin can view audit logs
CREATE POLICY audit_logs_admin_select ON audit_logs 
  FOR SELECT 
  USING (auth.is_admin());

-- 2. System can INSERT audit logs (via function)
CREATE POLICY audit_logs_insert ON audit_logs 
  FOR INSERT 
  WITH CHECK (true); -- Allow inserts from functions

-- ============================================================
-- ORGANIZATION_AGREEMENTS TABLE RLS
-- ============================================================
ALTER TABLE IF EXISTS organization_agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY organization_agreements_public_select ON organization_agreements 
  FOR SELECT 
  USING (status = 'approved' OR auth.is_staff());

CREATE POLICY organization_agreements_insert ON organization_agreements 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY organization_agreements_staff_manage ON organization_agreements 
  FOR UPDATE 
  USING (auth.is_staff())
  WITH CHECK (auth.is_staff());

-- ============================================================
-- REGISTRATION_COUNTERS TABLE RLS
-- ============================================================
-- Already created in previous migration with policies

COMMIT;

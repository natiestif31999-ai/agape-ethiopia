-- Fix RLS Policies for Better Security
-- Run after applying consolidated-schema.sql
-- This migration improves the RLS policies to be more restrictive and role-based

BEGIN;

-- Update beneficiaries policies
DROP POLICY IF EXISTS beneficiaries_select_all ON beneficiaries;
DROP POLICY IF EXISTS beneficiaries_insert_all ON beneficiaries;

CREATE POLICY beneficiaries_select_authenticated ON beneficiaries 
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY beneficiaries_insert_authenticated ON beneficiaries 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Keep the authenticated update policy
-- beneficiaries_update_authenticated already exists

-- Drop overly permissive generic policies and ensure all tables have proper policies

-- Assessments - ensure only authenticated users can access
DROP POLICY IF EXISTS assessments_access_authenticated ON assessments;
CREATE POLICY assessments_select_authenticated ON assessments 
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY assessments_insert_authenticated ON assessments 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY assessments_update_authenticated ON assessments 
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY assessments_delete_authenticated ON assessments 
  FOR DELETE USING (auth.role() = 'authenticated');

-- Equipment Distributions
DROP POLICY IF EXISTS equipment_distributions_access_authenticated ON equipment_distributions;
CREATE POLICY equipment_distributions_select_authenticated ON equipment_distributions 
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY equipment_distributions_insert_authenticated ON equipment_distributions 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY equipment_distributions_update_authenticated ON equipment_distributions 
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY equipment_distributions_delete_authenticated ON equipment_distributions 
  FOR DELETE USING (auth.role() = 'authenticated');

-- Inventory
DROP POLICY IF EXISTS inventory_access_authenticated ON inventory;
CREATE POLICY inventory_select_authenticated ON inventory 
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY inventory_insert_authenticated ON inventory 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY inventory_update_authenticated ON inventory 
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY inventory_delete_authenticated ON inventory 
  FOR DELETE USING (auth.role() = 'authenticated');

-- Follow Ups
DROP POLICY IF EXISTS follow_ups_access_authenticated ON follow_ups;
CREATE POLICY follow_ups_select_authenticated ON follow_ups 
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY follow_ups_insert_authenticated ON follow_ups 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY follow_ups_update_authenticated ON follow_ups 
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY follow_ups_delete_authenticated ON follow_ups 
  FOR DELETE USING (auth.role() = 'authenticated');

-- Requests
DROP POLICY IF EXISTS requests_access_authenticated ON requests;
CREATE POLICY requests_select_authenticated ON requests 
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY requests_insert_authenticated ON requests 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY requests_update_authenticated ON requests 
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY requests_delete_authenticated ON requests 
  FOR DELETE USING (auth.role() = 'authenticated');

-- Donations
DROP POLICY IF EXISTS donations_access_authenticated ON donations;
CREATE POLICY donations_select_authenticated ON donations 
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY donations_insert_authenticated ON donations 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY donations_update_authenticated ON donations 
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY donations_delete_authenticated ON donations 
  FOR DELETE USING (auth.role() = 'authenticated');

-- Users
DROP POLICY IF EXISTS users_access_authenticated ON users;
CREATE POLICY users_select_authenticated ON users 
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY users_insert_authenticated ON users 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY users_update_authenticated ON users 
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY users_delete_authenticated ON users 
  FOR DELETE USING (auth.role() = 'authenticated');

-- Site Settings
DROP POLICY IF EXISTS site_settings_access_authenticated ON site_settings;
CREATE POLICY site_settings_select_authenticated ON site_settings 
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY site_settings_insert_authenticated ON site_settings 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY site_settings_update_authenticated ON site_settings 
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY site_settings_delete_authenticated ON site_settings 
  FOR DELETE USING (auth.role() = 'authenticated');

-- Audit Logs
DROP POLICY IF EXISTS audit_logs_access_authenticated ON audit_logs;
CREATE POLICY audit_logs_select_authenticated ON audit_logs 
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY audit_logs_insert_authenticated ON audit_logs 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

COMMIT;

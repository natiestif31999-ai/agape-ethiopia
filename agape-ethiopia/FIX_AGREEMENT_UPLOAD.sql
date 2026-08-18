-- ============================================
-- FIX FOR PDF AGREEMENT UPLOAD ISSUE
-- ============================================
-- 
-- Root Cause:
-- The storage policy for INSERT requires authentication (auth.uid() is not null),
-- but the PartnershipAgreementPortal form uses the anonymous key which has no user ID.
-- 
-- Solution:
-- Drop the restrictive INSERT policy and create a new one that allows public uploads.
--
-- To apply these changes:
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Copy and paste the commands below
-- 3. Run them
-- ============================================

-- Step 1: Drop the old restrictive policy
DROP POLICY IF EXISTS organization_agreements_storage_insert_authenticated ON storage.objects;

-- Step 2: Create a new public INSERT policy
CREATE POLICY organization_agreements_storage_insert_public
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'organization-agreements');

-- Step 3: Verify the policy was created (optional - just for inspection)
-- SELECT
--   schemaname,
--   tablename,
--   policyname,
--   permissive,
--   roles,
--   qual,
--   with_check
-- FROM pg_policies
-- WHERE tablename = 'objects' 
--   AND policyname LIKE 'organization_agreements_storage%'
-- ORDER BY policyname;

-- Migration: Fix storage policies for organization agreements public upload
-- Date: 2026-08-18
-- Purpose: Allow public users to upload agreements while maintaining staff/admin controls

-- Drop the restrictive insert policy
drop policy if exists organization_agreements_storage_insert_authenticated on storage.objects;

-- Create a new public insert policy that allows anyone to upload
create policy organization_agreements_storage_insert_public
  on storage.objects
  for insert
  with check (bucket_id = 'organization-agreements');

-- Verify the policies exist
-- SELECT * FROM storage.policies WHERE name LIKE 'organization_agreements_storage%' AND table_name = 'objects';

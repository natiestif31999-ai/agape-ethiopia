-- Apply after 2026-08-18-public-partner-agreement-workflow.sql if migrations
-- are being run manually. Public submissions are handled by the server route;
-- these policies are defense in depth for the existing bucket.

drop policy if exists organization_agreements_insert_public on public.organization_agreements;
drop policy if exists organization_agreements_storage_select_public on storage.objects;
drop policy if exists organization_agreements_storage_insert_authenticated on storage.objects;
drop policy if exists organization_agreements_storage_insert_public on storage.objects;

create policy organization_agreements_storage_insert_public
  on storage.objects
  for insert
  with check (
    bucket_id = 'organization-agreements'
    and name like 'public-submissions/%'
  );

create policy organization_agreements_storage_select_staff
  on storage.objects
  for select
  using (
    bucket_id = 'organization-agreements'
    and auth.uid() is not null
    and exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role in ('Staff', 'Admin')
    )
  );

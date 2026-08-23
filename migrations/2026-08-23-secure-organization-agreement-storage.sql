-- Make partner agreement files private. Public submissions are written through
-- server-side routes using the service role, and staff receive signed URLs.
alter table public.organization_agreements enable row level security;

drop policy if exists organization_agreements_public_select on public.organization_agreements;
drop policy if exists organization_agreements_insert on public.organization_agreements;
drop policy if exists organization_agreements_insert_public on public.organization_agreements;
drop policy if exists organization_agreements_access_authenticated on public.organization_agreements;
drop policy if exists organization_agreements_select_staff on public.organization_agreements;
drop policy if exists organization_agreements_update_staff on public.organization_agreements;
drop policy if exists organization_agreements_staff_manage on public.organization_agreements;
drop policy if exists organization_agreements_delete_staff on public.organization_agreements;

create policy organization_agreements_select_staff
  on public.organization_agreements for select
  using (
    auth.uid() is not null
    and exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role in ('Staff', 'Admin')
    )
  );

create policy organization_agreements_update_staff
  on public.organization_agreements for update
  using (
    auth.uid() is not null
    and exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role in ('Staff', 'Admin')
    )
  )
  with check (
    auth.uid() is not null
    and exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role in ('Staff', 'Admin')
    )
  );

create policy organization_agreements_delete_staff
  on public.organization_agreements for delete
  using (
    auth.uid() is not null
    and exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role in ('Staff', 'Admin')
    )
  );

update storage.buckets
set public = false
where id = 'organization-agreements';

drop policy if exists organization_agreements_storage_select_public on storage.objects;
drop policy if exists organization_agreements_storage_insert_authenticated on storage.objects;
drop policy if exists organization_agreements_storage_insert_public on storage.objects;
drop policy if exists organization_agreements_storage_select_staff on storage.objects;
drop policy if exists organization_agreements_storage_update_staff on storage.objects;
drop policy if exists organization_agreements_storage_delete_staff on storage.objects;

create policy organization_agreements_storage_select_staff
  on storage.objects for select
  using (
    bucket_id = 'organization-agreements'
    and auth.uid() is not null
    and exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role in ('Staff', 'Admin')
    )
  );

create policy organization_agreements_storage_update_staff
  on storage.objects for update
  using (
    bucket_id = 'organization-agreements'
    and auth.uid() is not null
    and exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role in ('Staff', 'Admin')
    )
  )
  with check (bucket_id = 'organization-agreements');

create policy organization_agreements_storage_delete_staff
  on storage.objects for delete
  using (
    bucket_id = 'organization-agreements'
    and auth.uid() is not null
    and exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role in ('Staff', 'Admin')
    )
  );
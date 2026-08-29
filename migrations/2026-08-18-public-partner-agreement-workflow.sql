-- Extend the existing agreement table for public upload and official-PDF signing.
create extension if not exists pgcrypto;

create table if not exists public.organization_agreements (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  organization_type text not null,
  contact_person text not null,
  email text not null,
  phone text not null,
  region text not null,
  city text not null,
  address text not null,
  agreement_number text,
  agreement_file_url text,
  agreement_file_name text,
  agreement_file_path text,
  uploaded_by uuid,
  status text not null default 'Pending Review',
  submitted_at timestamptz default now(),
  reviewed_by uuid,
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.organization_agreements
  add column if not exists public_message text,
  add column if not exists internal_notes text,
  add column if not exists agreement_version text,
  add column if not exists signer_name text,
  add column if not exists signed_at timestamptz,
  add column if not exists signature_method text,
  add column if not exists submission_source text not null default 'uploaded_pdf',
  add column if not exists previous_submission_id uuid references public.organization_agreements(id) on delete set null,
  add column if not exists version_number integer not null default 1;

create index if not exists organization_agreements_previous_submission_idx
  on public.organization_agreements(previous_submission_id);

alter table public.organization_agreements
  drop constraint if exists organization_agreements_status_check;

alter table public.organization_agreements
  add constraint organization_agreements_status_check
  check (status in ('Pending Review', 'Pending', 'Under Review', 'Approved', 'Rejected'));

alter table public.organization_agreements enable row level security;

drop policy if exists organization_agreements_select_staff on public.organization_agreements;
drop policy if exists organization_agreements_update_staff on public.organization_agreements;
drop policy if exists organization_agreements_delete_staff on public.organization_agreements;

create policy organization_agreements_select_staff
  on public.organization_agreements for select
  using (auth.uid() is not null and exists (
    select 1 from public.users u where u.id = auth.uid() and u.role in ('Staff', 'Admin')
  ));

create policy organization_agreements_update_staff
  on public.organization_agreements for update
  using (auth.uid() is not null and exists (
    select 1 from public.users u where u.id = auth.uid() and u.role in ('Staff', 'Admin')
  ));

create policy organization_agreements_delete_staff
  on public.organization_agreements for delete
  using (auth.uid() is not null and exists (
    select 1 from public.users u where u.id = auth.uid() and u.role in ('Staff', 'Admin')
  ));

-- Public submissions are intentionally unauthenticated, but only into controlled prefixes.
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
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
  updated_at timestamptz default now(),
  constraint organization_agreements_status_check check (status in ('Pending Review','Pending','Approved','Rejected'))
);

create index if not exists organization_agreements_status_idx on public.organization_agreements(status);
create index if not exists organization_agreements_submitted_at_idx on public.organization_agreements(submitted_at desc);
create index if not exists organization_agreements_email_idx on public.organization_agreements(email);

alter table public.organization_agreements
  add constraint organization_agreements_uploaded_by_fk
  foreign key (uploaded_by) references public.users(id) on delete set null;

alter table public.organization_agreements
  add constraint organization_agreements_reviewed_by_fk
  foreign key (reviewed_by) references public.users(id) on delete set null;

create policy if not exists organization_agreements_select_staff
  on public.organization_agreements
  for select
  using (
    auth.uid() is not null and exists (
      select 1 from public.users u where u.id = auth.uid() and u.role in ('Staff','Admin')
    )
  );

create policy if not exists organization_agreements_insert_public
  on public.organization_agreements
  for insert
  with check (true);

create policy if not exists organization_agreements_update_staff
  on public.organization_agreements
  for update
  using (
    auth.uid() is not null and exists (
      select 1 from public.users u where u.id = auth.uid() and u.role in ('Staff','Admin')
    )
  );

create policy if not exists organization_agreements_delete_staff
  on public.organization_agreements
  for delete
  using (
    auth.uid() is not null and exists (
      select 1 from public.users u where u.id = auth.uid() and u.role in ('Staff','Admin')
    )
  );

insert into storage.buckets (id, name, public) values ('organization-agreements','organization-agreements', true)
on conflict (id) do nothing;

create policy if not exists organization_agreements_storage_select_public
  on storage.objects
  for select
  using (bucket_id = 'organization-agreements');

create policy if not exists organization_agreements_storage_insert_authenticated
  on storage.objects
  for insert
  with check (bucket_id = 'organization-agreements' and auth.uid() is not null);

create policy if not exists organization_agreements_storage_update_staff
  on storage.objects
  for update
  using (
    bucket_id = 'organization-agreements' and auth.uid() is not null and exists (
      select 1 from public.users u where u.id = auth.uid() and u.role in ('Staff','Admin')
    )
  );

create policy if not exists organization_agreements_storage_delete_staff
  on storage.objects
  for delete
  using (
    bucket_id = 'organization-agreements' and auth.uid() is not null and exists (
      select 1 from public.users u where u.id = auth.uid() and u.role in ('Staff','Admin')
    )
  );

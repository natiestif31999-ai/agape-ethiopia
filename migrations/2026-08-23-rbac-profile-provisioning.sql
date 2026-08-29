-- Ensure existing Supabase Auth users can load an application profile.
-- Run with the Supabase SQL editor or CLI; auth.users is not exposed to clients.
alter table if exists public.users
  add column if not exists role text default 'Staff',
  add column if not exists is_disabled boolean default false,
  add column if not exists password_change_required boolean default false,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

update public.users
set role = coalesce(role, 'Staff'),
    is_disabled = coalesce(is_disabled, false),
    password_change_required = coalesce(password_change_required, false),
    updated_at = coalesce(updated_at, now());

insert into public.users (id, email, role, is_disabled, password_change_required)
select au.id, au.email, 'Staff', false, false
from auth.users au
left join public.users u on u.id = au.id
where u.id is null
on conflict (id) do nothing;
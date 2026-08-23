-- Persist Staff/Admin messages sent from a beneficiary record.
create table if not exists public.beneficiary_messages (
  id uuid primary key default gen_random_uuid(),
  beneficiary_id uuid not null references public.beneficiaries(id) on delete cascade,
  sender_id uuid not null references public.users(id) on delete restrict,
  sender_email text not null,
  message text not null check (char_length(message) between 1 and 4000),
  created_at timestamptz not null default now()
);

create index if not exists beneficiary_messages_beneficiary_idx
  on public.beneficiary_messages(beneficiary_id, created_at desc);

alter table public.beneficiary_messages enable row level security;
drop policy if exists beneficiary_messages_staff_select on public.beneficiary_messages;
drop policy if exists beneficiary_messages_staff_insert on public.beneficiary_messages;

create policy beneficiary_messages_staff_select
  on public.beneficiary_messages for select to authenticated
  using (public.get_current_user_role() in ('Staff', 'Admin'));

create policy beneficiary_messages_staff_insert
  on public.beneficiary_messages for insert to authenticated
  with check (
    sender_id = auth.uid()
    and public.get_current_user_role() in ('Staff', 'Admin')
  );
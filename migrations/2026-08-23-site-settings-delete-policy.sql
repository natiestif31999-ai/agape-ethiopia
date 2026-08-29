-- Use the existing RBAC helper from the users RLS migrations. Do not create a
-- second authentication or role implementation here.
alter table public.site_settings enable row level security;

drop policy if exists site_settings_access_authenticated on public.site_settings;
drop policy if exists site_settings_select_authenticated on public.site_settings;
drop policy if exists site_settings_insert_authenticated on public.site_settings;
drop policy if exists site_settings_update_authenticated on public.site_settings;
drop policy if exists site_settings_delete_authenticated on public.site_settings;
drop policy if exists site_settings_public_select on public.site_settings;
drop policy if exists site_settings_admin_select on public.site_settings;
drop policy if exists site_settings_admin_update on public.site_settings;
drop policy if exists site_settings_admin_insert on public.site_settings;
drop policy if exists site_settings_delete_admin on public.site_settings;

-- Preserve public reads for non-sensitive settings, but expose an announcement
-- only while its JSON payload explicitly marks it as published.
create policy site_settings_public_select
  on public.site_settings for select
  using (
    key <> 'daily_announcement'
    or (
      value is not null
      and value ~ '"published"[[:space:]]*:[[:space:]]*true'
    )
  );

create policy site_settings_admin_select
  on public.site_settings for select to authenticated
  using (public.is_current_user_admin());

create policy site_settings_admin_insert
  on public.site_settings for insert to authenticated
  with check (public.is_current_user_admin());

create policy site_settings_admin_update
  on public.site_settings for update to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

create policy site_settings_delete_admin
  on public.site_settings for delete to authenticated
  using (public.is_current_user_admin());
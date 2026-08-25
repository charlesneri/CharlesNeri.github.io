-- For a new Supabase project, run this entire file in SQL Editor.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- This portfolio has no public account registration. Every account created by
-- the owner in Supabase Authentication is automatically an administrator.
create or replace function public.add_new_auth_user_as_admin()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.admin_users (user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists add_new_auth_user_as_admin on auth.users;
create trigger add_new_auth_user_as_admin
  after insert on auth.users
  for each row execute procedure public.add_new_auth_user_as_admin();

create table if not exists public.profile (
  id smallint primary key default 1 check (id = 1),
  full_name text not null,
  headline text not null default '',
  introduction text not null default '',
  email text not null default '',
  phone text not null default '',
  address text not null default '',
  profile_image_url text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.about (
  id smallint primary key default 1 check (id = 1),
  summary text not null default '',
  education jsonb not null default '[]'::jsonb,
  image_url text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_details (
  id smallint primary key default 1 check (id = 1),
  email text not null default '',
  phone text not null default '',
  address text not null default '',
  map_url text not null default '',
  facebook_url text not null default '',
  instagram_url text not null default '',
  linkedin_url text not null default '',
  github_url text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default '',
  description text not null default '',
  icon text not null default '',
  sort_order integer not null default 0,
  published boolean not null default true
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  label text not null default '',
  title text not null,
  description text not null default '',
  icon text not null default '',
  start_date date,
  end_date date,
  sort_order integer not null default 0,
  published boolean not null default true
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default '',
  tools text not null default '',
  description text not null default '',
  image_url text not null,
  link_url text not null default '',
  link_name text not null default '',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null default '',
  category text not null default 'Course Certificate',
  skills text not null default '',
  description text not null default '',
  image_url text not null,
  credential_url text not null default '',
  issued_date date,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 320),
  subject text not null default '' check (char_length(subject) <= 200),
  message text not null check (char_length(message) between 1 and 5000),
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.profile enable row level security;
alter table public.about enable row level security;
alter table public.contact_details enable row level security;
alter table public.skills enable row level security;
alter table public.experiences enable row level security;
alter table public.projects enable row level security;
alter table public.certificates enable row level security;
alter table public.contact_messages enable row level security;

grant select on public.profile, public.about, public.contact_details, public.skills, public.experiences, public.projects, public.certificates to anon, authenticated;
grant insert on public.contact_messages to anon, authenticated;
grant all on public.admin_users, public.profile, public.about, public.contact_details, public.skills, public.experiences, public.projects, public.certificates, public.contact_messages to authenticated;

-- Allows this revised schema to be run after the earlier portfolio_items version.
drop policy if exists "Admins can read their admin record" on public.admin_users;
drop policy if exists "Public can read profile" on public.profile;
drop policy if exists "Public can read about" on public.about;
drop policy if exists "Public can read contact details" on public.contact_details;
drop policy if exists "Public can read published skills" on public.skills;
drop policy if exists "Public can read published experiences" on public.experiences;
drop policy if exists "Public can read published projects" on public.projects;
drop policy if exists "Public can read published certificates" on public.certificates;
drop policy if exists "Visitors can send a contact message" on public.contact_messages;
drop policy if exists "Admins can manage profile" on public.profile;
drop policy if exists "Admins can manage about" on public.about;
drop policy if exists "Admins can manage contact details" on public.contact_details;
drop policy if exists "Admins can manage skills" on public.skills;
drop policy if exists "Admins can manage experiences" on public.experiences;
drop policy if exists "Admins can manage projects" on public.projects;
drop policy if exists "Admins can manage certificates" on public.certificates;
drop policy if exists "Admins can manage contact messages" on public.contact_messages;
create policy "Public can read profile" on public.profile for select using (true);
create policy "Public can read about" on public.about for select using (true);
create policy "Public can read contact details" on public.contact_details for select using (true);
create policy "Public can read published skills" on public.skills for select using (published = true);
create policy "Public can read published experiences" on public.experiences for select using (published = true);
create policy "Public can read published projects" on public.projects for select using (published = true);
create policy "Public can read published certificates" on public.certificates for select using (published = true);
create policy "Visitors can send a contact message" on public.contact_messages for insert to anon, authenticated with check (true);

create policy "Admins can read their admin record" on public.admin_users for select to authenticated using (auth.uid() = user_id);
create policy "Admins can manage profile" on public.profile for all to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid())) with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "Admins can manage about" on public.about for all to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid())) with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "Admins can manage contact details" on public.contact_details for all to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid())) with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "Admins can manage skills" on public.skills for all to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid())) with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "Admins can manage experiences" on public.experiences for all to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid())) with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "Admins can manage projects" on public.projects for all to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid())) with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "Admins can manage certificates" on public.certificates for all to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid())) with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "Admins can manage contact messages" on public.contact_messages for all to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid())) with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

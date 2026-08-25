-- Run this once in Supabase SQL Editor after updating schema.sql.
-- It grants admin access to all existing Authentication users in this
-- single-owner portfolio. Do not use this approach if you later add public
-- registration or non-admin user accounts.
insert into public.admin_users (user_id)
select id from auth.users
on conflict (user_id) do nothing;

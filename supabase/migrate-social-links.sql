-- Run once in Supabase SQL Editor for an existing project.
-- This adds the customizable social-link list used by the editor.
alter table public.contact_details
  add column if not exists social_links jsonb not null default '[]'::jsonb;

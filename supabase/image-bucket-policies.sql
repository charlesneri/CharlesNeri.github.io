-- Run this in the Supabase SQL Editor for the existing image_buckets bucket.
-- Public visitors can view images; authorized portfolio admins can add,
-- replace/edit, and remove files.

insert into storage.buckets (id, name, public)
values ('image_buckets', 'image_buckets', true)
on conflict (id) do update set public = true;

drop policy if exists "Anyone can view image bucket files" on storage.objects;
drop policy if exists "Admins can add image bucket files" on storage.objects;
drop policy if exists "Admins can edit image bucket files" on storage.objects;
drop policy if exists "Admins can remove image bucket files" on storage.objects;

create policy "Anyone can view image bucket files"
on storage.objects for select
to public
using (bucket_id = 'image_buckets');

create policy "Admins can add image bucket files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'image_buckets'
  and exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  )
);

create policy "Admins can edit image bucket files"
on storage.objects for update
to authenticated
using (
  bucket_id = 'image_buckets'
  and exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  )
)
with check (
  bucket_id = 'image_buckets'
  and exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  )
);

create policy "Admins can remove image bucket files"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'image_buckets'
  and exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  )
);

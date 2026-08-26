# Vue + Supabase setup

## Run the site locally

1. Copy `.env.example` to `.env.local`.
2. In Supabase, create a project. In **Connect > App Frameworks**, copy the project URL and publishable key into `.env.local`.
3. Run `npm run dev`.

Without `.env.local`, the site continues to show its built-in content. With it, Projects and Certificates load from Supabase, and the Contact form saves client messages there. To deliver inquiries directly to Gmail, complete the Resend and Edge Function setup in [supabase/EMAIL_SETUP.md](supabase/EMAIL_SETUP.md).

## Create the database

1. In Supabase **SQL Editor**, run `supabase/schema.sql`. If you ran the earlier schema already, run this revised file again; it keeps the old table but creates the new separated tables.
2. Run `supabase/seed.sql` to import the portfolio content.
3. In **Authentication > Users**, create your administrator user (email and password). The schema automatically adds every new Authentication user to `admin_users` because this is a single-owner site.
4. If you created your account before adding the trigger, run `supabase/make-existing-users-admin.sql` in Supabase SQL Editor once.

## Admin-only access

There is no public sign-up page. Create accounts only through **Authentication > Users** in Supabase. Each account created there is automatically an administrator, so do not create accounts for visitors.

You can now add, edit, delete, sort, or unpublish records directly in Supabase's **Table Editor**. The public site shows only items where `published` is true. Client inquiries are saved in `contact_messages`; only an administrator can read them.

## Portfolio editor

Open `/editor.html` after running the site, for example `http://localhost:5173/editor.html`. Sign in using the user created in Supabase Authentication.

Open `/editor.html` for the visual form editor. It is the only editing interface and manages Profile, About and Education, Skills, Experience, Projects, Certificates, and Contact/social details without JSON. Repeatable content has add and delete controls; the required Profile, About, and Contact records can be cleared or edited but are not deletable.

`/admin.html` is kept as a shortcut and redirects to `/editor.html`.

## Images

The seed data keeps the current local image paths. For new images, create a public Storage bucket named `portfolio-assets`, upload a file, and save its public URL in `image_url`. A dedicated in-site admin upload screen can be added next.

## Important security note

Use only the publishable key in `.env.local`. Do not expose a secret or service-role key in browser code or commit `.env.local` to Git.

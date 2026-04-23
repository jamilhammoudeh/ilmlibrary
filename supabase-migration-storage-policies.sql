-- Fix: "new row violates row-level security policy" on file uploads
-- Allows authenticated admin users to upload/update/delete in covers + books buckets,
-- and keeps public read access so book covers and PDFs remain viewable to everyone.

-- Ensure buckets exist and are public (safe to re-run)
insert into storage.buckets (id, name, public)
values
  ('covers', 'covers', true),
  ('books', 'books', true)
on conflict (id) do update set public = excluded.public;

-- Drop any prior policies with our names (safe to re-run)
drop policy if exists "Public read covers" on storage.objects;
drop policy if exists "Public read books" on storage.objects;
drop policy if exists "Authenticated insert covers" on storage.objects;
drop policy if exists "Authenticated update covers" on storage.objects;
drop policy if exists "Authenticated delete covers" on storage.objects;
drop policy if exists "Authenticated insert books" on storage.objects;
drop policy if exists "Authenticated update books" on storage.objects;
drop policy if exists "Authenticated delete books" on storage.objects;

-- Public read (so cover images and PDFs load for site visitors)
create policy "Public read covers"
  on storage.objects for select
  using (bucket_id = 'covers');

create policy "Public read books"
  on storage.objects for select
  using (bucket_id = 'books');

-- Authenticated write (admin uploads from /admin/books form)
create policy "Authenticated insert covers"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'covers');

create policy "Authenticated update covers"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'covers')
  with check (bucket_id = 'covers');

create policy "Authenticated delete covers"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'covers');

create policy "Authenticated insert books"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'books');

create policy "Authenticated update books"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'books')
  with check (bucket_id = 'books');

create policy "Authenticated delete books"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'books');

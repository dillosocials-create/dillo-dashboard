-- Dillo HQ Supabase setup
-- Run this once in Supabase > SQL Editor.

create table if not exists public.dillo_workspace (
  id integer primary key check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

alter table public.dillo_workspace enable row level security;

drop policy if exists "Authenticated users can read Dillo workspace" on public.dillo_workspace;
create policy "Authenticated users can read Dillo workspace"
on public.dillo_workspace for select to authenticated using (true);

drop policy if exists "Authenticated users can insert Dillo workspace" on public.dillo_workspace;
create policy "Authenticated users can insert Dillo workspace"
on public.dillo_workspace for insert to authenticated with check (true);

drop policy if exists "Authenticated users can update Dillo workspace" on public.dillo_workspace;
create policy "Authenticated users can update Dillo workspace"
on public.dillo_workspace for update to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('dillo-files', 'dillo-files', false)
on conflict (id) do nothing;

drop policy if exists "Authenticated users can read Dillo files" on storage.objects;
create policy "Authenticated users can read Dillo files"
on storage.objects for select to authenticated
using (bucket_id = 'dillo-files');

drop policy if exists "Authenticated users can upload Dillo files" on storage.objects;
create policy "Authenticated users can upload Dillo files"
on storage.objects for insert to authenticated
with check (bucket_id = 'dillo-files');

drop policy if exists "Authenticated users can update Dillo files" on storage.objects;
create policy "Authenticated users can update Dillo files"
on storage.objects for update to authenticated
using (bucket_id = 'dillo-files') with check (bucket_id = 'dillo-files');

drop policy if exists "Authenticated users can delete Dillo files" on storage.objects;
create policy "Authenticated users can delete Dillo files"
on storage.objects for delete to authenticated
using (bucket_id = 'dillo-files');

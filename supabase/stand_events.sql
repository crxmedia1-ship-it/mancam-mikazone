-- Run this once in the Supabase SQL editor so the stand panel can count
-- QR / link visits and which grades visitors tap for specs.

create table if not exists public.stand_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (
    event_type in ('visit', 'product_view', 'brochure_download', 'register_open')
  ),
  product_id text,
  session_id text not null,
  path text,
  created_at timestamptz not null default now()
);

create index if not exists stand_events_created_at_idx
  on public.stand_events (created_at desc);

create index if not exists stand_events_type_idx
  on public.stand_events (event_type, product_id);

alter table public.stand_events enable row level security;

drop policy if exists "anon insert stand events" on public.stand_events;
create policy "anon insert stand events"
  on public.stand_events
  for insert
  to anon
  with check (true);

drop policy if exists "anon read stand events" on public.stand_events;
create policy "anon read stand events"
  on public.stand_events
  for select
  to anon
  using (true);

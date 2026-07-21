-- Didifairy schema additions #002: accounts, receipts, contact
-- ---------------------------------------------------------------------------
-- RUN AFTER supabase/schema.sql. Idempotent — safe to run more than once.
-- Supabase dashboard -> SQL Editor -> New query -> paste -> Run.
-- ---------------------------------------------------------------------------

create extension if not exists pgcrypto;

-- ── Customer profiles ─────────────────────────────────────────────────────
-- One row per signed-up customer, keyed to the Supabase Auth user. Phone is
-- collected at signup (required in the app layer).
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  email      text,
  phone      text,
  address    text,
  city       text,
  state      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function set_updated_at();

alter table public.profiles enable row level security;

drop policy if exists "profiles select own" on public.profiles;
create policy "profiles select own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
  for update using (auth.uid() = id);

-- ── Orders: link to customer + payment receipt ────────────────────────────
alter table public.orders add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.orders add column if not exists receipt_url text;
create index if not exists orders_user_id_idx on public.orders (user_id);

-- Logged-in customers may read their own orders (guest orders have null user_id
-- and stay server-only). Admin still reads everything via the service role.
drop policy if exists "users read own orders" on public.orders;
create policy "users read own orders" on public.orders
  for select using (auth.uid() = user_id);

-- ── Contact messages ──────────────────────────────────────────────────────
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  message    text not null,
  created_at timestamptz not null default now()
);
alter table public.contact_messages enable row level security;
-- No anon policies: submitted + read via the server (service role) only.

-- ── Receipts storage bucket (PRIVATE) ─────────────────────────────────────
-- Payment proofs may contain sensitive info, so this bucket is private. The
-- admin views them through short-lived signed URLs generated server-side.
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', false)
on conflict (id) do nothing;
-- No anon policies: uploads go through the server (service role), and the admin
-- reads them via short-lived signed URLs. The bucket stays fully locked.

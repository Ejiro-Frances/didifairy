-- Didifairy database schema
-- ---------------------------------------------------------------------------
-- HOW TO RUN: Supabase dashboard -> SQL Editor -> New query -> paste this whole
-- file -> Run. Safe to run more than once (uses IF NOT EXISTS / ON CONFLICT).
-- ---------------------------------------------------------------------------

-- gen_random_uuid() lives in pgcrypto.
create extension if not exists pgcrypto;

-- Keeps updated_at fresh on every UPDATE.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ── Products ────────────────────────────────────────────────────────────────
-- Prices are whole Naira (e.g. 590000 = ₦590,000), matching formatNGN().
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text not null default '',
  price       integer not null check (price >= 0),
  status      text not null default 'available' check (status in ('available','sold_out')),
  images      text[] not null default '{}',            -- min 3 enforced in the app layer
  video       text,                                     -- optional product video URL
  color       text,
  length      text,
  closure     text,
  category    text not null default 'Bundles',
  featured    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function set_updated_at();

-- ── Orders ──────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id                 uuid primary key default gen_random_uuid(),
  order_number       text not null unique,
  tracking_code      text not null unique,
  customer           jsonb not null,    -- { fullName, firstName, lastName, email, phone, address, city, state, notes }
  items              jsonb not null,    -- [{ productId, productName, quantity, price }]
  subtotal           integer not null,
  delivery_fee       integer not null default 0,
  total              integer not null,
  payment_method     text not null check (payment_method in ('transfer','card')),
  payment_status     text not null default 'pending' check (payment_status in ('pending','paid','failed')),
  status             text not null default 'pending' check (status in ('pending','processing','shipped','completed')),
  paystack_reference text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at
  before update on public.orders
  for each row execute function set_updated_at();

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_tracking_code_idx on public.orders (tracking_code);

-- ── Row Level Security ────────────────────────────────────────────────────────
-- The server uses the SERVICE ROLE key, which BYPASSES RLS entirely. These
-- policies only govern the public anon/browser key.
alter table public.products enable row level security;
alter table public.orders   enable row level security;

-- Storefront may read products directly from the browser.
drop policy if exists "public read products" on public.products;
create policy "public read products"
  on public.products for select
  using (true);

-- Orders contain customer PII: NO anon access at all. Every read/write goes
-- through the server with the service role. (No policies = anon denied.)

-- ── Storage bucket for product media ─────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', true)
on conflict (id) do nothing;

-- Public read of product media (bucket is public; this makes intent explicit).
drop policy if exists "public read product media" on storage.objects;
create policy "public read product media"
  on storage.objects for select
  using (bucket_id = 'product-media');

-- Uploads/deletes happen server-side via the service role, so no anon
-- insert/update/delete policies are defined here.

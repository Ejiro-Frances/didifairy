-- Didifairy schema additions #003: product inventory
-- ---------------------------------------------------------------------------
-- RUN AFTER the previous schema files. Idempotent.
-- Supabase dashboard -> SQL Editor -> New query -> paste -> Run.
-- ---------------------------------------------------------------------------

-- Stock count per product. Checkout decrements it; at 0 the product is marked
-- sold_out automatically. Admin can adjust it anytime.
alter table public.products add column if not exists quantity integer not null default 0;

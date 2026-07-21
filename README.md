# Didifairy — Premium Human Hair E-commerce

A full-stack e-commerce app for **Didifairy** (premium human hair, Lagos, prices in ₦).
Customers browse products, check out as a guest or a registered user, pay by bank
transfer and attach a receipt, then track their order. Admins manage orders,
products, customers and enquiries from a gated dashboard.

Built with **Next.js 16 (App Router)**, **Supabase**, **Zustand**, **Tailwind CSS 4**,
**Zod**, **Sentry**, and tested with **Vitest** + **Playwright**.

> ℹ️ This project runs on a customised build of Next.js. Before changing framework
> code, read the relevant guide in `node_modules/next/dist/docs/` (see `AGENTS.md`).
> Notably, this version uses **`proxy.ts`** instead of `middleware.ts`, and route
> `params`/`searchParams` are **async** (Promises).

---

## Features

**Storefront**
- Product grid + **product detail pages** with an image/video gallery.
- Cart (Zustand) with a slide-over drawer.
- **Guest checkout** (no account needed) with server-validated pricing.
- **Bank transfer** payment: account number shown at checkout, customer uploads a
  payment **receipt**, admin verifies and confirms.
- **Order tracking** by tracking code — no account required.
- **Contact** form.

**Accounts**
- Customer **sign up / log in** (Supabase Auth). Phone number is required.
- **My orders** page — logged-in customers see their orders (including guest
  orders placed with the same email).

**Admin** (`/admin`, gated to the admin email)
- Dashboard with order stats + order management (advance status, confirm payment,
  view receipts).
- **Product management**: create/edit/delete, upload **≥3 images + optional video**,
  toggle available / sold-out.
- **Customers** list with phone + delivery address.
- **Messages** from the contact form.

**Cross-cutting**
- **Zod** validation on every form (client + server) with inline field errors.
- **Sentry** error tracking (client, server, edge).
- Unit tests (Vitest) + end-to-end tests (Playwright).

---

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Database / Auth / Storage | Supabase (Postgres + Auth + Storage) |
| State | Zustand (cart) |
| Styling | Tailwind CSS 4 |
| Validation | Zod |
| Errors | Sentry (`@sentry/nextjs`) |
| Payments | Bank transfer + receipt (Paystack planned) |
| Notifications | WhatsApp click-to-chat (Cloud API planned) |
| Tests | Vitest + Testing Library, Playwright |
| Package manager | pnpm |

---

## Project structure

```
app/
  (storefront)         page.tsx, products/[id], checkout, orders/[id], track, contact
  account/             customer order history (auth-gated)
  login, signup/       auth screens
  admin/               dashboard, products, customers, messages (admin-gated, has layout+sidebar)
  api/                 orders, orders/[id]/receipt, health
  actions/             server actions (auth, orders, contact)
components/            ui, auth, admin, product, checkout, orders, contact + sections
lib/
  supabase/            browser / server / service-role clients + env
  orders.ts            order persistence (service role)
  products.ts          product reads + admin CRUD + media upload
  admin.ts             profiles + contact messages
  auth.ts              getCurrentUser / requireAdmin
  validation.ts        Zod schemas
  order-utils.ts       pure helpers (order/tracking codes, WhatsApp url)
proxy.ts               session refresh + route gating (/admin, /account)
supabase/              schema.sql, schema-002-accounts.sql
scripts/               create-admin.mjs
__tests__/, e2e/       Vitest + Playwright tests
docs/SETUP.md          step-by-step account/credential setup
```

---

## Getting started

### 1. Install

```bash
pnpm install
```

### 2. Configure environment

Copy the template and fill in your keys (see **`docs/SETUP.md`** for how to obtain each):

```bash
cp .env.example .env.local   # or .env
```

Minimum to run with real data:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_EMAIL=admin@didifairy.com

# Shown to customers at checkout
NEXT_PUBLIC_BANK_NAME=...
NEXT_PUBLIC_BANK_ACCOUNT_NAME=...
NEXT_PUBLIC_BANK_ACCOUNT_NUMBER=...
```

> Without Supabase configured, the storefront still runs and falls back to the seed
> products in `lib/data.ts`; checkout and accounts require Supabase.

### 3. Set up the database

In the Supabase dashboard → **SQL Editor**, run both files in order:

1. `supabase/schema.sql` — products + orders tables, RLS, `product-media` bucket.
2. `supabase/schema-002-accounts.sql` — profiles, `orders.user_id` + `receipt_url`,
   `contact_messages`, private `receipts` bucket.

### 4. Create the admin user

```bash
node --env-file=.env scripts/create-admin.mjs
```

Uses `ADMIN_EMAIL` / `ADMIN_PASSWORD` (defaults: `admin@didifairy.com` / `DidiAdmin@123`).
Log in at `/login`. **Change the password after first login.**

> For instant customer signups, disable **Authentication → Email → "Confirm email"**
> in Supabase; otherwise new users must confirm via email before logging in.

### 5. Run

```bash
pnpm dev        # http://localhost:3000
```

---

## Testing

```bash
pnpm test          # Vitest unit tests (run once)
pnpm test:watch    # Vitest watch mode
pnpm test:e2e      # Playwright E2E (builds + starts the app automatically)
```

First Playwright run: `pnpm exec playwright install` to download browsers.

---

## Architecture notes

- **Single source of truth is Supabase.** All order writes go through the
  **service-role** client on the server (`lib/orders.ts`) — the browser never writes
  orders. Orders carry customer PII and have **no anonymous RLS access**.
- **Prices are recomputed server-side** in `POST /api/orders` from product data, so
  a client can never tamper with amounts. Payment status starts `pending` and only
  the admin (or, later, a verified Paystack webhook) sets it to `paid`.
- **Auth is defence-in-depth:** `proxy.ts` gates `/admin` and `/account`, *and* every
  admin Server Action calls `requireAdmin()` (Server Actions are reachable via direct
  POST, so proxy alone is not enough).
- **Receipts** live in a **private** Storage bucket; the admin views them through
  short-lived signed URLs.
- **Sentry** is a no-op until `NEXT_PUBLIC_SENTRY_DSN` is set, so local dev stays clean.

---

## Roadmap

- **Paystack** card payments (initialise → callback → verified webhook).
- **WhatsApp Cloud API** automated order notifications (currently click-to-chat).
- Expanded Playwright coverage of the full purchase flow.

## CI/CD

GitHub Actions runs on every push to `main` and every pull request
(`.github/workflows/ci.yml`):

- **quality** — `pnpm lint`, `pnpm test` (Vitest), `pnpm build`.
- **e2e** — Playwright smoke tests (builds/starts the app itself; no secrets needed).
- **deploy** — production deploy to Vercel, **off by default**. It runs only on `main`
  after the other jobs pass, and only when opt-in is enabled.

### Enabling the Vercel deploy

1. Repo **Settings → Secrets and variables → Actions**:
   - **Variable:** `ENABLE_VERCEL_DEPLOY = true`
   - **Secrets:** `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
     (from `vercel link` locally, or the Vercel dashboard).
2. Set your runtime env vars (Supabase, bank details, etc.) in the **Vercel project**
   settings — `vercel build` pulls them from there, not from GitHub.

> Prefer Vercel's native Git integration instead? Just leave `ENABLE_VERCEL_DEPLOY`
> unset — the deploy job is skipped and Vercel deploys on push as usual.

## Deployment

Deploy on any Node host (e.g. Vercel). Set all environment variables in the host,
run both SQL files against your Supabase project, create the admin user, and point
`NEXT_PUBLIC_APP_URL` at your domain.

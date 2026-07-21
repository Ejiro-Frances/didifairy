# Didifairy — Account & Credential Setup

This guide walks you through creating every external account the app needs and
collecting the exact values to paste into `.env.local`. Work through it top to
bottom. You do **not** need everything before we start coding — the app runs on
placeholders and you swap in real keys per service as you finish each one.

Order of priority: **Supabase → Paystack → Sentry → WhatsApp**. WhatsApp is last
because Meta's verification takes the longest.

---

## 1. Supabase (database + auth + media storage)

Supabase is our backend: the Postgres database (orders, products), admin login,
and file storage for product images/videos.

1. Go to **https://supabase.com** → **Start your project** → sign in with GitHub
   (easiest) or email.
2. Click **New project**.
   - **Name:** `didifairy`
   - **Database password:** click *Generate*, then **save it in your password
     manager** — you'll need it if you ever connect directly to the DB.
   - **Region:** choose the closest to your customers. For Nigeria, **West EU
     (London)** gives the lowest latency.
   - Click **Create new project** and wait ~2 minutes for provisioning.
3. Get your API keys: left sidebar → **Project Settings** (gear icon) → **API**.
   Copy these three values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **`anon` / `publishable` key** (safe for the browser) →
     `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **`service_role` / `secret` key** (server-only — NEVER expose to the
     browser) → `SUPABASE_SERVICE_ROLE_KEY`

   > Newer Supabase projects label these **Publishable key** and **Secret key**;
   > older ones say **anon** and **service_role**. Either pair works — grab the
   > public one and the secret one.

4. Storage bucket + database tables: **you don't create these by hand.** I'll
   give you a single SQL script to paste into **SQL Editor → New query → Run**,
   which creates the tables, security rules, and the `product-media` storage
   bucket in one go. (Comes in Phase 1.)

**➡️ Give me:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`.

---

## 2. Paystack (payments — cards & bank transfer in NGN)

1. Go to **https://paystack.com** → **Create a free account**. Choose Nigeria as
   your country and fill in basic business details.
2. Verify your email address.
3. In the dashboard, go to **Settings** (bottom-left) → **API Keys & Webhooks**.
4. You start in **Test Mode** (toggle top-right) — perfect for building. Copy:
   - **Test Public Key** (`pk_test_...`) → `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
   - **Test Secret Key** (`sk_test_...`) → `PAYSTACK_SECRET_KEY`
5. **Webhook URL** — leave this for now. Once the app is deployed (or exposed via
   a tunnel for local testing) I'll give you the exact URL
   (`https://your-domain/api/paystack/webhook`) to paste into this same page.

> **Going live later:** to accept real money Paystack requires business
> verification (CAC docs, bank account, etc.). Test mode needs none of that and
> behaves identically, so we build and demo entirely in test mode first. Use
> Paystack's [test cards](https://paystack.com/docs/payments/test-payments) to
> simulate payments.

**➡️ Give me:** `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`, `PAYSTACK_SECRET_KEY`.

---

## 3. Sentry (error tracking)

1. Go to **https://sentry.io** → **Sign up** (free "Developer" plan is enough).
2. When asked to create your first project, choose platform **Next.js**.
3. Give it a name (`didifairy`) and note your **organization slug** and
   **project slug** (both appear in the URL: `sentry.io/organizations/<org>/projects/<project>`).
4. Sentry shows you a **DSN** — a URL like
   `https://abc123@o456.ingest.sentry.io/789`. Copy it →
   `NEXT_PUBLIC_SENTRY_DSN`.
5. Create an **auth token** for uploading source maps (so errors show your real
   code, not minified junk): **Settings → Auth Tokens → Create New Token**, scope
   `project:releases`. Copy it → `SENTRY_AUTH_TOKEN` (server-only).

> I'll wire Sentry into the app manually rather than via the auto-wizard, because
> this project uses a customized Next.js build and the wizard can clash with it.

**➡️ Give me:** `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, plus your **org
slug** and **project slug**.

---

## 4. WhatsApp Cloud API (order notifications) — the slow one

Meta's official API. Free to start with a test number. **Start this early** — the
verification + template approval below can take several days, and real customer
notifications don't work until it clears. Everything else in the app works
without it.

1. You need a **Facebook account**. Then go to
   **https://developers.facebook.com** → log in → **My Apps** → **Create App**.
2. Choose use case **Other** → app type **Business** → name it `didifairy`.
3. On the app dashboard, find **WhatsApp** in the product list → **Set up**.
4. This auto-creates a **test business number** you can use immediately. From the
   **WhatsApp → API Setup** page copy:
   - **Phone number ID** → `WHATSAPP_PHONE_NUMBER_ID`
   - **WhatsApp Business Account ID** → `WHATSAPP_BUSINESS_ACCOUNT_ID`
   - **Temporary access token** (expires in 24h — fine for first tests) →
     `WHATSAPP_ACCESS_TOKEN`
5. **Add recipient numbers for testing:** on that same page, under "To", add and
   verify your own phone number. In test mode you can only message numbers you've
   registered here.
6. **Message templates:** order notifications outside a 24-hour window must use
   pre-approved templates. Go to **WhatsApp Manager → Message templates → Create
   template** and create ones like `order_confirmation` and `order_completed`
   with placeholders. Submit for approval (usually hours to a couple of days).
   Tell me the exact **template names** you create.
7. **Permanent token (for production):** the 24h token is only for testing. For a
   lasting one, go to **Business Settings → Users → System users → Add**, create a
   system user, assign your app, and **Generate token** with `whatsapp_business_messaging`
   permission. That token replaces `WHATSAPP_ACCESS_TOKEN`.

**➡️ Give me:** `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_BUSINESS_ACCOUNT_ID`,
`WHATSAPP_ACCESS_TOKEN`, your approved **template names**, and the **admin phone
number** (in international format, e.g. `2348012345678`) that should receive
new-order alerts → `WHATSAPP_ADMIN_NUMBER`.

---

## 5. Admin login

Decide the credentials for your admin account. I'll create this user in Supabase
Auth (no public sign-up — admin only).

**➡️ Give me:** the **email** and a **strong password** for the admin.

---

## Credential checklist

Copy your values into `.env.local` (I'll create `.env.example` as the template).
Send me each value as you obtain it, or paste them all at once — whatever's
easier. Anything not yet ready stays as a placeholder and the app still runs.

| Variable | From | Public? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | ✅ browser |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API | ✅ browser |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API | 🔒 server only |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack → API Keys | ✅ browser |
| `PAYSTACK_SECRET_KEY` | Paystack → API Keys | 🔒 server only |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry → project settings | ✅ browser |
| `SENTRY_AUTH_TOKEN` | Sentry → Auth Tokens | 🔒 server only |
| `WHATSAPP_PHONE_NUMBER_ID` | Meta → WhatsApp API Setup | 🔒 server only |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | Meta → WhatsApp API Setup | 🔒 server only |
| `WHATSAPP_ACCESS_TOKEN` | Meta → WhatsApp / System user | 🔒 server only |
| `WHATSAPP_ADMIN_NUMBER` | your phone (intl format) | 🔒 server only |

> **Golden rule:** only `NEXT_PUBLIC_*` values are safe in the browser. Never
> share a `service_role`, `secret`, or `access token` publicly or commit them —
> `.env.local` is git-ignored for exactly this reason.

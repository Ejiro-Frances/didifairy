import * as Sentry from '@sentry/nextjs'

// Server-side (Node.js runtime) Sentry init. No-op until NEXT_PUBLIC_SENTRY_DSN
// is set, so local dev without a Sentry account runs clean.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
})

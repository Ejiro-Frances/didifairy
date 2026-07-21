import * as Sentry from '@sentry/nextjs'

// Edge runtime Sentry init (middleware, edge route handlers).
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
})

import * as Sentry from '@sentry/nextjs'

// Browser-side Sentry init. Runs after the HTML loads, before React hydration.
// No-op until NEXT_PUBLIC_SENTRY_DSN is set.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
})

// Lets Sentry tie performance spans to client-side route changes.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart

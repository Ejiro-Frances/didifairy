import * as Sentry from '@sentry/nextjs'

// Loaded once per server instance. Picks the right Sentry config per runtime.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}

// Reports errors thrown in Server Components, Route Handlers and Server Actions.
export const onRequestError = Sentry.captureRequestError

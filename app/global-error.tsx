'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

// Catches errors in the root layout itself. It replaces the layout, so it must
// render its own <html>/<body> and can't rely on the app's stylesheet — inline
// styles keep it presentable no matter what broke.
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          background: '#FDFAF5',
          color: '#1A1208',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <p style={{ letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: 10, color: '#B8962E', margin: 0 }}>
          Something went wrong
        </p>
        <h1 style={{ fontSize: '2rem', fontWeight: 400, margin: 0 }}>The page failed to load</h1>
        <p style={{ maxWidth: 420, fontSize: 14, color: '#7A6856', margin: 0 }}>
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={() => unstable_retry()}
          style={{
            marginTop: '0.5rem',
            background: '#1A1208',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '0.65rem 1.25rem',
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}

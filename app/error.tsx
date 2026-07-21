'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import Link from 'next/link'
import * as Sentry from '@sentry/nextjs'

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    // Report to Sentry (no-op until a DSN is configured).
    Sentry.captureException(error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#FDFAF5] px-6 text-center text-[#1A1208]">
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8962E]">Something went wrong</p>
      <h1 className="mt-3 font-cormorant text-4xl">A little tangle on our end</h1>
      <p className="mt-3 max-w-md text-sm text-[#7A6856]">
        We hit an unexpected error. You can try again, or head back to the shop. If it keeps
        happening, please reach out through our contact page.
      </p>

      {error.digest && (
        <p className="mt-3 text-xs text-[#7A6856]">Reference: <span className="font-mono">{error.digest}</span></p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => unstable_retry()}
          className="rounded bg-[#1A1208] px-5 py-2.5 text-sm font-medium text-white"
        >
          Try again
        </button>
        <Link href="/" className="rounded border border-[#E8D5A3] px-5 py-2.5 text-sm">
          Back to shop
        </Link>
        <Link href="/contact" className="rounded border border-[#E8D5A3] px-5 py-2.5 text-sm">
          Contact us
        </Link>
      </div>
    </main>
  )
}

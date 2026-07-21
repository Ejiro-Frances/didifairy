'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import Link from 'next/link'
import { RotateCw } from 'lucide-react'
import * as Sentry from '@sentry/nextjs'

// Scoped to the admin area: it renders inside the admin layout, so the sidebar
// stays put and only the content pane shows the error.
export default function AdminError({
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
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-[#E8D5A3] bg-white p-10 text-center">
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8962E]">Admin error</p>
      <h1 className="mt-2 font-cormorant text-3xl">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-[#7A6856]">
        This section failed to load. You can retry, or move to another part of the dashboard
        using the sidebar.
      </p>

      {error.digest && (
        <p className="mt-3 text-xs text-[#7A6856]">Reference: <span className="font-mono">{error.digest}</span></p>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => unstable_retry()}
          className="inline-flex items-center gap-2 rounded bg-[#1A1208] px-5 py-2.5 text-sm font-medium text-white"
        >
          <RotateCw size={14} /> Try again
        </button>
        <Link href="/admin" className="rounded border border-[#E8D5A3] px-5 py-2.5 text-sm">
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}

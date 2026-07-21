import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#FDFAF5] px-6 text-center text-[#1A1208]">
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8962E]">404</p>
      <h1 className="mt-3 font-cormorant text-5xl">Page not found</h1>
      <p className="mt-3 max-w-md text-sm text-[#7A6856]">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="rounded bg-[#1A1208] px-5 py-2.5 text-sm font-medium text-white">
          Back to shop
        </Link>
        <Link href="/track" className="rounded border border-[#E8D5A3] px-5 py-2.5 text-sm">
          Track an order
        </Link>
      </div>
    </main>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ReceiptUpload({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)

    const body = new FormData()
    body.append('receipt', file)

    try {
      const res = await fetch(`/api/orders/${orderId}/receipt`, { method: 'POST', body })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Upload failed')
        setUploading(false)
        return
      }
      router.refresh() // re-render the server page to show the uploaded state
    } catch {
      setError('Network error. Please try again.')
      setUploading(false)
    }
  }

  return (
    <div className="mt-3">
      <label className="inline-flex cursor-pointer items-center rounded border border-[#1A1208] px-4 py-2 text-sm font-medium">
        {uploading ? 'Uploading…' : 'Attach payment receipt'}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,application/pdf"
          className="hidden"
          disabled={uploading}
          onChange={onChange}
        />
      </label>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}

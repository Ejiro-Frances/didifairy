'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { UploadCloud, X, Film } from 'lucide-react'
import type { ProductFormState } from '@/app/admin/products/actions'
import { Field, TextareaField } from '@/components/ui/field'
import { Product } from '@/types/types'

type Action = (prev: ProductFormState, formData: FormData) => Promise<ProductFormState>
type Preview = { file: File; url: string }

const MAX_IMAGES = 4

async function uploadMedia(files: File[], folder: 'products' | 'videos'): Promise<string[]> {
  if (files.length === 0) return []
  const fd = new FormData()
  fd.set('folder', folder)
  files.forEach(f => fd.append('files', f))
  const res = await fetch('/api/admin/products/media', { method: 'POST', body: fd })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Media upload failed')
  return data.urls as string[]
}

export default function ProductForm({
  action,
  submitLabel,
  product,
}: {
  action: Action
  submitLabel: string
  product?: Product
}) {
  const isEdit = !!product
  const imagesRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<Preview[]>([])
  const [video, setVideo] = useState<Preview | null>(null)

  const [pending, startTransition] = useTransition()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [fieldErrs, setFieldErrs] = useState<Record<string, string>>({})

  // Keep latest previews in a ref so unmount cleanup can revoke object URLs.
  const latest = useRef<{ images: Preview[]; video: Preview | null }>({ images: [], video: null })
  useEffect(() => {
    latest.current = { images, video }
  }, [images, video])
  useEffect(() => {
    return () => {
      latest.current.images.forEach(p => URL.revokeObjectURL(p.url))
      if (latest.current.video) URL.revokeObjectURL(latest.current.video.url)
    }
  }, [])

  const existingCount = isEdit ? product!.images.length : 0

  function onAddImages(e: React.ChangeEvent<HTMLInputElement>) {
    const incoming = Array.from(e.target.files ?? [])
    const merged = [...images]
    for (const file of incoming) {
      if (existingCount + merged.length >= MAX_IMAGES) break // cap at 4 total
      const dup = merged.some(m => m.file.name === file.name && m.file.size === file.size)
      if (!dup) merged.push({ file, url: URL.createObjectURL(file) })
    }
    setImages(merged)
    if (imagesRef.current) imagesRef.current.value = '' // allow re-picking the same file
  }

  function removeImage(index: number) {
    URL.revokeObjectURL(images[index].url)
    setImages(images.filter((_, i) => i !== index))
  }

  function onVideo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (video) URL.revokeObjectURL(video.url)
    setVideo(file ? { file, url: URL.createObjectURL(file) } : null)
  }

  const totalImages = existingCount + images.length
  const enough = totalImages >= 1
  const atMax = totalImages >= MAX_IMAGES

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(undefined)
    setFieldErrs({})

    if (!enough) {
      setError('Please upload at least 1 product image.')
      return
    }

    const formEl = e.currentTarget
    setUploading(true)
    try {
      // 1. Upload media through the route handler (no Server Action size limit).
      const imageUrls = await uploadMedia(images.map(p => p.file), 'products')
      const videoUrls = video ? await uploadMedia([video.file], 'videos') : []

      // 2. Build a slim payload (text + URLs only) for the Server Action.
      const payload = new FormData(formEl)
      payload.delete('images')
      payload.delete('video')
      payload.set('imageUrls', JSON.stringify(imageUrls))
      if (videoUrls[0]) payload.set('videoUrl', videoUrls[0])

      setUploading(false)
      startTransition(async () => {
        const result = await action({}, payload)
        // Only returns on validation error; success redirects.
        if (result?.error) setError(result.error)
        if (result?.fieldErrors) setFieldErrs(result.fieldErrors)
      })
    } catch (err) {
      setUploading(false)
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  const busy = uploading || pending

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      {isEdit && <input type="hidden" name="id" value={product!.id} />}
      {isEdit && <input type="hidden" name="existingImages" value={JSON.stringify(product!.images)} />}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Field label="Name" name="name" defaultValue={product?.name} required error={fieldErrs.name} />

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Price (₦)" name="price" type="number" min={0} defaultValue={product?.price} required error={fieldErrs.price} />
        <Field label="Stock" name="quantity" type="number" min={0} defaultValue={product?.quantity ?? 0} required error={fieldErrs.quantity} />
        <Field label="Category" name="category" defaultValue={product?.category} required error={fieldErrs.category} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Color" name="color" defaultValue={product?.color} error={fieldErrs.color} />
        <Field label="Length" name="length" defaultValue={product?.length} error={fieldErrs.length} />
        <Field label="Closure" name="closure" defaultValue={product?.closure} error={fieldErrs.closure} />
      </div>

      <TextareaField label="Description" name="description" defaultValue={product?.description} error={fieldErrs.description} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="status" className="mb-1 block text-xs font-medium text-[#5C3D2E]">Status</label>
          <select id="status" name="status" defaultValue={product?.status ?? 'available'} className="w-full rounded border border-[#E8D5A3] px-3 py-2 text-sm">
            <option value="available">Available</option>
            <option value="sold_out">Sold out</option>
          </select>
        </div>
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={product?.featured} /> Featured
        </label>
      </div>

      {/* Existing images (edit mode) */}
      {isEdit && product!.images.length > 0 && (
        <div>
          <p className="mb-1 text-xs font-medium text-[#5C3D2E]">Current images</p>
          <div className="flex flex-wrap gap-2">
            {product!.images.map((src, i) => (
              <div key={i} className="relative h-20 w-16 overflow-hidden rounded border border-[#E8D5A3]">
                <Image src={src} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image uploader with live previews */}
      <div>
        <label className="mb-1 block text-xs font-medium text-[#5C3D2E]">
          {isEdit ? 'Add more images' : 'Product images'}
          {!isEdit && <span className="text-red-500" aria-hidden="true"> *</span>}
        </label>

        <input ref={imagesRef} name="images" type="file" accept="image/*" multiple className="hidden" onChange={onAddImages} />

        <button
          type="button"
          onClick={() => imagesRef.current?.click()}
          disabled={atMax}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#E8D5A3] bg-[#FFF9ED] py-8 text-[#7A6856] transition-colors hover:border-[#B8962E] hover:text-[#B8962E] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <UploadCloud size={24} />
          <span className="text-sm">{atMax ? 'Maximum of 4 images reached' : 'Click to upload images'}</span>
          <span className="text-xs">PNG, JPG or WEBP · 1 to 4 images</span>
        </button>

        {images.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map((p, i) => (
              <div key={p.url} className="group relative aspect-square overflow-hidden rounded-lg border border-[#E8D5A3]">
                {/* Object-URL preview — plain img (next/image can't optimize blob URLs) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.file.name} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  aria-label={`Remove ${p.file.name}`}
                  className="absolute right-1 top-1 rounded-full bg-[#1A1208]/80 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <p className={`mt-2 text-xs ${enough ? 'text-[#7A6856]' : 'text-red-600'}`}>
          {totalImages} of {MAX_IMAGES} image{totalImages === 1 ? '' : 's'} selected{enough ? '' : ' — add at least 1'}
        </p>
      </div>

      {/* Video uploader with preview */}
      <div>
        <label className="mb-1 block text-xs font-medium text-[#5C3D2E]">Video (optional)</label>
        <input name="video" type="file" accept="video/*" className="hidden" id="video" onChange={onVideo} />
        <label htmlFor="video" role="button" className="inline-flex items-center gap-2 rounded border border-[#E8D5A3] px-4 py-2 text-sm text-[#5C3D2E] hover:border-[#B8962E]">
          <Film size={16} /> {video ? 'Change video' : 'Choose a video'}
        </label>
        {video && (
          <video src={video.url} controls className="mt-3 max-h-56 w-full max-w-sm rounded-lg border border-[#E8D5A3]" />
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button disabled={busy} className="rounded bg-[#1A1208] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
          {uploading ? 'Uploading…' : pending ? 'Saving…' : submitLabel}
        </button>
        <Link href="/admin/products" className="rounded border border-[#E8D5A3] px-5 py-2.5 text-sm">Cancel</Link>
      </div>
    </form>
  )
}

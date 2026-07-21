import { NextRequest } from 'next/server'
import { getCurrentUser, isAdminEmail } from '@/lib/auth'
import { uploadProductMedia } from '@/lib/products'

const MAX_BYTES = 50 * 1024 * 1024 // 50MB per file (covers short product videos)

// Admin-only media upload. Route handlers have no 1MB Server Action body cap, so
// this is where large image/video uploads go; the create/update Server Actions
// then receive only the returned URLs.
export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!isAdminEmail(user?.email)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const form = await request.formData()
  const folder = (form.get('folder') as string) === 'videos' ? 'videos' : 'products'
  const files = form.getAll('files').filter((f): f is File => f instanceof File && f.size > 0)

  if (files.length === 0) return Response.json({ urls: [] })

  for (const file of files) {
    if (file.size > MAX_BYTES) {
      return Response.json({ error: `${file.name} is too large (max 50MB)` }, { status: 400 })
    }
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      return Response.json({ error: `${file.name} is not an image or video` }, { status: 400 })
    }
  }

  try {
    const urls = await uploadProductMedia(files, folder)
    return Response.json({ urls }, { status: 201 })
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : 'Upload failed' }, { status: 500 })
  }
}

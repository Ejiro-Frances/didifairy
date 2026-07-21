'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { createProduct, deleteProduct, setProductStatus, updateProduct } from '@/lib/products'
import { fieldErrors, productSchema } from '@/lib/validation'

export interface ProductFormState {
  error?: string
  fieldErrors?: Record<string, string>
}

function parseForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    status: formData.get('status'),
    color: formData.get('color'),
    length: formData.get('length'),
    closure: formData.get('closure'),
    category: formData.get('category'),
    featured: formData.get('featured') === 'on',
  })
}

// Image/video files are uploaded separately via /api/admin/products/media; the
// action receives only their URLs, keeping the Server Action body tiny.
function parseUrls(formData: FormData): { images: string[]; video: string | null } {
  let images: string[] = []
  try {
    const parsed = JSON.parse((formData.get('imageUrls') as string) || '[]')
    if (Array.isArray(parsed)) images = parsed.filter(u => typeof u === 'string')
  } catch {
    images = []
  }
  const video = (formData.get('videoUrl') as string) || null
  return { images, video }
}

export async function createProductAction(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin()

  const parsed = parseForm(formData)
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) }

  const { images, video } = parseUrls(formData)
  if (images.length < 3) return { error: 'Please upload at least 3 product images.' }

  try {
    await createProduct({
      ...parsed.data,
      description: parsed.data.description || '',
      images,
      video,
      color: parsed.data.color || null,
      length: parsed.data.length || null,
      closure: parsed.data.closure || null,
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Could not create product' }
  }

  revalidatePath('/admin/products')
  revalidatePath('/')
  redirect('/admin/products')
}

export async function updateProductAction(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin()

  const id = formData.get('id') as string
  if (!id) return { error: 'Missing product id' }

  const parsed = parseForm(formData)
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) }

  let existing: string[] = []
  try {
    existing = JSON.parse((formData.get('existingImages') as string) || '[]')
  } catch {
    existing = []
  }
  const { images: uploaded, video } = parseUrls(formData)
  const images = [...existing, ...uploaded]
  if (images.length < 3) return { error: 'A product needs at least 3 images.' }

  try {
    await updateProduct(id, {
      ...parsed.data,
      description: parsed.data.description || '',
      images,
      // Only overwrite the video if a new one was uploaded.
      ...(video ? { video } : {}),
      color: parsed.data.color || null,
      length: parsed.data.length || null,
      closure: parsed.data.closure || null,
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Could not update product' }
  }

  revalidatePath('/admin/products')
  revalidatePath('/')
  redirect('/admin/products')
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  if (id) {
    await deleteProduct(id)
    revalidatePath('/admin/products')
    revalidatePath('/')
  }
}

export async function toggleStatusAction(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  const status = formData.get('status') as 'available' | 'sold_out'
  if (id) {
    await setProductStatus(id, status)
    revalidatePath('/admin/products')
    revalidatePath('/')
  }
}

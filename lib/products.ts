import 'server-only'
import { products as staticProducts } from '@/lib/data'
import { isSupabaseServiceConfigured } from '@/lib/supabase/env'
import { createServiceClient } from '@/lib/supabase/service'
import { Product } from '@/types/types'

// Shape of a row in the `products` table (snake_case).
interface ProductRow {
  id: string
  name: string
  description: string
  price: number
  status: 'available' | 'sold_out'
  images: string[] | null
  video: string | null
  color: string | null
  length: string | null
  closure: string | null
  category: string
  featured: boolean
}

function mapRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    price: row.price,
    status: row.status,
    images: row.images ?? [],
    video: row.video ?? undefined,
    color: row.color ?? '',
    length: row.length ?? '',
    closure: row.closure ?? undefined,
    category: row.category,
    featured: row.featured,
  }
}

/**
 * Storefront product list. Reads from Supabase when configured; otherwise (or on
 * error, or when the table is still empty) falls back to the seed data in
 * lib/data.ts so the site is never blank while you finish setup.
 */
export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseServiceConfigured) return staticProducts

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error || !data || data.length === 0) return staticProducts
  return (data as ProductRow[]).map(mapRow)
}

// Admin view: real DB rows only (NO static fallback), so the admin manages
// actual data. Returns [] when Supabase isn't configured yet.
export async function listProductsAdmin(): Promise<Product[]> {
  if (!isSupabaseServiceConfigured) return []
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  if (error || !data) return []
  return (data as ProductRow[]).map(mapRow)
}

export interface ProductWriteInput {
  name: string
  description: string
  price: number
  status: 'available' | 'sold_out'
  images: string[]
  video?: string | null
  color?: string | null
  length?: string | null
  closure?: string | null
  category: string
  featured?: boolean
}

export async function createProduct(input: ProductWriteInput): Promise<Product> {
  const supabase = createServiceClient()
  const { data, error } = await supabase.from('products').insert(input).select().single()
  if (error || !data) throw new Error(`Failed to create product: ${error?.message ?? 'unknown'}`)
  return mapRow(data as ProductRow)
}

export async function updateProduct(id: string, input: Partial<ProductWriteInput>): Promise<Product> {
  const supabase = createServiceClient()
  const { data, error } = await supabase.from('products').update(input).eq('id', id).select().single()
  if (error || !data) throw new Error(`Failed to update product: ${error?.message ?? 'unknown'}`)
  return mapRow(data as ProductRow)
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = createServiceClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(`Failed to delete product: ${error.message}`)
}

export async function setProductStatus(id: string, status: 'available' | 'sold_out'): Promise<void> {
  const supabase = createServiceClient()
  await supabase.from('products').update({ status }).eq('id', id)
}

// Uploads product media files to the public `product-media` bucket and returns
// their public URLs.
export async function uploadProductMedia(files: File[], folder = 'products'): Promise<string[]> {
  const supabase = createServiceClient()
  const urls: string[] = []
  for (const file of files) {
    const ext = file.name.split('.').pop() || 'bin'
    const path = `${folder}/${Date.now()}-${Math.round(performance.now())}.${ext}`
    const { error } = await supabase.storage
      .from('product-media')
      .upload(path, file, { contentType: file.type, upsert: true })
    if (error) throw new Error(`Media upload failed: ${error.message}`)
    const { data } = supabase.storage.from('product-media').getPublicUrl(path)
    urls.push(data.publicUrl)
  }
  return urls
}

export async function getProductById(id: string): Promise<Product | null> {
  const fromStatic = () => staticProducts.find(p => p.id === id) ?? null

  if (!isSupabaseServiceConfigured) return fromStatic()

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return fromStatic()
  return mapRow(data as ProductRow)
}

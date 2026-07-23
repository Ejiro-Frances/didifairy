import Link from 'next/link'
import Image from 'next/image'
import { listProductsAdmin } from '@/lib/products'
import { formatNGN } from '@/lib/utils'
import { deleteProductAction, toggleStatusAction } from './actions'

export default async function AdminProductsPage() {
  const products = await listProductsAdmin()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-cormorant text-3xl">Products</h1>
          <p className="text-sm text-[#7A6856]">Upload products, manage stock and media.</p>
        </div>
        <Link href="/admin/products/new" className="rounded bg-[#1A1208] px-4 py-2 text-sm font-medium text-white">
          + New product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E8D5A3] bg-white p-10 text-center text-[#7A6856]">
          No products yet. Click “New product” to add your first listing (needs at least 3 images).
        </div>
      ) : (
        <div className="space-y-3">
          {products.map(p => (
            <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-[#E8D5A3] bg-white p-4">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded bg-[#E8D5A3]/30">
                {p.images[0] && <Image src={p.images[0]} alt={p.name} fill className="object-cover" />}
              </div>
              <div className="flex-1">
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-[#7A6856]">{formatNGN(p.price)} · {p.category} · Stock: {p.quantity ?? 0}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-wider ${p.status === 'available' ? 'bg-[#B8962E]/10 text-[#7A5C00]' : 'bg-[#5C3D2E]/10 text-[#7A6856]'}`}>
                {p.status === 'available' ? 'Available' : 'Sold out'}
              </span>
              <div className="flex items-center gap-2">
                <form action={toggleStatusAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="status" value={p.status === 'available' ? 'sold_out' : 'available'} />
                  <button className="rounded border border-[#E8D5A3] px-3 py-1.5 text-xs">
                    Mark {p.status === 'available' ? 'sold out' : 'available'}
                  </button>
                </form>
                <Link href={`/admin/products/${p.id}`} className="rounded border border-[#E8D5A3] px-3 py-1.5 text-xs">Edit</Link>
                <form action={deleteProductAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="rounded border border-red-200 px-3 py-1.5 text-xs text-red-600">Delete</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

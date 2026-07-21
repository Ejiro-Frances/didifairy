import Link from 'next/link'
import { notFound } from 'next/navigation'
import AddToCartButton from '@/components/product/add-to-cart-button'
import ProductGallery from '@/components/product/product-gallery'
import Navbar from '@/components/nav-bar'
import CartDrawer from '@/components/ui/cart-drawer'
import { getProductById } from '@/lib/products'
import { formatNGN } from '@/lib/utils'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) notFound()

  const isAvailable = product.status === 'available'

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FDFAF5] px-6 py-24 text-[#1A1208] lg:px-16">
        <div className="mx-auto max-w-6xl">
          <Link href="/#shop" className="mb-8 inline-block text-sm text-[#5C3D2E] underline">
            ← Back to collection
          </Link>

          <div className="grid gap-10 lg:grid-cols-2">
            <ProductGallery images={product.images} video={product.video} name={product.name} />

            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8962E]">{product.category}</p>
              <h1 className="mt-2 font-cormorant text-4xl">{product.name}</h1>
              <p className="mt-3 text-2xl font-medium text-[#5C3D2E]">{formatNGN(product.price)}</p>

              <span
                className={`mt-4 inline-block rounded-full border px-3 py-1 text-[9px] uppercase tracking-[0.18em] ${
                  isAvailable
                    ? 'border-[#E8D5A3] bg-[#B8962E]/10 text-[#7A5C00]'
                    : 'border-[#D3C4B8] bg-[#5C3D2E]/5 text-[#7A6856]'
                }`}
              >
                {isAvailable ? 'Available' : 'Sold out'}
              </span>

              <p className="mt-6 leading-relaxed text-[#7A6856]">{product.description}</p>

              <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-[#E8D5A3] pt-6 text-sm">
                {product.color && (
                  <div><dt className="text-[#7A6856]">Color</dt><dd className="font-medium">{product.color}</dd></div>
                )}
                {product.length && (
                  <div><dt className="text-[#7A6856]">Length</dt><dd className="font-medium">{product.length}</dd></div>
                )}
                {product.closure && (
                  <div><dt className="text-[#7A6856]">Closure</dt><dd className="font-medium">{product.closure}</dd></div>
                )}
              </dl>

              <div className="mt-8 max-w-sm">
                <AddToCartButton product={product} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <CartDrawer />
    </>
  )
}

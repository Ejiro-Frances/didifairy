import { notFound } from 'next/navigation'
import ProductForm from '@/components/admin/product-form'
import { getProductById } from '@/lib/products'
import { updateProductAction } from '../actions'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) notFound()

  return (
    <div>
      <h1 className="mb-6 font-cormorant text-3xl">Edit product</h1>
      <ProductForm action={updateProductAction} submitLabel="Save changes" product={product} />
    </div>
  )
}

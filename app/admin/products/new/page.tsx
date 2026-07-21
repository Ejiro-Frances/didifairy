import ProductForm from '@/components/admin/product-form'
import { createProductAction } from '../actions'

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-6 font-cormorant text-3xl">New product</h1>
      <ProductForm action={createProductAction} submitLabel="Create product" />
    </div>
  )
}

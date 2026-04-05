import { products } from '@/lib/data'
import ProductCard from '@/components/ui/product-card'

export default function ProductsSection() {
    return (
        <section id="shop" className="py-24 px-6 lg:px-16 bg-[#FDFAF5]">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <p className="text-[10px] tracking-[0.3em] uppercase text-[#B8962E] mb-2">Our collection</p>
                        <h2 className="font-cormorant text-4xl lg:text-5xl font-light text-[#1A1208]">
                            Available <em className="text-[#5C3D2E]">pieces</em>
                        </h2>
                    </div>
                    <a href="#" className="hidden md:block text-[10px] tracking-[0.18em] uppercase text-[#7A6856] border-b border-[#E8D5A3] pb-0.5 hover:text-[#B8962E] hover:border-[#B8962E] transition-colors">
                        View all →
                    </a>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}
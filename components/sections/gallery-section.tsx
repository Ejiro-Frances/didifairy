import { reviews } from '@/lib/data'

const galleryBgs = [
    'linear-gradient(160deg,#C9A84C30,#8B225240)',
    'linear-gradient(160deg,#8B225240,#3D1C0250)',
    'linear-gradient(160deg,#3D1C0250,#1A0A2E55)',
    'linear-gradient(160deg,#4A194260,#5C3D2E40)',
    'linear-gradient(160deg,#1A0A2E55,#C9A84C30)',
    'linear-gradient(160deg,#5C3D2E40,#4A194260)',
]

export default function GallerySection() {
    return (
        <section id="gallery" className="py-24 px-6 lg:px-16 bg-[#F5F0E8]">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <p className="text-[10px] tracking-[0.3em] uppercase text-[#B8962E] mb-2">Real customers, real hair</p>
                        <h2 className="font-cormorant text-4xl lg:text-5xl font-light text-[#1A1208]">
                            Our girls <em className="text-[#5C3D2E]">slaying</em>
                        </h2>
                    </div>
                    <a href="#" className="hidden md:block text-[10px] tracking-[0.18em] uppercase text-[#7A6856] border-b border-[#E8D5A3] pb-0.5 hover:text-[#B8962E] transition-colors">
                        See all reviews →
                    </a>
                </div>

                {/* Mosaic grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-3">
                    {reviews.map((review, i) => (
                        <div
                            key={review.id}
                            className={`relative overflow-hidden rounded-sm ${i === 0 ? 'row-span-2' : ''}`}
                            style={{ background: galleryBgs[i % galleryBgs.length] }}
                        >
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1208]/60 via-transparent to-transparent" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                <p className="text-[10px] text-[#FDFAF5]/60 mb-0.5">{review.handle}</p>
                                {i === 0 && (
                                    <>
                                        <p className="text-[12px] text-[#FDFAF5] font-medium leading-snug mb-1">"{review.quote}"</p>
                                        <div className="flex gap-0.5">
                                            {Array.from({ length: review.rating }).map((_, s) => (
                                                <span key={s} className="text-[#B8962E] text-[11px]">★</span>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-8 text-center">
                    <a
                        href="https://wa.me/2348000000000"
                        className="inline-block text-[11px] tracking-[0.15em] uppercase text-[#7A6856] border border-[#B8962E] px-8 py-3 hover:bg-[#B8962E] hover:text-[#FDFAF5] transition-all"
                    >
                        Send us your photo · Get featured
                    </a>
                </div>
            </div>
        </section>
    )
}
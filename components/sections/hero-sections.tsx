import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function HeroSection() {
    return (
        <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2 pt-16">
            {/* Left */}
            <div className="flex flex-col justify-center px-6 lg:px-16 py-20 bg-[#FDFAF5]">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#B8962E] mb-5">Lagos · Premium Human Hair</p>

                <h1 className="font-cormorant text-5xl lg:text-7xl font-light leading-[1.05] text-[#1A1208] mb-6">
                    Wear the hair<br />
                    you <em className="text-[#5C3D2E]">deserve.</em>
                </h1>

                <p className="text-[13px] leading-[1.9] text-[#7A6856] max-w-sm mb-10">
                    Premium raw and virgin human hair. Every bundle curated, every closure perfected — delivered to your door across Nigeria.
                </p>

                <div className="flex flex-wrap gap-4 items-center">
                    <a
                        href="#shop"
                        className="bg-[#1A1208] text-[#FDFAF5] px-8 py-4 text-[10px] tracking-[0.2em] uppercase hover:bg-[#5C3D2E] transition-colors flex items-center gap-2"
                    >
                        Shop now <ArrowRight size={13} />
                    </a>
                    <a
                        href="#gallery"
                        className="text-[10px] tracking-[0.2em] uppercase text-[#B8962E] border-b border-[#E8D5A3] pb-0.5 hover:border-[#B8962E] transition-colors"
                    >
                        See customer reviews
                    </a>
                </div>

                {/* Stats */}
                <div className="flex gap-8 mt-16 pt-10 border-t border-[#E8D5A3]/50">
                    {[
                        { num: '500+', label: 'Happy clients' },
                        { num: '100%', label: 'Raw human hair' },
                        { num: '48hr', label: 'Lagos delivery' },
                    ].map(stat => (
                        <div key={stat.label} className="border-l-2 border-[#B8962E] pl-3">
                            <p className="font-cormorant text-2xl text-[#1A1208]">{stat.num}</p>
                            <p className="text-[9px] tracking-[0.15em] uppercase text-[#7A6856]/60">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right — hero visual */}
            <div className="relative min-h-[60vh] lg:min-h-[70vh] overflow-hidden">
                {/* bg-[#E8D5A3] */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#C9A84C18 0%,#5C3D2E30 100%)' }} />
                <div className='relative overflow-hidden h-[90vh]'>   
                <Image src="/images/long-brown-bone-straight.png" alt="Deep Wave" width={800} height={800}   loading='eager'/>
                </div>
                {/* <Image src="/images/long-pixie-curls.png" fill alt="Deep Wave" className="" /> */}

                {/* Decorative large text */}
                {/* <p className="absolute z-100 text-[#E8D5A3] bottom-[-16px] right-4 font-cormorant text-[100px] font-light italic text-[#1A1208]/05 select-none whitespace-nowrap">
                    didifairy
                </p> */}

                {/* Featured badge */}
                <div className="absolute left-0 bottom-0 z-10 bg-[#FDFAF5] border-l-[3px] border-[#B8962E] px-4 py-3">
                    <p className="text-[9px] tracking-[0.2em] uppercase text-[#B8962E] mb-1">Featured piece</p>
                    <p className="font-cormorant text-lg italic text-[#1A1208]">300g Deep wave · 30inch · 5X5 closure</p>
                    <p className="text-[10px] text-[#7A6856]">₦750,000 — Available now</p>
                    Length : 30inch



                </div>
            </div>
        </section>
    )
}
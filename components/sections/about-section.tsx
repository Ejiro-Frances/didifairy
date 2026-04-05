export default function AboutSection() {
    return (
        <section id="about" className="bg-[#1A1208] py-24 px-6 lg:px-16">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Text side */}
                <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-[#B8962E] mb-4">Our story</p>
                    <h2 className="font-cormorant text-4xl lg:text-5xl font-light text-[#FDFAF5] leading-[1.1] mb-6">
                        Hair that tells<br />
                        your <em className="text-[#E8D5A3]">story.</em>
                    </h2>
                    <p className="text-[13px] leading-loose text-[#FDFAF5]/50 mb-8 max-w-md">
                        Didifairy was born from a simple belief — every woman deserves hair that makes her feel powerful, seen, and beautiful. We source only the finest raw human hair, cut once, never chemically processed.
                    </p>
                    <p className="text-[13px] leading-loose text-[#FDFAF5]/50 mb-10 max-w-md">
                        Based in Lagos, shipping across Nigeria. Every order is personally inspected before it leaves our hands.
                    </p>
                    <a
                        href="https://wa.me/2348000000000"
                        className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase bg-[#B8962E] text-[#1A1208] px-7 py-3.5 font-medium hover:bg-[#E8D5A3] transition-colors"
                    >
                        Chat with us on WhatsApp
                    </a>
                </div>

                {/* Visual side */}
                <div className="relative">
                    <div className="aspect-[4/5] bg-[#2C1810] rounded-sm relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <p className="font-cormorant text-5xl italic font-light text-[#FDFAF5]/10">didifairy</p>
                            </div>
                        </div>
                        {/* Decorative accent */}
                        <div className="absolute top-6 left-6 w-12 h-px bg-[#B8962E]" />
                        <div className="absolute top-6 left-6 w-px h-12 bg-[#B8962E]" />
                        <div className="absolute bottom-6 right-6 w-12 h-px bg-[#B8962E]" />
                        <div className="absolute bottom-6 right-6 w-px h-12 bg-[#B8962E]" />
                    </div>

                    {/* Stats overlay */}
                    <div className="absolute -bottom-6 -left-6 bg-[#FDFAF5] p-5 grid grid-cols-3 gap-5 shadow-lg">
                        {[
                            { num: '500+', label: 'Clients' },
                            { num: '3yrs', label: 'Experience' },
                            { num: '★ 5.0', label: 'Rating' },
                        ].map(s => (
                            <div key={s.label} className="border-l-2 border-[#B8962E] pl-3">
                                <p className="font-cormorant text-xl text-[#1A1208]">{s.num}</p>
                                <p className="text-[9px] tracking-[0.15em] uppercase text-[#7A6856]">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    )
}
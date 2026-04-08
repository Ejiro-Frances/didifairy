import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-[#120E06] text-[#FDFAF5]">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
                <div>
                    <p className="font-cormorant text-2xl tracking-wider mb-4">
                        didi<em className="text-[#B8962E] not-italic">fairy</em>
                    </p>
                    <p className="text-[12px] leading-relaxed text-[#FDFAF5]/40 max-w-xs">
                        Premium raw and virgin human hair. Curated with love, delivered to your door anywhere in Nigeria.
                    </p>
                </div>

                <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#B8962E] mb-4">Quick links</p>
                    <div className="flex flex-col gap-3">
                        {['Shop', 'Customer Gallery', 'About Us', 'Contact'].map(l => (
                            <Link key={l} href="#" className="text-[12px] text-[#FDFAF5]/50 hover:text-[#B8962E] transition-colors tracking-wide">
                                {l}
                            </Link>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#B8962E] mb-4">Get in touch</p>
                    <div className="flex flex-col gap-2 text-[12px] text-[#FDFAF5]/50">
                        <span>Lagos, Nigeria</span>
                        <a href="https://wa.me/2347093808804" className="hover:text-[#B8962E] transition-colors">WhatsApp us</a>
                        <a href="https://www.instagram.com/didifairy_ng/" className="hover:text-[#B8962E] transition-colors">@didifairy</a>
                    </div>
                    <div className="flex gap-4 mt-6">
                        {['TikTok', 'WhatsApp'].map(s => (
                            <a key={s} href="#" className="text-[10px] tracking-[0.15em] uppercase text-[#FDFAF5]/30 hover:text-[#B8962E] transition-colors">
                                {s}
                            </a>
                            ))}
                            <a href="https://www.instagram.com/didifairy_ng/" className="text-[10px] tracking-[0.15em] uppercase text-[#FDFAF5]/30 hover:text-[#B8962E] transition-colors">
                                Instagram
                            </a>

                    </div>
                </div>
            </div>

            <div className="border-t border-[#FDFAF5]/5 px-6 lg:px-10 py-4 flex items-center justify-between">
                <p className="text-[10px] tracking-[0.12em] uppercase text-[#FDFAF5]/20">
                    © 2025 Didifairy. All rights reserved.
                </p>
                <p className="text-[10px] text-[#FDFAF5]/20">Made with love in Lagos</p>
            </div>
        </footer>
    )
}
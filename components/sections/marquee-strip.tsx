const items = [
  'Free delivery in Lagos',
  'Raw Vietnamese hair',
  'Try-on before you buy',
  '100% authentic reviews',
  'Pay on delivery available',
  'Free delivery in Lagos',
  'Raw Vietnamese hair',
  'Try-on before you buy',
  '100% authentic reviews',
  'Pay on delivery available',
]

export default function MarqueeStrip() {
  return (
    <div className="bg-[#1A1208] py-3 overflow-hidden whitespace-nowrap">
      <div className="inline-flex animate-marquee">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-6 px-6">
            <span className="text-[10px] tracking-[0.22em] uppercase text-[#B8962E]">{item}</span>
            <span className="text-[#B8962E]/30 text-xs">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
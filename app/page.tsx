import HeroSection from '@/components/sections/HeroSection'
import MarqueeStrip from '@/components/sections/MarqueeStrip'
import ProductsSection from '@/components/sections/ProductsSection'
import GallerySection from '@/components/sections/GallerySection'
import AboutSection from '@/components/sections/AboutSection'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <MarqueeStrip />
      <ProductsSection />
      <GallerySection />
      <AboutSection />
    </main>
  )
}
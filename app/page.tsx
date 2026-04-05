import HeroSection from '@/components/sections/hero-sections'
import MarqueeStrip from '@/components/sections/marquee-strip'
import ProductsSection from '@/components/sections/product-section'
import GallerySection from '@/components/sections/gallery-section'
import AboutSection from '@/components/sections/about-section'
import Navbar from '@/components/nav-bar'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />.
        <MarqueeStrip />
        <ProductsSection />
        <GallerySection />
        <AboutSection />
      </main>
    </>
  )
}
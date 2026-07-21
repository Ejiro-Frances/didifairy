import Navbar from '@/components/nav-bar'
import Footer from '@/components/footer'
import ContactForm from '@/components/contact/contact-form'

export const metadata = {
  title: 'Contact — Didifairy',
  description: 'Get in touch with Didifairy for orders, tracking and enquiries.',
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FDFAF5] px-6 py-24 text-[#1A1208]">
        <div className="mx-auto max-w-xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8962E]">Contact</p>
          <h1 className="mb-2 font-cormorant text-4xl">Get in touch</h1>
          <p className="mb-8 text-sm text-[#7A6856]">
            Questions about an order, tracking or a product? Send us a message and we’ll respond shortly.
          </p>
          <ContactForm />
        </div>
      </main>
      <Footer />
    </>
  )
}

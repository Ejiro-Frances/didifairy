import Link from 'next/link'
import SignupForm from '@/components/auth/signup-form'

export default function SignupPage() {
  return (
    <main className="auth-bg flex min-h-screen items-center justify-center px-6 py-24 text-[#1A1208]">
      <div className="w-full max-w-md rounded-2xl border border-[#E8D5A3]/60 bg-white/85 p-8 shadow-xl backdrop-blur-sm">
        <Link href="/" className="font-cormorant text-2xl">didi<em className="not-italic text-[#B8962E]">fairy</em></Link>
        <h1 className="mt-4 mb-6 font-cormorant text-2xl">Create your account</h1>
        <SignupForm />
      </div>
    </main>
  )
}

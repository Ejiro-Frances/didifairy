import Link from 'next/link'
import LoginForm from '@/components/auth/login-form'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; message?: string }>
}) {
  const { redirect, message } = await searchParams

  return (
    <main className="auth-bg flex min-h-screen items-center justify-center px-6 py-24 text-[#1A1208]">
      <div className="w-full max-w-md rounded-2xl border border-[#E8D5A3]/60 bg-white/85 p-8 shadow-xl backdrop-blur-sm">
        <Link href="/" className="font-cormorant text-2xl">didi<em className="not-italic text-[#B8962E]">fairy</em></Link>
        <h1 className="mt-4 mb-6 font-cormorant text-2xl">Welcome back</h1>
        <LoginForm redirectTo={redirect} message={message} />
      </div>
    </main>
  )
}

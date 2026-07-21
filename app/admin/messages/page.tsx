import { listContactMessages } from '@/lib/admin'

export default async function AdminMessagesPage() {
  const messages = await listContactMessages()

  return (
    <div>
      <h1 className="mb-1 font-cormorant text-3xl">Messages</h1>
      <p className="mb-8 text-sm text-[#7A6856]">Enquiries submitted through the contact form.</p>

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E8D5A3] bg-white p-10 text-center text-[#7A6856]">
          No messages yet.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map(m => (
            <div key={m.id} className="rounded-2xl border border-[#E8D5A3] bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">{m.name}</p>
                <p className="text-xs text-[#7A6856]">{new Date(m.createdAt).toLocaleString()}</p>
              </div>
              <p className="text-sm text-[#7A6856]">{m.email}{m.phone ? ` • ${m.phone}` : ''}</p>
              <p className="mt-3 text-sm">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

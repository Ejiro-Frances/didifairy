import { listProfiles } from '@/lib/admin'

export default async function AdminCustomersPage() {
  const customers = await listProfiles()

  return (
    <div>
      <h1 className="mb-1 font-cormorant text-3xl">Customers</h1>
      <p className="mb-8 text-sm text-[#7A6856]">Signed-up customers, their phone and delivery address.</p>

      {customers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E8D5A3] bg-white p-10 text-center text-[#7A6856]">
          No registered customers yet. (Guest orders still appear on the dashboard.)
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#E8D5A3] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#E8D5A3] text-xs uppercase tracking-wider text-[#7A6856]">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Delivery address</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} className="border-b border-[#E8D5A3]/50 last:border-0">
                  <td className="px-4 py-3 font-medium">{c.fullName || '—'}</td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3">{c.phone || '—'}</td>
                  <td className="px-4 py-3 text-[#7A6856]">
                    {[c.address, c.city, c.state].filter(Boolean).join(', ') || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

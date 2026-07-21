// Bank transfer details shown to customers. Values come from NEXT_PUBLIC_* env
// so they render on both server and client. Safe to expose (they're public
// payment details).
export default function BankDetails() {
  const bank = process.env.NEXT_PUBLIC_BANK_NAME
  const accountName = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME
  const accountNumber = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER

  if (!bank || !accountNumber) {
    return (
      <div className="rounded-2xl border border-dashed border-[#E8D5A3] bg-[#FFF9ED] p-4 text-sm text-[#7A6856]">
        Bank details will be shown here once configured. After payment, you can attach
        your receipt on the order page.
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-[#E8D5A3] bg-[#FFF9ED] p-4 text-sm">
      <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#B8962E]">Pay via bank transfer</p>
      <dl className="space-y-1">
        <div className="flex justify-between"><dt className="text-[#7A6856]">Bank</dt><dd className="font-medium">{bank}</dd></div>
        <div className="flex justify-between"><dt className="text-[#7A6856]">Account name</dt><dd className="font-medium">{accountName}</dd></div>
        <div className="flex justify-between"><dt className="text-[#7A6856]">Account number</dt><dd className="font-mono font-semibold">{accountNumber}</dd></div>
      </dl>
      <p className="mt-3 text-xs text-[#7A6856]">
        After transferring, place your order — you’ll be able to attach your payment receipt on the
        confirmation page for the admin to verify.
      </p>
    </div>
  )
}

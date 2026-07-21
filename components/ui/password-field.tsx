'use client'

import { useState, InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'

// Password input with a custom show/hide eye. The browser's native reveal
// (Edge) is hidden in globals.css so this is the only, consistent control.
export function PasswordField({
  label,
  name,
  error,
  required,
  ...props
}: { label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-xs font-medium text-[#5C3D2E]">
        {label}
        {required && <span className="text-red-500" aria-hidden="true"> *</span>}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={visible ? 'text' : 'password'}
          required={required}
          className={`w-full rounded border border-[#E8D5A3] px-3 py-2 pr-10 text-sm outline-none focus:border-[#B8962E] ${
            error ? 'border-red-500' : ''
          }`}
          aria-invalid={!!error}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-[#7A6856] hover:text-[#B8962E]"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

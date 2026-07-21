import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

const inputClass =
  'w-full rounded border border-[#E8D5A3] px-3 py-2 text-sm outline-none focus:border-[#B8962E]'

function Label({ label, name, required }: { label: string; name?: string; required?: boolean }) {
  return (
    <label htmlFor={name} className="mb-1 block text-xs font-medium text-[#5C3D2E]">
      {label}
      {required && <span className="text-red-500" aria-hidden="true"> *</span>}
    </label>
  )
}

export function Field({
  label,
  name,
  error,
  required,
  ...props
}: { label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label label={label} name={name} required={required} />
      <input
        id={name}
        name={name}
        required={required}
        className={`${inputClass} ${error ? 'border-red-500' : ''}`}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

export function TextareaField({
  label,
  name,
  error,
  required,
  ...props
}: { label: string; error?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <Label label={label} name={name} required={required} />
      <textarea
        id={name}
        name={name}
        required={required}
        className={`${inputClass} min-h-24 ${error ? 'border-red-500' : ''}`}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

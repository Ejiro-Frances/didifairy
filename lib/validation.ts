import { z } from 'zod'

// Shared field pieces
const name = z.string().trim().min(1, 'Required').max(80)
const email = z.string().trim().min(1, 'Required').email('Enter a valid email')
// Phone is compulsory across the app (checkout + signup).
const phone = z
  .string()
  .trim()
  .min(7, 'Enter a valid phone number')
  .regex(/^[0-9+\-\s()]+$/, 'Enter a valid phone number')

export const checkoutSchema = z.object({
  firstName: name,
  lastName: name,
  email,
  phone,
  address: z.string().trim().min(5, 'Enter your delivery address'),
  city: z.string().trim().min(1, 'Required'),
  state: z.string().trim().min(1, 'Required'),
  notes: z.string().trim().max(500).optional().or(z.literal('')),
})
export type CheckoutInput = z.infer<typeof checkoutSchema>

export const contactSchema = z.object({
  name,
  email,
  phone: phone.optional().or(z.literal('')),
  message: z.string().trim().min(5, 'Please enter a message').max(1000),
})
export type ContactInput = z.infer<typeof contactSchema>

export const loginSchema = z.object({
  email,
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
export type LoginInput = z.infer<typeof loginSchema>

export const signupSchema = z
  .object({
    fullName: name,
    email,
    phone,
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    address: z.string().trim().max(200).optional().or(z.literal('')),
    city: z.string().trim().max(80).optional().or(z.literal('')),
    state: z.string().trim().max(80).optional().or(z.literal('')),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
export type SignupInput = z.infer<typeof signupSchema>

export const productSchema = z.object({
  name: z.string().trim().min(1, 'Required').max(120),
  description: z.string().trim().max(1000).optional().or(z.literal('')),
  price: z.coerce.number().int('Whole Naira only').min(0, 'Price must be positive'),
  status: z.enum(['available', 'sold_out']),
  color: z.string().trim().max(60).optional().or(z.literal('')),
  length: z.string().trim().max(60).optional().or(z.literal('')),
  closure: z.string().trim().max(60).optional().or(z.literal('')),
  category: z.string().trim().min(1, 'Required').max(60),
  featured: z.boolean().optional(),
})
export type ProductInput = z.infer<typeof productSchema>

// Turns a ZodError into a simple { field: message } map for form rendering.
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.')
    if (key && !out[key]) out[key] = issue.message
  }
  return out
}

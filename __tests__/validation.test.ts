import { describe, expect, it } from 'vitest'
import { checkoutSchema, contactSchema, productSchema, signupSchema, fieldErrors } from '@/lib/validation'

const validCustomer = {
  firstName: 'Ada',
  lastName: 'Okafor',
  email: 'ada@example.com',
  phone: '08012345678',
  address: '12 Marina Road',
  city: 'Lagos',
  state: 'Lagos',
}

describe('checkoutSchema', () => {
  it('accepts a complete customer', () => {
    expect(checkoutSchema.safeParse(validCustomer).success).toBe(true)
  })

  it('requires a phone number', () => {
    const result = checkoutSchema.safeParse({ ...validCustomer, phone: '' })
    expect(result.success).toBe(false)
    if (!result.success) expect(fieldErrors(result.error).phone).toBeTruthy()
  })

  it('rejects an invalid email', () => {
    const result = checkoutSchema.safeParse({ ...validCustomer, email: 'nope' })
    expect(result.success).toBe(false)
    if (!result.success) expect(fieldErrors(result.error).email).toBeTruthy()
  })
})

describe('signupSchema', () => {
  it('requires phone and a 6+ char password', () => {
    const bad = signupSchema.safeParse({ fullName: 'Ada', email: 'a@b.com', phone: '', password: '123', confirmPassword: '123' })
    expect(bad.success).toBe(false)
    const good = signupSchema.safeParse({ fullName: 'Ada', email: 'a@b.com', phone: '08012345678', password: 'secret1', confirmPassword: 'secret1' })
    expect(good.success).toBe(true)
  })

  it('rejects mismatched passwords with an error on confirmPassword', () => {
    const result = signupSchema.safeParse({ fullName: 'Ada', email: 'a@b.com', phone: '08012345678', password: 'secret1', confirmPassword: 'secret2' })
    expect(result.success).toBe(false)
    if (!result.success) expect(fieldErrors(result.error).confirmPassword).toBe('Passwords do not match')
  })
})

describe('contactSchema', () => {
  it('needs a message of a few characters', () => {
    expect(contactSchema.safeParse({ name: 'Ada', email: 'a@b.com', message: 'hi' }).success).toBe(false)
    expect(contactSchema.safeParse({ name: 'Ada', email: 'a@b.com', message: 'Hello there' }).success).toBe(true)
  })
})

describe('productSchema', () => {
  it('coerces price from a string to an integer', () => {
    const result = productSchema.safeParse({ name: 'Wig', price: '590000', status: 'available', category: 'Bundles' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.price).toBe(590000)
  })

  it('rejects an unknown status', () => {
    expect(
      productSchema.safeParse({ name: 'Wig', price: 1000, status: 'nope', category: 'Bundles' }).success
    ).toBe(false)
  })
})

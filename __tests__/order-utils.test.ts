import { describe, expect, it } from 'vitest'
import { createOrderNumber, createTrackingCode, buildWhatsAppUrl } from '@/lib/order-utils'

describe('order-utils', () => {
  it('generates order numbers in the DDF-<date>-<rand> format', () => {
    expect(createOrderNumber()).toMatch(/^DDF-\d{8}-[A-Z0-9]{4,6}$/)
  })

  it('generates distinct order numbers across calls (entropy retained)', () => {
    const codes = new Set(Array.from({ length: 200 }, () => createOrderNumber()))
    // With 6 base36 chars, 200 draws should essentially never collide.
    expect(codes.size).toBe(200)
  })

  it('derives a unique tracking code that preserves the random suffix', () => {
    const a = 'DDF-20260721-ABC123'
    const b = 'DDF-20260721-XYZ789'
    expect(createTrackingCode(a)).not.toBe(createTrackingCode(b))
    expect(createTrackingCode(a)).toContain('ABC123')
  })

  it('builds a WhatsApp url containing the order number', () => {
    const url = buildWhatsAppUrl({ orderNumber: 'DDF-20260721-ABC123', status: 'pending' })
    expect(url).toContain('wa.me')
    expect(decodeURIComponent(url)).toContain('DDF-20260721-ABC123')
  })
})

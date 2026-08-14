import { describe, it, expect } from 'vitest'
import { computeCartTotals } from './useCartStore'

describe('computeCartTotals', () => {
  it('sums subtotal, delivery and tax for a non-empty cart', () => {
    const totals = computeCartTotals([
      { product: { price: 100, originalPrice: 120 }, qty: 2 },
    ])

    expect(totals.subTotal).toBe(200)
    expect(totals.originalSubTotal).toBe(240)
    expect(totals.discount).toBe(40)
    expect(totals.deliveryCharge).toBe(100)
    expect(totals.tax).toBe(10)
    expect(totals.grandTotal).toBe(310)
  })

  it('charges no delivery fee for an empty cart', () => {
    const totals = computeCartTotals([])
    expect(totals.deliveryCharge).toBe(0)
    expect(totals.grandTotal).toBe(0)
  })
})

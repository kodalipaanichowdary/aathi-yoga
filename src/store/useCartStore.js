import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DELIVERY_CHARGE = 100
const TAX_RATE = 0.05

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem(product) {
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id)
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
              ),
            }
          }
          return { items: [...state.items, { id: product.id, qty: 1 }] }
        })
      },

      incrementItem(id) {
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item)),
        }))
      },

      decrementItem(id) {
        set((state) => ({
          items: state.items
            .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
            .filter((item) => item.qty > 0),
        }))
      },

      removeItem(id) {
        set((state) => ({ items: state.items.filter((item) => item.id !== id) }))
      },

      clearCart() {
        set({ items: [] })
      },

      itemCount() {
        return get().items.reduce((total, item) => total + item.qty, 0)
      },
    }),
    {
      name: 'aathi-yoga-cart',
      partialize: (state) => ({ items: state.items }),
    },
  ),
)

export function computeCartTotals(lineItems) {
  const subTotal = lineItems.reduce((sum, line) => sum + line.product.price * line.qty, 0)
  const originalSubTotal = lineItems.reduce((sum, line) => sum + (line.product.originalPrice ?? line.product.price) * line.qty, 0)
  const discount = Math.max(0, originalSubTotal - subTotal)
  const deliveryCharge = lineItems.length > 0 ? DELIVERY_CHARGE : 0
  const tax = Math.round(subTotal * TAX_RATE)
  const grandTotal = subTotal + deliveryCharge + tax
  return { subTotal, originalSubTotal, discount, deliveryCharge, tax, grandTotal }
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Saved-for-later product ids, persisted so the heart state survives a reload.
 * Presentation-only: nothing in the cart or checkout flow reads from this.
 */
export const useWishlistStore = create(
  persist(
    (set) => ({
      ids: [],
      toggle(id) {
        set((state) => ({
          ids: state.ids.includes(id) ? state.ids.filter((saved) => saved !== id) : [...state.ids, id],
        }))
      },
    }),
    { name: 'aathi-yoga-wishlist' },
  ),
)

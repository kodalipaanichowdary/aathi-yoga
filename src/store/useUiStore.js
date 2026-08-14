import { create } from 'zustand'

export const useUiStore = create((set) => ({
  openProductId: null,
  cartDrawerOpen: false,
  openArticleId: null,

  openProduct(id) {
    set({ openProductId: id, cartDrawerOpen: false })
  },
  closeProduct() {
    set({ openProductId: null })
  },
  openCartDrawer() {
    set({ cartDrawerOpen: true, openProductId: null })
  },
  closeCartDrawer() {
    set({ cartDrawerOpen: false })
  },
  openArticle(id) {
    set({ openArticleId: id })
  },
  closeArticle() {
    set({ openArticleId: null })
  },
}))

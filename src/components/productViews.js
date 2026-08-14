/**
 * The three framings ProductImage can render. The product sheet's gallery pages
 * through them, so its indicators map to genuinely different compositions.
 */
export const PRODUCT_VIEWS = [
  { id: 'front', label: 'Front' },
  { id: 'detail', label: 'Detail' },
  { id: 'inuse', label: 'In use' },
]

export const PRODUCT_VIEW_ICON_SCALE = { front: 1, detail: 1.5, inuse: 0.72 }

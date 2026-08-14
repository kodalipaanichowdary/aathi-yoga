import aathilifeManifest from '../assets/products/aathilife-products.json'

export const CATEGORIES = [
  { slug: 'bracelets', label: 'Bracelets', icon: 'bracelet', image: '/assets/products/bracelets/bracelets-amethyst-gemstone-bracelet.jpg' },
  { slug: 'mala', label: 'Mala', icon: 'mala', image: '/assets/products/mala/mala-1-face-rudraksha-silver-coated-mala-ekamukhi.jpg' },
  { slug: 'ring', label: 'Rings', icon: 'ring', image: '/assets/products/ring/ring-amethyst-gem-ring-free-size.jpg' },
  { slug: 'rudraksha-bracelet', label: 'Rudraksha Bracelet', icon: 'rudraksha', image: '/assets/products/rudraksha-bracelet/rudraksha-bracelet-2-face-rudraksha-bracelet.jpg' },
  { slug: 'yoga-mat', label: 'Yoga Mat', icon: 'mat', image: '/assets/products/yoga-mat/yoga-mat-sambu-grass-with-jute-yoga-mat-2-x-6.jpg' },
  { slug: 'accessories', label: 'Accessories', icon: 'bag', image: '/assets/products/accessories/accessories-aathi-shiva-rudraksha-5face-panchaloha-impon-dol.jpg' },
  { slug: 'metal-god-idols', label: 'Metal God Idols', icon: 'idol', image: '/assets/products/metal-god-idols/metal-god-idols-murugan-idol-in-gold-finish-for-home.jpg' },
  { slug: 'pendant', label: 'Pendant', icon: 'pendant', image: '/assets/products/pendant/pendant-amethyst-gem-pendant.jpg' },
  { slug: 'tulasi-mala', label: 'Tulasi Mala', icon: 'tulasi', image: '/assets/products/tulasi-mala/tulasi-mala-pure-tulasi-mala.jpg' },
]

/**
 * Presentation-only signals shown as badges on product cards and in the product
 * sheet. Derived from existing fields rather than hand-written per item, so the
 * whole catalogue carries them consistently without 30 extra literals to keep in
 * sync. Nothing in the cart or checkout path reads these.
 */
function shopSignals(price, ratingCount) {
  const scarce = ratingCount < 100
  return {
    stock: scarce ? 'low' : 'in',
    stockLeft: scarce ? 3 + (ratingCount % 5) : null,
    delivery: price >= 1500 ? 'Free delivery' : '2-day delivery',
  }
}

function p(id, category, name, shortDesc, price, originalPrice, rating, ratingCount, meta, tags = []) {
  return {
    id,
    category,
    name,
    shortDesc,
    price,
    originalPrice,
    rating,
    ratingCount,
    meta,
    tags,
    icon: CATEGORIES.find((c) => c.slug === category).icon,
    ...shopSignals(price, ratingCount),
  }
}

export const PRODUCTS = [
  p('brc-01', 'bracelets', 'Sphatik Crystal Bracelet', 'Clear quartz beads for calm and clarity', 499, 649, 4.5, 320, '8 mm beads · stretch fit', ['featured', 'popular']),
  p('brc-02', 'bracelets', 'Tiger Eye Protection Bracelet', 'Banded stone beads worn for focus and strength', 599, 749, 4.4, 210, '8 mm beads · elastic cord', ['trending']),
  p('brc-03', 'bracelets', 'Navratna Nine-Gem Bracelet', 'Nine sacred gemstones on a single strand', 899, 1099, 4.6, 156, '9 gemstones · adjustable', ['recommended']),

  p('mala-01', 'mala', 'Sandalwood 108 Bead Mala', 'Fragrant sandalwood mala for daily japa', 799, 999, 4.7, 268, '108 beads · sandalwood', ['featured', 'bestseller']),
  p('mala-02', 'mala', 'Sphatik Crystal Japa Mala', 'Clear crystal quartz mala for meditation', 1199, 1499, 4.5, 134, '108 beads · crystal quartz', ['popular']),
  p('mala-03', 'mala', 'Lotus Seed Mala', 'Traditional lotus seed beads on a knotted cord', 649, 799, 4.3, 92, '108 beads · lotus seed', ['recently-added']),

  p('ring-01', 'ring', 'Panchdhatu Navgrah Ring', 'Five-metal alloy ring for planetary balance', 699, 899, 4.4, 145, 'Five-metal alloy · adjustable', ['featured']),
  p('ring-02', 'ring', 'Silver Om Engraved Ring', 'Sterling silver band with engraved Om', 549, 699, 4.5, 201, '92.5 silver · adjustable', ['trending', 'popular']),
  p('ring-03', 'ring', 'Rudraksha Silver Ring', 'Single rudraksha bead set in a silver band', 799, 999, 4.2, 88, 'Rudraksha bead · silver band', ['recommended']),

  p('rbr-01', 'rudraksha-bracelet', '2 Face Rudraksha Bracelet', 'Two-face rudraksha beads on an elastic thread', 449, 599, 4.6, 289, '2 mukhi beads · elastic thread', ['featured', 'bestseller']),
  p('rbr-02', 'rudraksha-bracelet', 'Karungali & Rudraksha German Silver Bracelet', 'Rudraksha alternated with karungali and german silver accents', 599, 749, 4.4, 176, 'Karungali + rudraksha · silver accent', ['popular']),
  p('rbr-03', 'rudraksha-bracelet', 'Karungali with Rudraksha & Amethyst Bracelet', 'Karungali and rudraksha beads combined with amethyst', 699, 849, 4.5, 120, 'Karungali + rudraksha · amethyst beads', ['trending']),

  p('mat-01', 'yoga-mat', 'Classic Grip Yoga Mat', '6mm non-slip mat for daily practice', 999, 1299, 4.5, 812, '6 mm · 2.5 kg', ['featured', 'popular']),
  p('mat-02', 'yoga-mat', 'Cork Pro Alignment Mat', 'Natural cork mat with alignment guides', 2199, 2599, 4.7, 289, '4 mm · 2.8 kg', ['bestseller']),
  p('mat-03', 'yoga-mat', 'TravelLite Foldable Mat', 'Ultra-thin foldable mat for travel', 1499, 1799, 4.3, 356, '1.5 mm · 0.9 kg', ['recommended']),

  p('acc-01', 'accessories', 'Brass Puja Thali Set', 'Complete brass thali set for daily worship', 899, 1099, 4.5, 233, '6-piece · brass', ['featured']),
  p('acc-02', 'accessories', 'Sandalwood Incense Set', 'Slow-burning natural incense sticks', 299, 349, 4.6, 178, 'Pack of 40', ['popular']),
  p('acc-03', 'accessories', 'Foldable Mat Bag', 'Adjustable strap, fits most mat sizes', 799, 949, 4.3, 154, 'Fits up to 8mm mats', []),

  p('idol-01', 'metal-god-idols', 'Brass Ganesha Idol', 'Hand-cast brass idol for home worship', 1299, 1599, 4.7, 210, '6 inch · brass', ['featured', 'bestseller']),
  p('idol-02', 'metal-god-idols', 'Panchdhatu Lakshmi Idol', 'Five-metal alloy idol for prosperity', 1899, 2299, 4.6, 133, '5 inch · panchdhatu', ['trending']),
  p('idol-03', 'metal-god-idols', 'Silver-Plated Krishna Idol', 'Finely detailed silver-plated idol', 1599, 1899, 4.4, 97, '5 inch · silver-plated', ['recommended']),

  p('pend-01', 'pendant', 'Om Pendant with Chain', 'Silver-plated Om pendant on an 18 inch chain', 549, 699, 4.5, 245, 'Silver-plated · 18 in chain', ['featured', 'popular']),
  p('pend-02', 'pendant', 'Rudraksha Pendant Locket', 'Single mukhi rudraksha in a silver cap', 449, 599, 4.3, 168, 'Single mukhi · silver cap', ['trending']),
  p('pend-03', 'pendant', 'Sri Yantra Pendant', 'Copper pendant etched with sacred geometry', 699, 849, 4.6, 112, 'Copper · sacred geometry', ['recently-added']),

  p('tul-01', 'tulasi-mala', 'Classic Tulasi Kanti Mala', 'Traditional tulsi wood mala for daily wear', 349, 449, 4.6, 301, '108 beads · tulsi wood', ['featured', 'bestseller']),
  p('tul-02', 'tulasi-mala', 'Double Layer Tulasi Mala', 'Two-layer tulsi wood mala for extra coverage', 499, 599, 4.4, 142, '2-layer · tulsi wood', ['popular']),
  p('tul-03', 'tulasi-mala', 'Tulasi Mala with Silver Cap', 'Tulsi beads finished with a silver cap', 649, 799, 4.5, 96, '108 beads · silver capped', ['recommended', 'recently-added']),
]

/**
 * Attaches real aathilife.com product photos (scripts/scrape-aathilife-images.mjs)
 * to each demo product, round-robin across the category's photo pool so
 * siblings in the same category don't all show the same picture. Categories
 * with no scraped photos (no matching manifest key) leave `images` empty and
 * ProductImage falls back to the category glyph.
 */
const productsByCategory = new Map()
for (const product of PRODUCTS) {
  const siblings = productsByCategory.get(product.category) ?? []
  siblings.push(product)
  productsByCategory.set(product.category, siblings)
}
for (const [category, siblings] of productsByCategory) {
  const pool = aathilifeManifest[category] ?? []
  siblings.forEach((product, index) => {
    const assigned = pool.filter((_, i) => i % siblings.length === index)
    product.images = (assigned.length ? assigned : pool.slice(index, index + 1)).map((entry) => entry.localImage)
  })
}

export function getProductsByCategory(slug) {
  return PRODUCTS.filter((product) => product.category === slug)
}

export function getProductsByTag(tag) {
  return PRODUCTS.filter((product) => product.tags.includes(tag))
}

export function getProductById(id) {
  return PRODUCTS.find((product) => product.id === id) ?? null
}

export function getCategory(slug) {
  return CATEGORIES.find((category) => category.slug === slug) ?? null
}

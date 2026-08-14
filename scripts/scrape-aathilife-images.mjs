#!/usr/bin/env node
/**
 * Scrapes real product photography from aathilife.com's public product-category
 * pages and mirrors it locally so the demo catalogue can use real photos
 * instead of the generated SVG glyphs.
 *
 * Images are written to public/assets/products/<category>/ (served verbatim by
 * Vite at /assets/products/... in both dev and production builds). The
 * manifest at src/assets/products/aathilife-products.json is a plain JSON
 * import consumed by the app.
 *
 * Usage: npm run scrape:aathilife
 */
import * as cheerio from 'cheerio'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const PUBLIC_PRODUCTS_DIR = path.join(ROOT, 'public', 'assets', 'products')
const MANIFEST_PATH = path.join(ROOT, 'src', 'assets', 'products', 'aathilife-products.json')
const PREVIEW_DIR = path.join(ROOT, 'scraped-assets')

const CATEGORIES = [
  { slug: 'tulasi-mala', label: 'Tulasi Mala', url: 'https://aathilife.com/product-category/tulasi-mala/' },
  { slug: 'bracelets', label: 'Bracelets', url: 'https://aathilife.com/product-category/bracelets/' },
  { slug: 'mala', label: 'Mala', url: 'https://aathilife.com/product-category/mala/' },
  { slug: 'accessories', label: 'Accessories', url: 'https://aathilife.com/product-category/accessories/' },
  { slug: 'karungali-mala', label: 'Karungali Mala', url: 'https://aathilife.com/product-category/karungali/karungali-mala/' },
  { slug: 'metal-god-idols', label: 'Metal God Idols', url: 'https://aathilife.com/product-category/metal-god-idols/' },
  { slug: 'pendant', label: 'Pendant', url: 'https://aathilife.com/product-category/pendant/' },
  { slug: 'ring', label: 'Ring', url: 'https://aathilife.com/product-category/ring/' },
  { slug: 'yoga-mat', label: 'Yoga Mat', url: 'https://aathilife.com/product-category/yoga-mat/' },
  { slug: 'rudraksha-bracelet', label: 'Rudraksha Bracelet', url: 'https://aathilife.com/product-category/rudraksha/rudraksha-bracelet/' },
]

const TARGET_PER_CATEGORY = 10
const MAX_LISTING_PAGES = 3
const MIN_FILE_BYTES = 2000
const MIN_DIMENSION = 200
const REQUEST_DELAY_MS = 350
const USER_AGENT = 'AathiLifeCatalogSync/1.0 (internal product image sync for aathilife companion app)'

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function politeFetch(url, options = {}) {
  await sleep(REQUEST_DELAY_MS)
  return fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: '*/*' }, ...options })
}

async function fetchHtml(url) {
  const res = await politeFetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

function sanitizeName(name, maxLen = 60) {
  const slug = name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug.slice(0, maxLen).replace(/-+$/g, '')
}

function extensionFromUrl(url) {
  const match = /\.([a-zA-Z0-9]{3,4})(?:\?|#|$)/.exec(url.split('/').pop() ?? '')
  const ext = match ? match[1].toLowerCase() : 'jpg'
  return ext === 'jpeg' ? 'jpg' : ext
}

function pickLargestFromSrcset(srcset) {
  if (!srcset) return null
  const candidates = srcset
    .split(',')
    .map((entry) => entry.trim())
    .map((entry) => {
      const parts = entry.split(/\s+/)
      const url = parts[0]
      const size = parts[1]
      const width = size && size.endsWith('w') ? parseInt(size, 10) : 0
      return { url, width }
    })
    .filter((c) => c.url)
  if (!candidates.length) return null
  candidates.sort((a, b) => b.width - a.width)
  return candidates[0].url
}

function deriveOriginalFromThumb(url) {
  return url.replace(/-\d+x\d+(\.[a-zA-Z]+)$/, '$1')
}

/** Minimal, dependency-free image header sniffer (JPEG/PNG/WebP/GIF). */
function getImageDimensions(buffer) {
  if (
    buffer.length >= 24 &&
    buffer.readUInt32BE(0) === 0x89504e47 &&
    buffer.readUInt32BE(4) === 0x0d0a1a0a
  ) {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20), format: 'png' }
  }

  if (buffer.length >= 10 && buffer.slice(0, 3).toString('ascii') === 'GIF') {
    return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8), format: 'gif' }
  }

  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1
        continue
      }
      const marker = buffer[offset + 1]
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
        offset += 2
        continue
      }
      if (marker === 0xd9 || marker === 0xda) break
      const segmentLength = buffer.readUInt16BE(offset + 2)
      const isSofMarker = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc
      if (isSofMarker) {
        return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7), format: 'jpeg' }
      }
      offset += 2 + segmentLength
    }
    return { width: 0, height: 0, format: 'jpeg' }
  }

  if (
    buffer.length >= 30 &&
    buffer.slice(0, 4).toString('ascii') === 'RIFF' &&
    buffer.slice(8, 12).toString('ascii') === 'WEBP'
  ) {
    const chunk = buffer.slice(12, 16).toString('ascii')
    if (chunk === 'VP8 ') {
      return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff, format: 'webp' }
    }
    if (chunk === 'VP8L') {
      const bits = buffer.readUInt32LE(21)
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1, format: 'webp' }
    }
    if (chunk === 'VP8X') {
      return { width: buffer.readUIntLE(24, 3) + 1, height: buffer.readUIntLE(27, 3) + 1, format: 'webp' }
    }
  }

  return null
}

function parseCategoryPage(html) {
  const $ = cheerio.load(html)
  const items = []
  $('ul.products li.product').each((_, el) => {
    const $el = $(el)
    const link = $el.find('a[href*="/product/"]').first().attr('href')
    const name = $el.find('.woocommerce-loop-product__title').first().text().trim()
    if (link && name) items.push({ name, productUrl: link })
  })
  return items
}

function findNextListingPage(html) {
  const $ = cheerio.load(html)
  const next = $('nav.woocommerce-pagination a.next.page-numbers').attr('href')
  return next ?? null
}

async function collectCategoryProducts(category) {
  const seen = new Map()
  let pageUrl = category.url
  for (let page = 0; page < MAX_LISTING_PAGES && pageUrl && seen.size < TARGET_PER_CATEGORY; page += 1) {
    let html
    try {
      html = await fetchHtml(pageUrl)
    } catch (error) {
      console.log(`    ! Failed to load listing page ${pageUrl}: ${error.message}`)
      break
    }
    for (const item of parseCategoryPage(html)) {
      if (!seen.has(item.productUrl)) seen.set(item.productUrl, item)
    }
    pageUrl = findNextListingPage(html)
  }
  return Array.from(seen.values()).slice(0, TARGET_PER_CATEGORY)
}

function extractPrice($) {
  const priceNode = $('.summary .price, p.price').first()
  if (!priceNode.length) return null
  const active = priceNode.find('ins .amount, ins bdi').first()
  const target = active.length ? active : priceNode.find('.amount, bdi').last()
  const text = target.text().trim()
  return text || null
}

function extractDimensions($) {
  let dimensions = null
  $('.woocommerce-product-attributes tr, #tab-additional_information tr').each((_, row) => {
    const label = $(row).find('th').text().trim().toLowerCase()
    if (label.includes('dimension') || label.includes('size') || label.includes('weight')) {
      const value = $(row).find('td').text().trim()
      if (value) dimensions = dimensions ? `${dimensions}; ${value}` : value
    }
  })
  return dimensions
}

async function resolveImageCandidates(productUrl) {
  const html = await fetchHtml(productUrl)
  const $ = cheerio.load(html)
  const galleryImg = $('.woocommerce-product-gallery__image img, img.wp-post-image').first()

  const candidates = []
  const dataLarge = galleryImg.attr('data-large_image')
  if (dataLarge) candidates.push(dataLarge)
  const srcsetBest = pickLargestFromSrcset(galleryImg.attr('srcset'))
  if (srcsetBest) candidates.push(srcsetBest)
  const rawSrc = galleryImg.attr('data-src') || galleryImg.attr('src')
  if (rawSrc) {
    candidates.push(deriveOriginalFromThumb(rawSrc))
    candidates.push(rawSrc)
  }

  return {
    candidates: [...new Set(candidates)],
    price: extractPrice($),
    dimensions: extractDimensions($),
  }
}

async function downloadValidated(candidates, destPath) {
  for (const url of candidates) {
    try {
      const res = await politeFetch(url)
      if (!res.ok) {
        console.log(`      x HTTP ${res.status} for candidate ${url}`)
        continue
      }
      const contentType = res.headers.get('content-type') ?? ''
      if (!contentType.startsWith('image/')) {
        console.log(`      x Not an image (${contentType || 'unknown type'}): ${url}`)
        continue
      }
      const buffer = Buffer.from(await res.arrayBuffer())
      if (buffer.length < MIN_FILE_BYTES) {
        console.log(`      x File too small (${buffer.length} bytes): ${url}`)
        continue
      }
      const dims = getImageDimensions(buffer)
      if (!dims || !dims.width || !dims.height) {
        console.log(`      x Could not verify image data: ${url}`)
        continue
      }
      if (dims.width < MIN_DIMENSION && dims.height < MIN_DIMENSION) {
        console.log(`      x Too small (${dims.width}x${dims.height}), trying next candidate: ${url}`)
        continue
      }
      await writeFile(destPath, buffer)
      return { url, width: dims.width, height: dims.height, bytes: buffer.length }
    } catch (error) {
      console.log(`      x Error fetching ${url}: ${error.message}`)
    }
  }
  return null
}

async function readExistingManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST_PATH, 'utf8'))
  } catch {
    return {}
  }
}

async function rebuildPreviewOnly() {
  const manifest = await readExistingManifest()
  await mkdir(PREVIEW_DIR, { recursive: true })
  await writeFile(path.join(PREVIEW_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2))
  await writeFile(path.join(PREVIEW_DIR, 'preview.html'), buildPreviewHtml(manifest, CATEGORIES))
  console.log(`Rebuilt ${path.join(PREVIEW_DIR, 'preview.html')} from existing manifest (no network requests made).`)
}

async function main() {
  if (process.argv.includes('--rebuild-preview')) {
    await rebuildPreviewOnly()
    return
  }

  // `--only=slug1,slug2` re-scrapes just those categories and merges the
  // result into the existing manifest, instead of re-downloading everything.
  const onlyArg = process.argv.find((arg) => arg.startsWith('--only='))
  const onlySlugs = onlyArg ? onlyArg.slice('--only='.length).split(',').map((s) => s.trim()) : null
  const categoriesToRun = onlySlugs ? CATEGORIES.filter((c) => onlySlugs.includes(c.slug)) : CATEGORIES

  if (onlySlugs) {
    const unknown = onlySlugs.filter((slug) => !CATEGORIES.some((c) => c.slug === slug))
    if (unknown.length) {
      console.log(`Unknown --only categories, skipping: ${unknown.join(', ')}`)
    }
  }

  console.log('AATHI LIFE IMAGE SCRAPER')
  console.log('='.repeat(60))

  const manifest = onlySlugs ? await readExistingManifest() : {}
  const stats = { downloaded: 0, skipped: 0, failed: 0 }

  for (let ci = 0; ci < categoriesToRun.length; ci += 1) {
    const category = categoriesToRun[ci]
    console.log(`\n[${ci + 1}/${categoriesToRun.length}] ${category.label}`)

    const categoryDir = path.join(PUBLIC_PRODUCTS_DIR, category.slug)
    await mkdir(categoryDir, { recursive: true })

    let products
    try {
      products = await collectCategoryProducts(category)
    } catch (error) {
      console.log(`  ! Could not load category page: ${error.message}`)
      manifest[category.slug] = []
      continue
    }

    if (products.length === 0) {
      console.log('  ! No products found for this category — skipping, no error raised')
      manifest[category.slug] = []
      continue
    }

    const entries = []
    const usedNames = new Set()

    for (let pi = 0; pi < products.length; pi += 1) {
      const product = products[pi]
      console.log(`  [${pi + 1}/${products.length}] Downloading ${product.name}`)

      let resolved
      try {
        resolved = await resolveImageCandidates(product.productUrl)
      } catch (error) {
        console.log(`      x Failed to load product page: ${error.message}`)
        stats.failed += 1
        continue
      }

      if (!resolved.candidates.length) {
        console.log('      x No image candidates found on product page')
        stats.failed += 1
        continue
      }

      let baseName = sanitizeName(`${category.slug}-${product.name}`)
      if (!baseName || baseName.length < 4) baseName = `${category.slug}-${String(pi + 1).padStart(2, '0')}`
      let finalName = baseName
      let suffix = 2
      while (usedNames.has(finalName)) {
        finalName = `${baseName}-${suffix}`
        suffix += 1
      }
      usedNames.add(finalName)

      const ext = extensionFromUrl(resolved.candidates[0])
      const filename = `${finalName}.${ext}`
      const destPath = path.join(categoryDir, filename)

      const result = await downloadValidated(resolved.candidates, destPath)
      if (!result) {
        console.log('      x All image candidates failed validation — skipping product')
        stats.failed += 1
        continue
      }

      console.log(`      ✓ saved ${filename} (${result.width}x${result.height}, ${(result.bytes / 1024).toFixed(0)} KB)`)
      stats.downloaded += 1

      entries.push({
        name: product.name,
        productUrl: product.productUrl,
        sourceImageUrl: result.url,
        localImage: `/assets/products/${category.slug}/${filename}`,
        price: resolved.price,
        dimensions: resolved.dimensions,
        width: result.width,
        height: result.height,
      })
    }

    manifest[category.slug] = entries
    stats.skipped += Math.max(0, TARGET_PER_CATEGORY - products.length)
    console.log(`  ✓ ${entries.length} image${entries.length === 1 ? '' : 's'} saved`)
  }

  await mkdir(path.dirname(MANIFEST_PATH), { recursive: true })
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2))

  await mkdir(PREVIEW_DIR, { recursive: true })
  await writeFile(path.join(PREVIEW_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2))
  await writeFile(path.join(PREVIEW_DIR, 'preview.html'), buildPreviewHtml(manifest, CATEGORIES))

  const totalImages = Object.values(manifest).reduce((sum, entries) => sum + entries.length, 0)

  console.log('\n' + '='.repeat(60))
  console.log('SCRAPING COMPLETE')
  console.log(`Categories processed this run: ${categoriesToRun.length} of ${CATEGORIES.length} total`)
  console.log(`Images downloaded: ${totalImages}`)
  console.log(`Images skipped: ${stats.skipped}`)
  console.log(`Images failed: ${stats.failed}`)
  console.log(`Output directory: ${PUBLIC_PRODUCTS_DIR}`)
  console.log(`Manifest: ${MANIFEST_PATH}`)
  console.log('='.repeat(60))
}

function buildPreviewHtml(manifest, categories) {
  const sections = categories
    .map(({ slug, label }) => {
      const entries = manifest[slug] ?? []
      const cards = entries
        .map(
          (entry) => `
        <figure>
          <img src="../public${entry.localImage}" alt="${escapeHtml(entry.name)}" />
          <figcaption>${escapeHtml(entry.name)}${entry.price ? ` &middot; ${escapeHtml(entry.price)}` : ''}</figcaption>
        </figure>`,
        )
        .join('')
      return `
      <section>
        <h2>${escapeHtml(label)} <span>(${entries.length})</span></h2>
        <div class="grid">${cards || '<p class="empty">No images downloaded for this category.</p>'}</div>
      </section>`
    })
    .join('')

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Aathi Life — Scraped Product Images Preview</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 0; padding: 24px 32px 64px; background: #f4f6f4; color: #1c2b22; }
  h1 { margin-bottom: 4px; }
  h2 { margin-top: 40px; border-bottom: 1px solid #d8e0da; padding-bottom: 8px; }
  h2 span { font-weight: 400; color: #6b7a70; font-size: 0.8em; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; margin-top: 16px; }
  figure { margin: 0; background: #fff; border: 1px solid #e2e8e4; border-radius: 8px; overflow: hidden; }
  figure img { width: 100%; height: 160px; object-fit: cover; display: block; background: #eef1ee; }
  figcaption { font-size: 0.82rem; padding: 8px 10px; line-height: 1.3; }
  .empty { color: #97a29c; font-style: italic; }
</style>
</head>
<body>
  <h1>Aathi Life — Scraped Product Images</h1>
  <p>Generated by <code>npm run scrape:aathilife</code>. Images are served from <code>public/assets/products/</code>.</p>
  ${sections}
</body>
</html>`
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch])
}

main().catch((error) => {
  console.error('Fatal scraper error:', error)
  process.exitCode = 1
})

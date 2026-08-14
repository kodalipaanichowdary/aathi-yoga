import './PriceTag.css'

export default function PriceTag({ price, originalPrice }) {
  const discountPercent = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <span className="price-tag">
      <span className="price-tag__current">₹{price}</span>
      {originalPrice > price && (
        <>
          <span className="price-tag__original">₹{originalPrice}</span>
          <span className="price-tag__discount">{discountPercent}% off</span>
        </>
      )}
    </span>
  )
}

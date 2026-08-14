import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import QtyStepper from '../../components/ui/QtyStepper'
import Button from '../../components/ui/Button'
import { useToast } from '../../components/ui/useToast'
import { useCartStore } from '../../store/useCartStore'
import { getProductById } from '../../data/products'
import ProductDetailContent from './ProductDetailContent'
import './ProductDetail.css'

export default function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const showToast = useToast()
  const addItem = useCartStore((state) => state.addItem)
  const [qty, setQty] = useState(1)

  const product = getProductById(productId)

  if (!product) {
    return <Navigate to="/store" replace />
  }

  function handleAddToCart() {
    for (let i = 0; i < qty; i += 1) {
      addItem(product)
    }
    showToast(`${qty > 1 ? `${qty} x ` : ''}${product.name} added to cart`, 'success')
  }

  return (
    <div className="product-detail">
      <ProductDetailContent product={product} onClose={() => navigate(-1)} />

      <div className="product-detail__action-bar">
        <QtyStepper
          qty={qty}
          onIncrement={() => setQty((q) => q + 1)}
          onDecrement={() => setQty((q) => Math.max(1, q - 1))}
        />
        <div className="product-detail__add-btn-wrap">
          <Button onClick={handleAddToCart}>Add to Cart &middot; &#8377;{product.price * qty}</Button>
        </div>
      </div>
    </div>
  )
}

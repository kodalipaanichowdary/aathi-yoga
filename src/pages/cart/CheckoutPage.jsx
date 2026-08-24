import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import ProductImage from '../../components/ProductImage'
import Button from '../../components/ui/Button'
import { useToast } from '../../components/ui/useToast'
import { computeCartTotals, useCartStore } from '../../store/useCartStore'
import { getProductById } from '../../data/products'
import './CheckoutPage.css'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const showToast = useToast()
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const lineItems = items
    .map((item) => ({ product: getProductById(item.id), qty: item.qty }))
    .filter((line) => line.product)

  // Guarded with orderPlaced: clearCart() below empties `items`, which
  // would otherwise re-trigger this same redirect and clobber the
  // navigate('/home') call while the page is still mounted during its
  // exit transition.
  if (lineItems.length === 0 && !orderPlaced) {
    return <Navigate to="/cart" replace />
  }

  const totals = computeCartTotals(lineItems)

  function handlePlaceOrder() {
    setOrderPlaced(true)
    showToast("Order placed! We'll be in touch.", 'success')
    clearCart()
    navigate('/home', { replace: true })
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-page__heading">Order Summary</h1>

      <ul className="checkout-page__items">
        {lineItems.map(({ product, qty }) => (
          <li key={product.id} className="checkout-item">
            <ProductImage icon={product.icon} images={product.images} alt={product.name} className="checkout-item__image" />
            <div className="checkout-item__info">
              <span className="checkout-item__name">{product.name}</span>
              <span className="checkout-item__qty">Qty {qty} &times; &#8377;{product.price}</span>
            </div>
            <span className="checkout-item__price">&#8377;{product.price * qty}</span>
          </li>
        ))}
      </ul>

      <div className="checkout-page__totals">
        <div className="checkout-page__row">
          <span>Subtotal</span>
          <span>&#8377;{totals.subTotal}</span>
        </div>
        {totals.discount > 0 && (
          <div className="checkout-page__row checkout-page__row--discount">
            <span>Discount</span>
            <span>&minus;&#8377;{totals.discount}</span>
          </div>
        )}
        <div className="checkout-page__row">
          <span>Delivery Charge</span>
          <span>&#8377;{totals.deliveryCharge}</span>
        </div>
        <div className="checkout-page__row">
          <span>Tax</span>
          <span>&#8377;{totals.tax}</span>
        </div>
        <div className="checkout-page__row checkout-page__row--total">
          <span>Grand Total</span>
          <span>&#8377;{totals.grandTotal}</span>
        </div>
      </div>

      <div className="checkout-page__action">
        <Button onClick={handlePlaceOrder}>Place Order</Button>
      </div>
    </div>
  )
}

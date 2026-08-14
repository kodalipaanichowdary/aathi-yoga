import { useNavigate } from 'react-router-dom'
import CartContent from './CartContent'
import './CartPage.css'

export default function CartPage() {
  const navigate = useNavigate()

  return (
    <div className="cart-page">
      <CartContent onCheckout={() => navigate('/checkout')} onBrowseProducts={() => navigate('/categories')} />
    </div>
  )
}

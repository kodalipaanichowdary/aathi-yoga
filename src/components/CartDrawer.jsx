import { useNavigate } from 'react-router-dom'
import BottomSheet from './ui/BottomSheet'
import CartContent from '../pages/cart/CartContent'
import { useUiStore } from '../store/useUiStore'
import './CartDrawer.css'

export default function CartDrawer() {
  const navigate = useNavigate()
  const cartDrawerOpen = useUiStore((state) => state.cartDrawerOpen)
  const closeCartDrawer = useUiStore((state) => state.closeCartDrawer)

  return (
    <BottomSheet open={cartDrawerOpen} onClose={closeCartDrawer} className="cart-drawer">
      <button type="button" className="cart-drawer__close" onClick={closeCartDrawer} aria-label="Close cart">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <CartContent
        onNavigateAway={closeCartDrawer}
        onCheckout={() => navigate('/checkout')}
        onBrowseProducts={() => navigate('/categories')}
      />
    </BottomSheet>
  )
}

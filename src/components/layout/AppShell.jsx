import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { useModeStore } from '../../store/useModeStore'
import TopPillToggle from './TopPillToggle'
import BottomNav from './BottomNav'
import ChatbotFab from '../ChatbotFab'
import ProductSheet from '../ProductSheet'
import CartDrawer from '../CartDrawer'
import ArticleSheet from '../ArticleSheet'
import FloatingCartSummary from '../FloatingCartSummary'
import './AppShell.css'

export default function AppShell() {
  const currentUser = useAuthStore((state) => state.currentUser)
  const mode = useModeStore((state) => state.mode)
  const location = useLocation()

  if (!currentUser) {
    return <Navigate to="/auth" replace />
  }

  const isPlayerRoute = location.pathname.endsWith('/play') || location.pathname === '/meditate'

  return (
    <div className="app-shell" data-mode={mode}>
      {!isPlayerRoute && <TopPillToggle />}
      <main className={`app-shell__content ${isPlayerRoute ? 'app-shell__content--player' : ''}`.trim()}>
        <Outlet />
      </main>
      {!isPlayerRoute && (
        <div className="app-shell__floating-layer">
          <FloatingCartSummary />
          <ChatbotFab />
        </div>
      )}
      {!isPlayerRoute && <BottomNav />}
      <ProductSheet />
      <CartDrawer />
      <ArticleSheet />
    </div>
  )
}

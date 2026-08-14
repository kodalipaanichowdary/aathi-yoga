import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

/**
 * Role gate for nested routes. Assumes AppShell has already redirected
 * unauthenticated users to /auth — this only checks role membership.
 */
export default function ProtectedRoute({ allowedRoles, redirectTo = '/home' }) {
  const currentUser = useAuthStore((state) => state.currentUser)
  const hasAccess = Boolean(currentUser) && allowedRoles.includes(currentUser.role)

  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}

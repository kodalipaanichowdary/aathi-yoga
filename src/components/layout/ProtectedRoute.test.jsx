import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import { useAuthStore } from '../../store/useAuthStore'

function renderAdminRoute(initialPath) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/home" element={<div>home page</div>} />
        <Route element={<ProtectedRoute allowedRoles={['coach', 'admin']} />}>
          <Route path="/admin" element={<div>admin console</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useAuthStore.setState({ currentUser: null })
  })

  it('redirects when there is no logged-in user', () => {
    renderAdminRoute('/admin')
    expect(screen.getByText('home page')).toBeInTheDocument()
  })

  it('redirects a member to the fallback route', () => {
    useAuthStore.setState({ currentUser: { id: 'usr-1', role: 'member' } })
    renderAdminRoute('/admin')
    expect(screen.getByText('home page')).toBeInTheDocument()
  })

  it('renders the nested route for an allowed role', () => {
    useAuthStore.setState({ currentUser: { id: 'usr-coach-1', role: 'coach' } })
    renderAdminRoute('/admin')
    expect(screen.getByText('admin console')).toBeInTheDocument()
  })
})

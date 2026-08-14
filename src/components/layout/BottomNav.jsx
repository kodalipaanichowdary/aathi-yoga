import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from '../Logo'
import { SPRING } from '../../lib/motion'
import './BottomNav.css'

const TABS_LEFT = [
  {
    to: '/home',
    label: 'Home',
    icon: <path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9z" />,
  },
  {
    to: '/categories',
    label: 'Categories',
    icon: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  },
]

const TABS_RIGHT = [
  {
    to: '/coming-soon',
    label: 'Coming Soon',
    icon: <path d="M12 7v5l3 3M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />,
  },
  {
    to: '/membership',
    label: 'Subscription',
    icon: <path d="M4 6h16v12H4zM4 10h16" />,
  },
]

/**
 * Icons carry both a stroke and a low-opacity fill. Selecting a tab fades the
 * fill in rather than swapping to a different glyph, so the shape stays put
 * while the weight changes.
 */
function NavIcon({ children, filled }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      fillOpacity={filled ? 0.2 : 0}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      strokeLinecap="round"
      style={{ transition: 'fill-opacity var(--t-hover) ease' }}
    >
      {children}
    </svg>
  )
}

function NavTab({ tab }) {
  return (
    <NavLink
      to={tab.to}
      className={({ isActive }) => `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`.trim()}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="bottom-nav-active"
              className="bottom-nav__indicator"
              transition={SPRING.indicator}
            />
          )}
          <motion.span
            className="bottom-nav__icon"
            animate={{ y: isActive ? -2 : 0, scale: isActive ? 1.1 : 1 }}
            transition={SPRING.nav}
          >
            <NavIcon filled={isActive}>{tab.icon}</NavIcon>
          </motion.span>
          <motion.span
            className="bottom-nav__label"
            animate={{ opacity: isActive ? 1 : 0.72, y: isActive ? 0 : 1 }}
            transition={SPRING.nav}
          >
            {tab.label}
          </motion.span>
        </>
      )}
    </NavLink>
  )
}

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {/* Bar spans the viewport as chrome; the items stay inside the app column. */}
      <div className="bottom-nav__inner">
        {TABS_LEFT.map((tab) => (
          <NavTab key={tab.to} tab={tab} />
        ))}

        <NavLink to="/home" className="bottom-nav__brand" aria-label="Aathi Yoga">
          <span className="bottom-nav__brand-glow" aria-hidden="true" />
          <Logo variant="badge" size="xs" />
        </NavLink>

        {TABS_RIGHT.map((tab) => (
          <NavTab key={tab.to} tab={tab} />
        ))}
      </div>
    </nav>
  )
}

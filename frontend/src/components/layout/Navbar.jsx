import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../common/AuthContext'
import { Button } from '../ui/button'

const navItems = ['Home', 'Features', 'News', 'About']

function Navbar() {
  const location = useLocation()
  const { isAuthenticated, logout, user } = useAuth()

  const isLandingPage = location.pathname === '/'

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-lg font-semibold text-white shadow-sm">
            LM
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900">LibraryMS</p>
            <p className="text-sm text-slate-500">Smart campus library</p>
          </div>
        </Link>

        {isLandingPage ? (
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-sky-600">
                {item}
              </a>
            ))}
          </nav>
        ) : null}

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:inline">{user?.email}</span>
            <Button size="sm" variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        ) : (
          <Button size="sm" asChild>
            <Link to="/login">Get Started</Link>
          </Button>
        )}
      </div>
    </header>
  )
}

export default Navbar

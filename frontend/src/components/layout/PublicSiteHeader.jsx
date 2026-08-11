import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Home', to: '/#home' },
  { label: 'Features', to: '/#features' },
  { label: 'Technology', to: '/#technology' },
  { label: 'News', to: '/news' },
  { label: 'About', to: '/#about' },
]

function PublicSiteHeader({ activeLabel }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [navVisible, setNavVisible] = useState(true)
  const lastScrollY = useRef(0)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 12)

      if (currentScrollY <= 12 || currentScrollY < lastScrollY.current || open) {
        setNavVisible(true)
      } else if (currentScrollY > lastScrollY.current) {
        setNavVisible(false)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [open])

  const closeMenu = () => setOpen(false)
  const isActive = (label) => activeLabel === label || (label === 'News' && location.pathname === '/news')
  const navClass = (label) => `text-sm font-medium transition ${isActive(label) ? 'text-slate-950' : 'text-slate-600 hover:text-slate-950'}`
  const mobileNavClass = (label) => `block rounded-md px-3 py-2 text-sm font-medium ${isActive(label) ? 'bg-slate-50 text-slate-950' : 'text-slate-700 hover:bg-slate-50'}`

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${navVisible ? 'translate-y-0' : '-translate-y-full'} ${scrolled ? 'border-b border-slate-200/80 bg-white/85 py-2 shadow-sm backdrop-blur-xl' : 'bg-transparent py-4'}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link to="/#home" className="flex items-center gap-2 font-semibold text-slate-950" onClick={closeMenu}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white"><BookOpen size={18} /></span>
          LibraryMS
        </Link>
        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((item) => <Link key={item.label} to={item.to} className={navClass(item.label)}>{item.label}</Link>)}
          <Link to="/login" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">Login</Link>
          <Link to="/register" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">Register</Link>
        </div>
        <button onClick={() => setOpen(!open)} className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-700 lg:hidden" aria-label="Toggle navigation">{open ? <X size={18} /> : <Menu size={18} />}</button>
      </nav>
      {open && <div className="mx-5 mt-3 rounded-lg border border-slate-200 bg-white p-3 shadow-lg lg:hidden">{navLinks.map((item) => <Link onClick={closeMenu} key={item.label} to={item.to} className={mobileNavClass(item.label)}>{item.label}</Link>)}<Link onClick={closeMenu} to="/login" className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Login</Link><Link onClick={closeMenu} to="/register" className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Register</Link></div>}
    </header>
  )
}

export default PublicSiteHeader

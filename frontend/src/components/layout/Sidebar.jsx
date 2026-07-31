import { Link, useLocation } from 'react-router-dom'
import { BookOpen, BookText, BriefcaseBusiness, LayoutDashboard, MessageSquareText, Newspaper, Settings, Sparkles, Users, UserRoundCog, ClipboardList, UserCircle2, X } from 'lucide-react'
import { useAuth } from '../common/AuthContext'

const adminMenuItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Books', to: '/admin/books', icon: BookText },
  { label: 'Categories', to: '/admin/categories', icon: BookOpen },
  { label: 'Students', to: '/admin/students', icon: Users },
  { label: 'Librarians', to: '/admin/librarians', icon: UserRoundCog },
  { label: 'Book Issues', to: '/admin/issues', icon: ClipboardList },
  { label: 'Complaints', to: '/admin/complaints', icon: MessageSquareText },
  { label: 'Feedback', to: '/admin/feedback', icon: Sparkles },
  { label: 'News', to: '/admin/news', icon: Newspaper },
  { label: 'Reports', to: '/admin/reports', icon: BriefcaseBusiness },
]

const studentMenuItems = [
  { label: 'Dashboard', to: '/student/dashboard', icon: LayoutDashboard },
  { label: 'Browse Books', to: '/student/books', icon: BookText },
  { label: 'My Issued Books', to: '/student/issued-books', icon: ClipboardList },
  { label: 'Borrow History', to: '/student/borrow-history', icon: BookOpen },
  { label: 'News', to: '/student/news', icon: Newspaper },
  { label: 'Complaints', to: '/student/complaints', icon: MessageSquareText },
  { label: 'Feedback', to: '/student/feedback', icon: Sparkles },
  { label: 'Profile', to: '/student/profile', icon: UserCircle2 },
]

const librarianMenuItems = [
  { label: 'Dashboard', to: '/librarian/dashboard', icon: LayoutDashboard },
  { label: 'Books', to: '/librarian/books', icon: BookText },
  { label: 'Book Issues', to: '/librarian/issues', icon: ClipboardList },
  { label: 'News', to: '/librarian/news', icon: Newspaper },
  { label: 'Students', to: '/librarian/students', icon: Users },
]

function Sidebar({ open, onClose }) {
  const location = useLocation()
  const { user } = useAuth()
  const role = user?.role?.toUpperCase()
  const menuItems = role === 'STUDENT' ? studentMenuItems : role === 'LIBRARIAN' ? librarianMenuItems : adminMenuItems
  const roleTitle = role === 'LIBRARIAN' ? 'Librarian' : role === 'STUDENT' ? 'Student' : 'Admin'

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-slate-950 text-slate-100 transition-transform duration-200 lg:sticky lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-6 py-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">{roleTitle}</p>
            <h2 className="mt-1 text-xl font-semibold">LibraryMS</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 lg:hidden">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.to

            return (
              <Link
                key={item.label}
                to={item.to}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

      </div>
    </aside>
  )
}

export default Sidebar

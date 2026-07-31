import { useEffect, useRef, useState } from 'react'
import { ChevronDown, LogOut, UserCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../common/AuthContext'

function UserMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) {
    return null
  }

  const displayName = user?.fullName || user?.email || 'User'
  const role = user?.role?.toUpperCase() || 'USER'
  const roleLabel =
    role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()

  const isStudent = role === 'STUDENT'

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-left transition hover:bg-slate-100"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-sm font-semibold text-white">
          {displayName.charAt(0).toUpperCase()}
        </div>

        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-slate-900">{displayName}</p>
          <p className="text-xs text-slate-500">{roleLabel}</p>
        </div>

        <ChevronDown
          size={16}
          className={`text-slate-500 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
          <div className="px-3 py-2">
            <p className="text-sm font-semibold text-slate-900">
              {displayName}
            </p>
            <p className="text-sm text-slate-500">{roleLabel}</p>
          </div>

          {isStudent && (
            <>
              <div className="my-2 h-px bg-slate-200" />

              <Link
                to="/student/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <UserCircle2 size={16} />
                Profile
              </Link>
            </>
          )}

          <div className="my-2 h-px bg-slate-200" />

          <button
            onClick={() => {
              setOpen(false)
              logout()
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
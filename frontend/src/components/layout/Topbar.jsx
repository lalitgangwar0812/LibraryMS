import { Menu } from 'lucide-react'
import UserMenu from './UserMenu'

function Topbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-slate-200/80 bg-white/90 px-4 py-3.5 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} aria-label="Open navigation" className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden">
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-sm font-semibold text-white shadow-sm">
              LM
            </div>
            <div>
              <p className="text-base font-semibold text-slate-900">LibraryMS</p>
              <p className="text-sm text-slate-500">Smart campus library</p>
            </div>
          </div>
        </div>

        <UserMenu />
      </div>
    </header>
  )
}

export default Topbar

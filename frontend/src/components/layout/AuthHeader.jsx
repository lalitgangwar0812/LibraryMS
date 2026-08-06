import { ArrowLeft, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

function AuthHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
        <Link to="/" className="flex items-center gap-3 text-slate-900 transition hover:text-sky-700">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <BookOpen size={18} />
          </div>
          <div>
            <p className="text-base font-semibold tracking-tight">LibraryMS</p>
            <p className="text-xs text-slate-500">Student Portal</p>
          </div>
        </Link>

        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-sky-700">
          <ArrowLeft size={16} />
          Home
        </Link>
      </div>
    </header>
  )
}

export default AuthHeader

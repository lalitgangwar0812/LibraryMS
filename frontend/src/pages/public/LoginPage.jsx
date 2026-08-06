import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, Check, ChevronDown, Copy, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { useAuth } from '../../components/common/AuthContext'
import AuthHeader from '../../components/layout/AuthHeader'

const getDashboardPath = (role) => {
  switch (role?.toUpperCase()) {
    case 'ADMIN':
      return '/admin/dashboard'
    case 'LIBRARIAN':
      return '/librarian/dashboard'
    case 'STUDENT':
      return '/student/dashboard'
    default:
      return '/login'
  }
}

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, user } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showDemoCredentials, setShowDemoCredentials] = useState(false)
  const [copied, setCopied] = useState('')

  const demoCredentials = [
    { role: 'Admin', email: 'admin@libraryms.demo', password: 'Admin@123' },
    { role: 'Librarian', email: 'ananya.verma@libraryms.demo', password: 'Library@123' },
    { role: 'Student', email: 'aarav.sharma@student.demo', password: 'Student@123' },
  ]

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getDashboardPath(user.role), { replace: true })
    }
  }, [isAuthenticated, navigate, user])

  const validate = () => {
    const nextErrors = {}

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      })

      const redirectTo = location.state?.from?.pathname || getDashboardPath(response.role)
      navigate(redirectTo, { replace: true })
    } catch (error) {
      setSubmitError(error?.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyCredential = async (credential) => {
    const value = `${credential.email}\n${credential.password}`
    try {
      await navigator.clipboard.writeText(value)
      setCopied(credential.role)
      window.setTimeout(() => setCopied(''), 1800)
    } catch {
      setSubmitError('Unable to copy credentials. Please copy them manually.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AuthHeader />
      <main className="relative overflow-hidden px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="relative mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
        <section className="rounded-3xl border border-slate-200 bg-slate-950 p-7 text-white shadow-xl shadow-slate-950/10 sm:p-9">
          <div className="inline-flex rounded-xl bg-white/10 p-3 text-sky-300"><BookOpen size={22} /></div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">LibraryMS workspace</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Welcome back to your library.</h1>
          <p className="mt-4 max-w-md text-base leading-7 text-slate-300">Sign in to continue managing your reading, circulation, and library operations from one secure workspace.</p>
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400"><span>Library overview</span><span className="rounded-full bg-emerald-400/15 px-2 py-1 font-semibold text-emerald-300">LIVE</span></div>
            <div className="mt-4 grid grid-cols-3 gap-3">{[['Books', '12.4k'], ['Issued', '248'], ['News', '18']].map(([label, value]) => <div key={label} className="rounded-xl bg-white/10 p-3"><p className="text-lg font-semibold text-white">{value}</p><p className="mt-1 text-xs text-slate-400">{label}</p></div>)}</div>
            <div className="mt-4 space-y-2">{['Catalog activity updated', 'New issue recorded', 'Announcement published'].map((item, index) => <div key={item} className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-300"><span className={`h-2 w-2 rounded-full ${index === 1 ? 'bg-emerald-400' : 'bg-sky-400'}`} />{item}</div>)}</div>
          </div>
          <div className="mt-7 space-y-3 text-sm text-slate-300"><p className="flex items-center gap-3"><ShieldCheck size={18} className="text-sky-300" />Protected with JWT-based authentication.</p><p className="flex items-center gap-3"><Check size={18} className="text-emerald-300" />Tailored dashboards for every role.</p></div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-950/5 sm:p-9">
          <h2 className="text-2xl font-semibold text-slate-900">Sign in</h2>
          <p className="mt-2 text-sm text-slate-600">Enter your credentials to continue.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  className={`w-full rounded-xl border bg-white py-3 pl-10 pr-3 text-sm outline-none transition ${errors.email ? 'border-red-400' : 'border-slate-200 focus:border-sky-500'}`}
                  placeholder="name@library.edu"
                />
              </div>
              {errors.email ? <p className="mt-2 text-sm text-red-500" role="alert">{errors.email}</p> : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                  className={`w-full rounded-xl border bg-white py-3 pl-10 pr-12 text-sm outline-none transition ${errors.password ? 'border-red-400' : 'border-slate-200 focus:border-sky-500'}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password ? <p className="mt-2 text-sm text-red-500" role="alert">{errors.password}</p> : null}
            </div>

            {submitError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
                {submitError}
              </div>
            ) : null}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
              <ArrowRight size={16} />
            </Button>

            <div className="text-center text-sm text-slate-600">
              <Link to="/register" className="font-medium text-sky-600 hover:text-sky-700">
                Create Student Account
              </Link>
            </div>
          </form>
          <div className="mt-7 border-t border-slate-100 pt-5">
            <button type="button" onClick={() => setShowDemoCredentials((value) => !value)} aria-expanded={showDemoCredentials} className="flex w-full items-center justify-between rounded-xl px-1 text-left text-sm font-semibold text-slate-700 hover:text-sky-700">Demo Credentials <ChevronDown size={17} className={`transition-transform ${showDemoCredentials ? 'rotate-180' : ''}`} /></button>
            
            {showDemoCredentials ? (
              <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-3">
                {demoCredentials.map((credential) => (
                  <div
                    key={credential.role}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900">
                        {credential.role}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {credential.email}
                        <span className="mx-1" aria-hidden="true">·</span>
                        <span className="font-medium text-slate-700">
                          {credential.password}
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyCredential(credential)}
                      aria-label={`Copy ${credential.role} demo credentials`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                    >
                      {copied === credential.role ? <Check size={15} /> : <Copy size={15} />}
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
        </div>
      </main>
    </div>
  )
}

export default LoginPage

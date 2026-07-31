import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, LockKeyhole, Mail } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { useAuth } from '../../components/common/AuthContext'

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

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-6 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="inline-flex rounded-full bg-sky-50 p-3 text-sky-600">
            <BookOpen size={22} />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Welcome back to LibraryMS
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Sign in to access your account, reading history, and library resources.
          </p>

          <div className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <LockKeyhole className="mt-0.5 text-sky-600" size={18} />
              <span>Your session stays protected with JWT-based authentication.</span>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 text-sky-600" size={18} />
              <span>Use your registered email and password to continue securely.</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
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
              {errors.email ? <p className="mt-2 text-sm text-red-500">{errors.email}</p> : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                  className={`w-full rounded-xl border bg-white py-3 pl-10 pr-3 text-sm outline-none transition ${errors.password ? 'border-red-400' : 'border-slate-200 focus:border-sky-500'}`}
                  placeholder="Enter your password"
                />
              </div>
              {errors.password ? <p className="mt-2 text-sm text-red-500">{errors.password}</p> : null}
            </div>

            {submitError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {submitError}
              </div>
            ) : null}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
              <ArrowRight size={16} />
            </Button>

            <div className="text-center text-sm text-slate-600">
              <a href="/register" className="font-medium text-sky-600 hover:text-sky-700">
                Create Student Account
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, Check, Eye, EyeOff, LockKeyhole, Mail, Phone, ShieldCheck, User } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { useAuth } from '../../components/common/AuthContext'
import AuthHeader from '../../components/layout/AuthHeader'

function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validate = () => {
    const nextErrors = {}

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.'
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!formData.phoneNumber.trim()) {
      nextErrors.phoneNumber = 'Phone number is required.'
    } else if (!/^[0-9+\-\s]{7,15}$/.test(formData.phoneNumber)) {
      nextErrors.phoneNumber = 'Enter a valid phone number.'
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required.'
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password.'
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')
    setSuccessMessage('')

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })

      setSuccessMessage('Account created successfully. You can now sign in.')
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
      })
      setErrors({})

      setTimeout(() => {
        navigate('/login')
      }, 1200)
    } catch (error) {
      const backendMessage = error?.response?.data?.message || error?.response?.data?.error || 'Registration failed. Please try again.'
      setSubmitError(backendMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AuthHeader />
      <main className="relative overflow-hidden px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="relative mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
          <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-950/5 sm:p-9">
            <div className="inline-flex rounded-xl bg-sky-50 p-3 text-sky-600">
              <BookOpen size={22} />
            </div>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Create your student account</h1>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-600">Join the library community and start accessing books, updates, and learning resources.</p>

            <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">Library Preview</p>
                <span className="inline-flex items-center rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">LIVE</span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center">
                  <p className="text-sm font-semibold text-slate-900">12.4k</p>
                  <p className="mt-1 text-xs text-slate-500">Books</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center">
                  <p className="text-sm font-semibold text-slate-900">248</p>
                  <p className="mt-1 text-xs text-slate-500">Active Loans</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center">
                  <p className="text-sm font-semibold text-slate-900">18</p>
                  <p className="mt-1 text-xs text-slate-500">Announcements</p>
                </div>
              </div>

              <ul className="mt-5 space-y-2 text-sm text-slate-600">
                {['Browse books', 'Borrow & return books', 'Read announcements', 'Submit feedback'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check size={14} className="shrink-0 text-sky-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="flex min-h-[84px] items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                <ShieldCheck size={18} className="text-sky-600" />
                <span className="ml-3">JWT Authentication</span>
              </div>
              <div className="flex min-h-[84px] items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                <BookOpen size={18} className="text-sky-600" />
                <span className="ml-3">Access Anywhere</span>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-950/5 sm:p-9">
            <h2 className="text-2xl font-semibold text-slate-900">Create Account</h2>
            <p className="mt-2 text-sm text-slate-600">Register as a student to continue.</p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="fullName">
                  Full Name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(event) => setFormData({ ...formData, fullName: event.target.value })}
                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-3 text-sm outline-none transition ${errors.fullName ? 'border-red-400' : 'border-slate-200 focus:border-sky-500'}`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.fullName ? <p className="mt-2 text-sm text-red-500">{errors.fullName}</p> : null}
              </div>

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
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(event) => setFormData({ ...formData, phoneNumber: event.target.value })}
                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-3 text-sm outline-none transition ${errors.phoneNumber ? 'border-red-400' : 'border-slate-200 focus:border-sky-500'}`}
                    placeholder="Enter phone number"
                  />
                </div>
                {errors.phoneNumber ? <p className="mt-2 text-sm text-red-500">{errors.phoneNumber}</p> : null}
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
                    placeholder="Choose a password"
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
                {errors.password ? <p className="mt-2 text-sm text-red-500">{errors.password}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })}
                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-12 text-sm outline-none transition ${errors.confirmPassword ? 'border-red-400' : 'border-slate-200 focus:border-sky-500'}`}
                    placeholder="Re-enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword ? <p className="mt-2 text-sm text-red-500">{errors.confirmPassword}</p> : null}
              </div>

              {submitError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {submitError}
                </div>
              ) : null}

              {successMessage ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {successMessage}
                </div>
              ) : null}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Create Account'}
                <ArrowRight size={16} />
              </Button>

              <div className="text-center text-sm text-slate-600">
                <Link to="/login" className="font-medium text-sky-600 hover:text-sky-700">
                  Already have an account? Sign In
                </Link>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  )
}

export default RegisterPage

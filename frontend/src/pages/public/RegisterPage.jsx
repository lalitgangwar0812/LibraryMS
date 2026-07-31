import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, LockKeyhole, Mail, Phone, User } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { useAuth } from '../../components/common/AuthContext'

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
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-6 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="inline-flex rounded-full bg-sky-50 p-3 text-sky-600">
            <BookOpen size={22} />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Create your student account
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Join the library community and start accessing books, updates, and learning resources.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
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
                  type="password"
                  value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                  className={`w-full rounded-xl border bg-white py-3 pl-10 pr-3 text-sm outline-none transition ${errors.password ? 'border-red-400' : 'border-slate-200 focus:border-sky-500'}`}
                  placeholder="Choose a password"
                />
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
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })}
                  className={`w-full rounded-xl border bg-white py-3 pl-10 pr-3 text-sm outline-none transition ${errors.confirmPassword ? 'border-red-400' : 'border-slate-200 focus:border-sky-500'}`}
                  placeholder="Re-enter password"
                />
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
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

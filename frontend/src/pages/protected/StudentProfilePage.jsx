import { useEffect, useState } from 'react'
import { UserCircle2 } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import SectionHeader from '../../components/layout/SectionHeader'
import { Button } from '../../components/ui/button'
import api from '../../components/common/api'

function StudentProfilePage() {
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState({ fullName: '', phoneNumber: '' })
  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadProfile = async () => {
    try {
      setLoading(true)
      const response = await api.get('/student/profile')
      setProfile(response.data)
      setFormData({ fullName: response.data.fullName || '', phoneNumber: response.data.phoneNumber || '' })
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to load your profile.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const validateForm = () => {
    const nextErrors = {}
    const fullName = formData.fullName.trim()
    const phoneNumber = formData.phoneNumber.trim()

    if (!fullName) nextErrors.fullName = 'Full name is required.'
    else if (fullName.length > 150) nextErrors.fullName = 'Full name cannot exceed 150 characters.'

    if (!phoneNumber) nextErrors.phoneNumber = 'Phone number is required.'
    else if (!/^[0-9+()\- ]{7,15}$/.test(phoneNumber)) nextErrors.phoneNumber = 'Phone number is invalid.'

    setFormErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) return

    try {
      setSaving(true)
      const response = await api.put('/student/profile', {
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
      })
      setProfile(response.data)
      setFormData({ fullName: response.data.fullName || '', phoneNumber: response.data.phoneNumber || '' })
      setSuccess('Profile updated successfully.')
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to update your profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader title="Profile" description="View and update your personal details." />
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading your profile...</div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                  <UserCircle2 size={24} />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">{profile?.fullName || 'Student'}</p>
                  <p className="text-sm text-slate-500">{profile?.role || 'STUDENT'}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <div className="flex justify-between gap-3">
                  <span className="font-medium text-slate-900">Email</span>
                  <span>{profile?.email || '—'}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="font-medium text-slate-900">Phone</span>
                  <span>{profile?.phoneNumber || '—'}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
                {success ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div> : null}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="fullName">Full name</label>
                  <input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(event) => setFormData({ ...formData, fullName: event.target.value })}
                    className={`w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm outline-none ${formErrors.fullName ? 'border-red-400' : 'border-slate-200 focus:border-sky-500'}`}
                  />
                  {formErrors.fullName ? <p className="mt-2 text-sm text-red-500">{formErrors.fullName}</p> : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="phoneNumber">Phone number</label>
                  <input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(event) => setFormData({ ...formData, phoneNumber: event.target.value })}
                    className={`w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm outline-none ${formErrors.phoneNumber ? 'border-red-400' : 'border-slate-200 focus:border-sky-500'}`}
                  />
                  {formErrors.phoneNumber ? <p className="mt-2 text-sm text-red-500">{formErrors.phoneNumber}</p> : null}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-medium text-slate-900">Email address</p>
                  <p className="mt-1">{profile?.email || '—'}</p>
                  <p className="mt-2 text-xs text-slate-500">Email cannot be changed here.</p>
                </div>

                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default StudentProfilePage

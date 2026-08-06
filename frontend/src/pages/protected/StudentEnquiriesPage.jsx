import { useEffect, useMemo, useState } from 'react'
import { MessageSquare, Plus, Search } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import SectionHeader from '../../components/layout/SectionHeader'
import { Button } from '../../components/ui/button'
import api from '../../components/common/api'

const statusOptions = [
  { value: '', label: 'All statuses' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'CLOSED', label: 'Closed' },
]

const badgeClasses = {
  OPEN: 'bg-amber-100 text-amber-700',
  IN_PROGRESS: 'bg-sky-100 text-sky-700',
  CLOSED: 'bg-emerald-100 text-emerald-700',
}

function StudentEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ subject: '', message: '' })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const [selectedEnquiry, setSelectedEnquiry] = useState(null)

  const loadEnquiries = async () => {
    try {
      setLoading(true)
      setError('')
      const profileResponse = await api.get('/student/profile')
      const userId = profileResponse.data?.userId
      if (!userId) {
        setError('Unable to identify your account.')
        return
      }
      const response = await api.get(`/enquiries/user/${userId}`)
      setEnquiries(response.data || [])
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to load your enquiries.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEnquiries()
  }, [])

  const filteredEnquiries = useMemo(() => {
    const query = search.trim().toLowerCase()
    return enquiries.filter((enquiry) => {
      const matchesStatus = !status || enquiry.status === status
      const matchesSearch =
        !query ||
        (enquiry.subject || '').toLowerCase().includes(query) ||
        (enquiry.message || '').toLowerCase().includes(query)
      return matchesStatus && matchesSearch
    })
  }, [enquiries, search, status])

  const openForm = () => {
    setShowForm(true)
    setFormData({ subject: '', message: '' })
    setFormErrors({})
    setFormError('')
  }

  const closeForm = () => {
    setShowForm(false)
    setFormData({ subject: '', message: '' })
    setFormErrors({})
    setFormError('')
  }

  const validateForm = () => {
    const nextErrors = {}
    const subject = formData.subject.trim()
    const message = formData.message.trim()

    if (!subject) nextErrors.subject = 'Subject is required.'
    else if (subject.length > 150) nextErrors.subject = 'Subject cannot exceed 150 characters.'

    if (!message) nextErrors.message = 'Message is required.'

    setFormErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    if (!validateForm()) return

    try {
      setSubmitting(true)
      const profileResponse = await api.get('/student/profile')
      const userId = profileResponse.data?.userId
      if (!userId) {
        setFormError('Unable to identify your account.')
        return
      }

      await api.post('/enquiries', {
        userId,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      })
      setShowForm(false)
      setFormData({ subject: '', message: '' })
      setSuccess('Your enquiry was submitted successfully.')
      await loadEnquiries()
    } catch (requestError) {
      setFormError(requestError?.response?.data?.message || 'Unable to submit your enquiry.')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedStatusLabel = (value) => statusOptions.find((option) => option.value === value)?.label || value

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="My Enquiries"
            description="Submit an enquiry and track the status of your requests."
            action={<Button onClick={openForm}><Plus size={16} className="mr-2" />New Enquiry</Button>}
          />
        </div>

        {success ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>
        ) : null}

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 lg:max-w-md">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-500"
                placeholder="Search your enquiries"
              />
            </div>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full max-w-xs rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
            >
              {statusOptions.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">Loading your enquiries...</div>
            ) : filteredEnquiries.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                {enquiries.length === 0 ? 'No enquiries yet. Submit your first one to get started.' : 'No enquiries match your search.'}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEnquiries.map((enquiry) => (
                  <button
                    key={enquiry.enquiryId}
                    type="button"
                    onClick={() => setSelectedEnquiry(enquiry)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-sky-200 hover:bg-sky-50/50"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{enquiry.subject}</p>
                        <p className="mt-1 text-sm text-slate-600 line-clamp-2">{enquiry.message}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClasses[enquiry.status] || 'bg-slate-100 text-slate-700'}`}>
                        {selectedStatusLabel(enquiry.status)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <MessageSquare size={14} />
                      <span>Submitted {new Date(enquiry.createdAt).toLocaleDateString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">New Enquiry</h3>
                <p className="mt-1 text-sm text-slate-500">Ask the library staff a question.</p>
              </div>
              <button onClick={closeForm} className="text-sm text-slate-500">Close</button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              {formError ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div> : null}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  value={formData.subject}
                  onChange={(event) => setFormData({ ...formData, subject: event.target.value })}
                  className={`w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm outline-none ${formErrors.subject ? 'border-red-400' : 'border-slate-200 focus:border-sky-500'}`}
                  placeholder="Briefly describe your question"
                />
                {formErrors.subject ? <p className="mt-2 text-sm text-red-500">{formErrors.subject}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows="5"
                  value={formData.message}
                  onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                  className={`w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm outline-none ${formErrors.message ? 'border-red-400' : 'border-slate-200 focus:border-sky-500'}`}
                  placeholder="Tell us what you need help with"
                />
                {formErrors.message ? <p className="mt-2 text-sm text-red-500">{formErrors.message}</p> : null}
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={closeForm}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Enquiry'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {selectedEnquiry ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-8">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                  <MessageSquare size={16} /> Enquiry details
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">{selectedEnquiry.subject}</h2>
                <p className="mt-1 text-sm text-slate-600">Submitted on {selectedEnquiry.createdAt?.replace('T', ' ')}</p>
              </div>
              <button className="text-sm text-slate-500" onClick={() => setSelectedEnquiry(null)}>Close</button>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-600">Status</p>
              <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClasses[selectedEnquiry.status] || 'bg-slate-100 text-slate-700'}`}>
                {selectedStatusLabel(selectedEnquiry.status)}
              </span>
            </div>

            <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-600">Message</p>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{selectedEnquiry.message}</p>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  )
}

export default StudentEnquiriesPage

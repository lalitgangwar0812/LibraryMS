import { useEffect, useState } from 'react'
import { AlertCircle, MessageSquareText, Plus } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import SectionHeader from '../../components/layout/SectionHeader'
import { Button } from '../../components/ui/button'
import api from '../../components/common/api'

const badgeClasses = {
  PENDING: 'bg-amber-100 text-amber-700',
  IN_PROGRESS: 'bg-sky-100 text-sky-700',
  RESOLVED: 'bg-emerald-100 text-emerald-700',
}

const statusLabel = (status) => {
  if (!status) return 'Pending'
  if (status === 'IN_PROGRESS') return 'In Progress'
  if (status === 'RESOLVED') return 'Resolved'
  return 'Pending'
}

function StudentComplaintsPage() {
  const [complaints, setComplaints] = useState([])
  const [formData, setFormData] = useState({ subject: '', description: '' })
  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadComplaints = async () => {
    try {
      setLoading(true)
      const response = await api.get('/complaints/my')
      setComplaints(response.data || [])
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to load your complaints.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComplaints()
  }, [])

  const validateForm = () => {
    const nextErrors = {}
    const subject = formData.subject.trim()
    const description = formData.description.trim()

    if (!subject) nextErrors.subject = 'Subject is required.'
    else if (subject.length > 150) nextErrors.subject = 'Subject cannot exceed 150 characters.'

    if (!description) nextErrors.description = 'Description is required.'

    setFormErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) return

    try {
      setSubmitting(true)
      await api.post('/complaints', {
        subject: formData.subject.trim(),
        description: formData.description.trim(),
      })
      setFormData({ subject: '', description: '' })
      setSuccess('Your complaint was submitted successfully.')
      await loadComplaints()
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to submit your complaint.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Complaints"
            description="Submit a concern and track the status of your requests."
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
              <Plus size={16} />
              <span>New Complaint</span>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
              {success ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div> : null}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  value={formData.subject}
                  onChange={(event) => setFormData({ ...formData, subject: event.target.value })}
                  className={`w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm outline-none ${formErrors.subject ? 'border-red-400' : 'border-slate-200 focus:border-sky-500'}`}
                  placeholder="Briefly describe the issue"
                />
                {formErrors.subject ? <p className="mt-2 text-sm text-red-500">{formErrors.subject}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="5"
                  value={formData.description}
                  onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                  className={`w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm outline-none ${formErrors.description ? 'border-red-400' : 'border-slate-200 focus:border-sky-500'}`}
                  placeholder="Tell us what happened and how we can help"
                />
                {formErrors.description ? <p className="mt-2 text-sm text-red-500">{formErrors.description}</p> : null}
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Complaint'}
              </Button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader title="Your Complaints" description="All complaints you submitted are listed here." />

            {loading ? (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">Loading your complaints...</div>
            ) : complaints.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">No complaints yet. Submit your first one to get started.</div>
            ) : (
              <div className="mt-6 space-y-3">
                {complaints.map((complaint) => (
                  <div key={complaint.complaintId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{complaint.subject}</p>
                        <p className="mt-1 text-sm text-slate-600">{complaint.description}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClasses[complaint.status] || badgeClasses.PENDING}`}>
                        {statusLabel(complaint.status)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <AlertCircle size={14} />
                      <span>Submitted {new Date(complaint.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default StudentComplaintsPage

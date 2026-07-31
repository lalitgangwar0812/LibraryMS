import { useEffect, useMemo, useState } from 'react'
import { MessageSquareText, Star } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import SectionHeader from '../../components/layout/SectionHeader'
import { Button } from '../../components/ui/button'
import api from '../../components/common/api'

function StudentFeedbackPage() {
  const [profile, setProfile] = useState(null)
  const [feedback, setFeedback] = useState([])
  const [formData, setFormData] = useState({ message: '', rating: '5' })
  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadFeedback = async () => {
    try {
      setLoading(true)
      const profileResponse = await api.get('/student/profile')
      setProfile(profileResponse.data)

      const feedbackResponse = await api.get(`/feedback/user/${profileResponse.data.userId}`)
      setFeedback(feedbackResponse.data || [])
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to load your feedback.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFeedback()
  }, [])

  const sortedFeedback = useMemo(() => [...feedback].sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt)), [feedback])

  const validateForm = () => {
    const nextErrors = {}
    const message = formData.message.trim()
    const rating = Number(formData.rating)

    if (!message) nextErrors.message = 'Feedback is required.'
    else if (message.length < 5) nextErrors.message = 'Please share a little more detail.'

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) nextErrors.rating = 'Select a rating from 1 to 5.'

    setFormErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm() || !profile) return

    try {
      setSubmitting(true)
      await api.post('/feedback', {
        userId: profile.userId,
        message: formData.message.trim(),
        rating: Number(formData.rating),
      })
      setFormData({ message: '', rating: '5' })
      setSuccess('Thank you for your feedback.')
      await loadFeedback()
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to submit feedback.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader title="Feedback" description="Share your experience and review your recent submissions." />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
              <MessageSquareText size={16} />
              <span>Leave Feedback</span>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
              {success ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div> : null}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="message">Your feedback</label>
                <textarea
                  id="message"
                  rows="5"
                  value={formData.message}
                  onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                  className={`w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm outline-none ${formErrors.message ? 'border-red-400' : 'border-slate-200 focus:border-sky-500'}`}
                  placeholder="Tell us what worked well or what could improve"
                />
                {formErrors.message ? <p className="mt-2 text-sm text-red-500">{formErrors.message}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="rating">Rating</label>
                <select
                  id="rating"
                  value={formData.rating}
                  onChange={(event) => setFormData({ ...formData, rating: event.target.value })}
                  className={`w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm outline-none ${formErrors.rating ? 'border-red-400' : 'border-slate-200 focus:border-sky-500'}`}
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
                {formErrors.rating ? <p className="mt-2 text-sm text-red-500">{formErrors.rating}</p> : null}
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader title="Previous Feedback" description="Your recent submissions are shown here." />

            {loading ? (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">Loading your feedback...</div>
            ) : sortedFeedback.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">No feedback shared yet. Your first note will appear here.</div>
            ) : (
              <div className="mt-6 space-y-3">
                {sortedFeedback.map((item) => (
                  <div key={item.feedbackId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }, (_, index) => (
                          <Star key={`${item.feedbackId}-${index}`} size={14} fill={index < item.rating ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{item.message}</p>
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

export default StudentFeedbackPage

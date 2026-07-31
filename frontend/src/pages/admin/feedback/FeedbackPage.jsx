import { useEffect, useMemo, useState } from 'react'
import { Eye, Search, Filter } from 'lucide-react'
import AdminLayout from '../../../components/layout/AdminLayout'
import SectionHeader from '../../../components/layout/SectionHeader'
import { Button } from '../../../components/ui/button'
import api from '../../../components/common/api'

const ratingOptions = [
  { value: '', label: 'All ratings' },
  { value: '5', label: '5 stars' },
  { value: '4', label: '4 stars' },
  { value: '3', label: '3 stars' },
  { value: '2', label: '2 stars' },
  { value: '1', label: '1 star' },
]

function FeedbackPage() {
  const [feedback, setFeedback] = useState([])
  const [search, setSearch] = useState('')
  const [rating, setRating] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedFeedback, setSelectedFeedback] = useState(null)

  const fetchFeedback = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await api.get('/feedback', {
        params: {
          search: search || undefined,
          rating: rating || undefined,
        },
      })
      setFeedback(response.data)
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to load feedback.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debounce = setTimeout(fetchFeedback, 250)
    return () => clearTimeout(debounce)
  }, [search, rating])

  const feedbackCount = feedback.length

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Feedback"
            description="Review student feedback and ratings."
          />

          {error ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 lg:max-w-md">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-500"
                placeholder="Search by student name"
              />
            </div>
            <select
              value={rating}
              onChange={(event) => setRating(event.target.value)}
              className="w-full max-w-xs rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
            >
              {ratingOptions.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Feedback</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-10 text-center text-slate-500">
                      Loading feedback...
                    </td>
                  </tr>
                ) : feedbackCount === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-10 text-center text-slate-500">
                      No feedback found.
                    </td>
                  </tr>
                ) : (
                  feedback.map((item) => (
                    <tr key={item.feedbackId} className="border-t border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{item.userName}</td>
                      <td className="px-4 py-3 text-slate-600">{item.rating} / 5</td>
                      <td className="px-4 py-3 text-slate-600">{item.message.length > 80 ? `${item.message.slice(0, 80)}...` : item.message}</td>
                      <td className="px-4 py-3 text-slate-600">{item.createdAt?.replace('T', ' ')}</td>
                      <td className="px-4 py-3">
                        <Button variant="outline" size="sm" onClick={() => setSelectedFeedback(item)}>
                          <Eye size={14} /> View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-slate-500">Showing {feedbackCount} feedback item{feedbackCount === 1 ? '' : 's'}.</div>
        </div>
      </div>

      {selectedFeedback ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-8">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                  <Filter size={16} /> Feedback details
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">{selectedFeedback.userName}</h2>
                <p className="mt-1 text-sm text-slate-600">Rating: {selectedFeedback.rating} / 5</p>
              </div>
              <button className="text-sm text-slate-500" onClick={() => setSelectedFeedback(null)}>Close</button>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-600">Feedback message</p>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{selectedFeedback.message}</p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-medium text-slate-600">Submitted</p>
                <p className="mt-2 text-sm text-slate-900">{selectedFeedback.createdAt?.replace('T', ' ')}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-medium text-slate-600">User</p>
                <p className="mt-2 text-sm text-slate-900">{selectedFeedback.userName}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  )
}

export default FeedbackPage

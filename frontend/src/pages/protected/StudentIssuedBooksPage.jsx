import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import SectionHeader from '../../components/layout/SectionHeader'
import api from '../../components/common/api'

function StudentIssuedBooksPage() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadIssues = async () => {
      try {
        setLoading(true)
        const response = await api.get('/book-issues/my')
        setIssues(response.data || [])
      } catch (requestError) {
        setError(requestError?.response?.data?.message || 'Unable to load your issued books.')
      } finally {
        setLoading(false)
      }
    }

    loadIssues()
  }, [])

  const sortedIssues = useMemo(() => [...issues].sort((first, second) => new Date(second.issueDate) - new Date(first.issueDate)), [issues])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader title="My Issued Books" description="A list of books currently assigned to you, including return dates and overdue status." />

          {error ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Book</th>
                  <th className="px-4 py-3">Issue Date</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Return Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-500">Loading issued books...</td></tr>
                ) : sortedIssues.length === 0 ? (
                  <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-500">You do not currently have any issued books.</td></tr>
                ) : (
                  sortedIssues.map((issue) => (
                    <tr key={issue.issueId} className="border-t border-slate-200">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{issue.bookTitle}</p>
                        {issue.overdue ? <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-red-600">Overdue</p> : null}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{issue.issueDate}</td>
                      <td className={`px-4 py-3 ${issue.overdue ? 'font-medium text-red-600' : 'text-slate-600'}`}>{issue.dueDate}</td>
                      <td className="px-4 py-3 text-slate-600">{issue.returnDate || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${issue.status === 'RETURNED' ? 'bg-emerald-100 text-emerald-700' : issue.overdue ? 'bg-red-100 text-red-700' : 'bg-sky-100 text-sky-700'}`}>
                          {issue.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default StudentIssuedBooksPage

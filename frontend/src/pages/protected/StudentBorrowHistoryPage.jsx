import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import SectionHeader from '../../components/layout/SectionHeader'
import api from '../../components/common/api'

function StudentBorrowHistoryPage() {
  const [issues, setIssues] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true)
        const response = await api.get('/book-issues/my')
        setIssues(response.data || [])
      } catch (requestError) {
        setError(requestError?.response?.data?.message || 'Unable to load borrow history.')
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [])

  const filteredHistory = useMemo(() => {
    const normalizedSearch = search.toLowerCase()

    return [...issues]
      .filter((issue) => issue.status === 'RETURNED')
      .filter((issue) => !normalizedSearch || issue.bookTitle.toLowerCase().includes(normalizedSearch))
      .sort((first, second) => new Date(second.returnDate || second.dueDate) - new Date(first.returnDate || first.dueDate))
  }, [issues, search])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader title="Borrow History" description="Review the books you have already returned, with the newest entries first." />

          <div className="mt-6 relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-500"
              placeholder="Search by title"
            />
          </div>

          {error ? <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Book</th>
                  <th className="px-4 py-3">Issued</th>
                  <th className="px-4 py-3">Due</th>
                  <th className="px-4 py-3">Returned</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="px-4 py-8 text-center text-slate-500">Loading borrow history...</td></tr>
                ) : filteredHistory.length === 0 ? (
                  <tr><td colSpan="4" className="px-4 py-8 text-center text-slate-500">No returned books match your search.</td></tr>
                ) : (
                  filteredHistory.map((issue) => (
                    <tr key={issue.issueId} className="border-t border-slate-200">
                      <td className="px-4 py-3 font-medium text-slate-900">{issue.bookTitle}</td>
                      <td className="px-4 py-3 text-slate-600">{issue.issueDate}</td>
                      <td className="px-4 py-3 text-slate-600">{issue.dueDate}</td>
                      <td className="px-4 py-3 text-slate-600">{issue.returnDate || '—'}</td>
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

export default StudentBorrowHistoryPage

import { useEffect, useMemo, useState } from 'react'
import { BookOpenCheck, CheckCircle2, Plus, Search } from 'lucide-react'
import AdminLayout from '../../../components/layout/AdminLayout'
import SectionHeader from '../../../components/layout/SectionHeader'
import { Button } from '../../../components/ui/button'
import api from '../../../components/common/api'
import { PAGE_SIZE } from '../../../constants/pagination'

const tomorrow = () => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().slice(0, 10)
}

const errorMessage = (error, fallback) => error?.response?.data?.message || fallback

function IssuesPage() {
  const [issues, setIssues] = useState([])
  const [students, setStudents] = useState([])
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showIssueDialog, setShowIssueDialog] = useState(false)
  const [issueConfirmation, setIssueConfirmation] = useState(false)
  const [returnTarget, setReturnTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [formData, setFormData] = useState({ userId: '', bookId: '', dueDate: tomorrow() })

  const fetchIssues = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await api.get('/book-issues', { params: { search: search || undefined, status: status || undefined } })
      setIssues(response.data)
    } catch (requestError) {
      setError(errorMessage(requestError, 'Unable to load book issues.'))
    } finally {
      setLoading(false)
    }
  }

  const loadIssueFormData = async () => {
    try {
      const [studentsResponse, booksResponse] = await Promise.all([
        api.get('/book-issues/students'),
        api.get('/books'),
      ])
      setStudents(studentsResponse.data.filter((student) => student.enabled))
      setBooks(booksResponse.data)
    } catch (requestError) {
      setError(errorMessage(requestError, 'Unable to load students and books for issuing.'))
    }
  }

  useEffect(() => {
    const timeout = setTimeout(fetchIssues, 250)
    return () => clearTimeout(timeout)
  }, [search, status])

  useEffect(() => {
    loadIssueFormData()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [search, status])

  const availableBooks = useMemo(() => books.filter((book) => book.availableQuantity > 0), [books])
  const sortedIssues = useMemo(() => [...issues].sort((left, right) => Number(right.overdue) - Number(left.overdue)), [issues])
  const totalPages = Math.max(1, Math.ceil(sortedIssues.length / PAGE_SIZE))
  const paginatedIssues = sortedIssues.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const selectedStudent = students.find((student) => String(student.id) === String(formData.userId))
  const selectedBook = books.find((book) => String(book.bookId) === String(formData.bookId))

  const closeIssueDialog = () => {
    setShowIssueDialog(false)
    setIssueConfirmation(false)
    setFormError('')
    setFormData({ userId: '', bookId: '', dueDate: tomorrow() })
  }

  const requestIssue = (event) => {
    event.preventDefault()
    if (!formData.userId || !formData.bookId || !formData.dueDate) {
      setFormError('Select a student, book, and future due date.')
      return
    }
    if (formData.dueDate <= new Date().toISOString().slice(0, 10)) {
      setFormError('Due date must be after today.')
      return
    }
    setFormError('')
    setIssueConfirmation(true)
  }

  const confirmIssue = async () => {
    try {
      setSubmitting(true)
      await api.post('/book-issues', {
        userId: Number(formData.userId),
        bookId: Number(formData.bookId),
        dueDate: formData.dueDate,
      })
      closeIssueDialog()
      await Promise.all([fetchIssues(), loadIssueFormData()])
    } catch (requestError) {
      setIssueConfirmation(false)
      setFormError(errorMessage(requestError, 'Unable to issue this book.'))
    } finally {
      setSubmitting(false)
    }
  }

  const confirmReturn = async () => {
    if (!returnTarget) return
    try {
      setSubmitting(true)
      await api.put(`/book-issues/${returnTarget.issueId}/return`)
      setReturnTarget(null)
      await Promise.all([fetchIssues(), loadIssueFormData()])
    } catch (requestError) {
      setError(errorMessage(requestError, 'Unable to return this book.'))
    } finally {
      setSubmitting(false)
    }
  }

  const statusLabel = (issue) => issue.overdue ? 'Overdue' : issue.status === 'ISSUED' ? 'Issued' : 'Returned'
  const statusClass = (issue) => issue.overdue
    ? 'bg-red-100 text-red-700'
    : issue.status === 'ISSUED' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Book Issues"
            description="Issue books, record returns, and follow up on overdue loans."
            action={<Button onClick={() => setShowIssueDialog(true)}><Plus size={16} /> Issue Book</Button>}
          />

          {error ? <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          <div className="mt-6 flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-500" placeholder="Search student or book" />
            </div>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-sky-500">
              <option value="">All statuses</option>
              <option value="ISSUED">Issued</option>
              <option value="RETURNED">Returned</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600"><tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Book</th><th className="px-4 py-3">Issued</th><th className="px-4 py-3">Due</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Action</th></tr></thead>
              <tbody>
                {loading ? <tr><td colSpan="6" className="px-4 py-10 text-center text-slate-500">Loading book issues...</td></tr> : null}
                {!loading && paginatedIssues.length === 0 ? <tr><td colSpan="6" className="px-4 py-10 text-center text-slate-500">No book issues match these filters.</td></tr> : null}
                {!loading && paginatedIssues.map((issue) => <tr key={issue.issueId} className={`border-t border-slate-200 ${issue.overdue ? 'bg-red-50/70' : ''}`}>
                  <td className="px-4 py-3 font-medium text-slate-900">{issue.userName}</td>
                  <td className="px-4 py-3"><p className="font-medium text-slate-900">{issue.bookTitle}</p><p className="text-xs text-slate-500">#{issue.issueId}</p></td>
                  <td className="px-4 py-3 text-slate-600">{issue.issueDate}</td>
                  <td className="px-4 py-3 text-slate-600">{issue.dueDate}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(issue)}`}>{statusLabel(issue)}</span></td>
                  <td className="px-4 py-3">{issue.status === 'ISSUED' ? <Button size="sm" variant="outline" onClick={() => setReturnTarget(issue)}><CheckCircle2 size={15} /> Return</Button> : <span className="text-xs text-slate-500">Returned {issue.returnDate}</span>}</td>
                </tr>)}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>Showing {paginatedIssues.length} of {issues.length} issues</span>
            <div className="flex items-center gap-2"><Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</Button><span>Page {page} of {totalPages}</span><Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((value) => value + 1)}>Next</Button></div>
          </div>
        </div>
      </div>

      {showIssueDialog ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4"><div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4"><div><h3 className="text-xl font-semibold text-slate-900">Issue a book</h3><p className="mt-1 text-sm text-slate-500">Only available books can be issued to active students.</p></div><button className="text-sm text-slate-500" onClick={closeIssueDialog}>Close</button></div>
        <form className="mt-6 space-y-4" onSubmit={requestIssue} noValidate>
          <label className="block text-sm font-medium text-slate-700">Student<select value={formData.userId} onChange={(event) => setFormData({ ...formData, userId: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"><option value="">Select student</option>{students.map((student) => <option key={student.id} value={student.id}>{student.fullName} — {student.email}</option>)}</select></label>
          <label className="block text-sm font-medium text-slate-700">Book<select value={formData.bookId} onChange={(event) => setFormData({ ...formData, bookId: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"><option value="">Select available book</option>{availableBooks.map((book) => <option key={book.bookId} value={book.bookId}>{book.title} ({book.availableQuantity} available)</option>)}</select></label>
          <label className="block text-sm font-medium text-slate-700">Due date<input type="date" min={tomorrow()} value={formData.dueDate} onChange={(event) => setFormData({ ...formData, dueDate: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /></label>
          {formError ? <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p> : null}
          <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={closeIssueDialog}>Cancel</Button><Button type="submit"><BookOpenCheck size={16} /> Review issue</Button></div>
        </form>
      </div></div> : null}

      {issueConfirmation ? <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 px-4"><div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"><h3 className="text-xl font-semibold text-slate-900">Confirm book issue</h3><p className="mt-3 text-sm text-slate-600">Issue <strong>{selectedBook?.title}</strong> to <strong>{selectedStudent?.fullName}</strong> until {formData.dueDate}?</p><div className="mt-6 flex justify-end gap-3"><Button variant="outline" disabled={submitting} onClick={() => setIssueConfirmation(false)}>Back</Button><Button disabled={submitting} onClick={confirmIssue}>{submitting ? 'Issuing...' : 'Confirm issue'}</Button></div></div></div> : null}

      {returnTarget ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4"><div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"><h3 className="text-xl font-semibold text-slate-900">Confirm return</h3><p className="mt-3 text-sm text-slate-600">Mark <strong>{returnTarget.bookTitle}</strong> as returned by <strong>{returnTarget.userName}</strong>? The available quantity will increase.</p><div className="mt-6 flex justify-end gap-3"><Button variant="outline" disabled={submitting} onClick={() => setReturnTarget(null)}>Cancel</Button><Button disabled={submitting} onClick={confirmReturn}>{submitting ? 'Returning...' : 'Confirm return'}</Button></div></div></div> : null}
    </AdminLayout>
  )
}

export default IssuesPage

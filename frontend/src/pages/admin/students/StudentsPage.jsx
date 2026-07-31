import { useEffect, useMemo, useState } from 'react'
import { Eye, Search, ShieldOff, Trash2, UserCheck2 } from 'lucide-react'
import AdminLayout from '../../../components/layout/AdminLayout'
import SectionHeader from '../../../components/layout/SectionHeader'
import { Button } from '../../../components/ui/button'
import api from '../../../components/common/api'
import { useAuth } from '../../../components/common/AuthContext'

const PAGE_SIZE = 6

function StudentsPage() {
  const { user } = useAuth()
  const isLibrarian = user?.role?.toUpperCase() === 'LIBRARIAN'
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [message, setMessage] = useState('')

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await api.get(isLibrarian ? '/book-issues/students' : '/admin/students', { params: { search } })
      setStudents(response.data)
    } catch (error) {
      console.error('Failed to fetch students', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [isLibrarian])

  useEffect(() => {
    const debounce = setTimeout(() => {
      setPage(1)
      fetchStudents()
    }, 300)

    return () => clearTimeout(debounce)
  }, [search])

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const query = search.toLowerCase()
      return !query || [student.fullName, student.email, student.phoneNumber].join(' ').toLowerCase().includes(query)
    })
  }, [students, search])

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE))
  const paginatedStudents = filteredStudents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [search])

  const openStudent = async (student) => {
    try {
      const response = await api.get(isLibrarian ? `/book-issues/students/${student.id}` : `/admin/students/${student.id}`)
      setSelectedStudent(response.data)
    } catch (error) {
      console.error('Failed to load student details', error)
    }
  }

  const handleToggleStatus = async (student) => {
    try {
      const response = await api.post(
        `/admin/students/${student.id}/status`
      );

      setMessage(
        `${response.data.fullName} has been ${
          response.data.enabled ? "enabled" : "disabled"
        }.`
      );

      fetchStudents();
    } catch (error) {
      console.error("Failed to update student status", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      await api.delete(`/admin/students/${deleteTarget.id}`)
      setDeleteTarget(null)
      setMessage(`${deleteTarget.fullName} has been deleted.`)
      fetchStudents()
    } catch (error) {
      console.error('Failed to delete student', error)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title={isLibrarian ? 'Student Lookup' : 'Students'}
            description={isLibrarian ? 'Search students and review their borrowing records.' : 'Review student accounts, manage access, and inspect borrowing history.'}
          />

          {message ? (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          ) : null}

          <div className="mt-6 relative w-full lg:max-w-sm">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-500"
              placeholder="Search by name, email, or phone"
            />
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-slate-500">Loading students...</td>
                  </tr>
                ) : paginatedStudents.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-slate-500">No students found.</td>
                  </tr>
                ) : (
                  paginatedStudents.map((student) => (
                    <tr key={student.id} className="border-t border-slate-200">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{student.fullName}</p>
                        <p className="text-xs text-slate-500">{student.email}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{student.phoneNumber}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${student.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {student.enabled ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openStudent(student)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50">
                            <Eye size={16} />
                          </button>


                          {!isLibrarian ? <>
                            <button onClick={() => handleToggleStatus(student)} className={`rounded-lg border p-2 ${student.enabled ? 'border-amber-200 text-amber-600 hover:bg-amber-50' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'}`}>
                              {student.enabled ? <ShieldOff size={16} /> : <UserCheck2 size={16} />}
                            </button>
                            <button onClick={() => setDeleteTarget(student)} className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50">
                              <Trash2 size={16} />
                            </button>
                          </> : null}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">Showing {paginatedStudents.length} of {filteredStudents.length} students</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>Previous</Button>
              <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)}>Next</Button>
            </div>
          </div>
        </div>
      </div>

      {selectedStudent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{selectedStudent.fullName}</h3>
                <p className="mt-1 text-sm text-slate-500">{selectedStudent.email}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-sm text-slate-500">Close</button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-600">Status</p>
                <p className="mt-2 text-sm text-slate-900">{selectedStudent.enabled ? 'Active account' : 'Disabled account'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-600">Borrow Count</p>
                <p className="mt-2 text-sm text-slate-900">{selectedStudent.borrowCount}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-600">Phone</p>
                <p className="mt-2 text-sm text-slate-900">{selectedStudent.phoneNumber}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-600">Joined</p>
                <p className="mt-2 text-sm text-slate-900">{selectedStudent.joinedAt}</p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Current Issued Books</h4>
              <div className="mt-3 space-y-2">
                {selectedStudent.borrowHistory?.filter((issue) => issue.status === 'ISSUED').length ? selectedStudent.borrowHistory.filter((issue) => issue.status === 'ISSUED').map((issue) => (
                  <div key={issue.issueId} className="rounded-2xl border border-slate-200 p-3 text-sm text-slate-600"><div className="flex items-center justify-between gap-2"><span className="font-medium text-slate-900">{issue.bookTitle}</span><span className={`rounded-full px-2.5 py-1 text-xs ${issue.overdue ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{issue.overdue ? 'Overdue' : 'Issued'}</span></div><p className="mt-1">Due: {issue.dueDate}</p></div>
                )) : <p className="text-sm text-slate-500">No books currently issued.</p>}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Borrow History</h4>
              <div className="mt-3 space-y-2">
                {selectedStudent.borrowHistory?.length ? selectedStudent.borrowHistory.map((issue) => (
                  <div key={issue.issueId} className="rounded-2xl border border-slate-200 p-3 text-sm text-slate-600">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-slate-900">{issue.bookTitle}</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{issue.status}</span>
                    </div>
                    <p className="mt-1">Issued: {issue.issueDate}</p>
                    <p className="text-xs text-slate-500">Due: {issue.dueDate}</p>
                  </div>
                )) : <p className="text-sm text-slate-500">No borrow history yet.</p>}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {!isLibrarian && deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-slate-900">Delete student account?</h3>
            <p className="mt-3 text-sm text-slate-600">This will permanently remove {deleteTarget.fullName} from the system.</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  )
}

export default StudentsPage

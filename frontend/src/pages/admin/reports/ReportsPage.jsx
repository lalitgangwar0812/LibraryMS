import { useEffect, useState } from 'react'
import { BookOpen, BookText, ClipboardList, Users, MessageCircle, LayoutDashboard, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../../components/layout/AdminLayout'
import SectionHeader from '../../../components/layout/SectionHeader'
import { Button } from '../../../components/ui/button'
import api from '../../../components/common/api'

function ReportsPage() {
  const [dashboard, setDashboard] = useState(null)
  const [recentIssues, setRecentIssues] = useState([])
  const [recentComplaints, setRecentComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true)
        setError('')
        const [dashboardResponse, issuesResponse, complaintsResponse] = await Promise.all([
          api.get('/dashboard'),
          api.get('/book-issues', { params: { status: 'ISSUED' } }),
          api.get('/complaints', { params: { } }),
        ])
        setDashboard(dashboardResponse.data)
        setRecentIssues(issuesResponse.data.slice(0, 5))
        setRecentComplaints(complaintsResponse.data.slice(0, 5))
      } catch (requestError) {
        setError(requestError?.response?.data?.message || 'Unable to load report data.')
      } finally {
        setLoading(false)
      }
    }
    loadReports()
  }, [])

  const accentClasses = {
    sky: 'bg-sky-100 text-sky-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    violet: 'bg-violet-100 text-violet-700',
    amber: 'bg-amber-100 text-amber-700',
  }

  const stats = dashboard ? [
    { title: 'Total Books', value: dashboard.totalBooks, icon: <BookText size={20} />, accent: 'sky' },
    { title: 'Available Books', value: dashboard.availableBooks, icon: <BookOpen size={20} />, accent: 'emerald' },
    { title: 'Total Categories', value: dashboard.totalCategories, icon: <BookOpen size={20} />, accent: 'violet' },
    { title: 'Total Students', value: dashboard.totalStudents, icon: <Users size={20} />, accent: 'emerald' },
    { title: 'Total Librarians', value: dashboard.totalLibrarians, icon: <Users size={20} />, accent: 'sky' },
    { title: 'Books Issued', value: dashboard.totalIssuedBooks, icon: <ClipboardList size={20} />, accent: 'amber' },
    { title: 'Returned Books', value: dashboard.totalReturnedBooks, icon: <ClipboardList size={20} />, accent: 'emerald' },
    { title: 'Pending Complaints', value: dashboard.pendingComplaints, icon: <MessageCircle size={20} />, accent: 'amber' },
    { title: 'Resolved Complaints', value: dashboard.resolvedComplaints, icon: <MessageCircle size={20} />, accent: 'emerald' },
    { title: 'Avg Feedback', value: dashboard.averageFeedbackRating.toFixed(1), icon: <Star size={20} />, accent: 'sky' },
  ] : []

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Reports"
            description="View analytics and operational summaries."
            action={<Button asChild variant="outline"><Link to="/admin/complaints">View complaints</Link></Button>}
          />

          {error ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading reports...</div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                        <p className="mt-3 text-3xl font-semibold text-slate-900">{stat.value}</p>
                      </div>
                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${accentClasses[stat.accent]}`}>
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Recent issued books</h3>
                      <p className="text-sm text-slate-500">Latest active loans across the library.</p>
                    </div>
                    <Button asChild variant="outline" size="sm"><Link to="/admin/issues">View all</Link></Button>
                  </div>

                  <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="px-4 py-3">Student</th>
                          <th className="px-4 py-3">Book</th>
                          <th className="px-4 py-3">Due date</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentIssues.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="px-4 py-10 text-center text-slate-500">No recent issued books.</td>
                          </tr>
                        ) : recentIssues.map((issue) => (
                          <tr key={issue.issueId} className="border-t border-slate-200 hover:bg-slate-50">
                            <td className="px-4 py-3 font-medium text-slate-900">{issue.userName}</td>
                            <td className="px-4 py-3 text-slate-600">{issue.bookTitle}</td>
                            <td className="px-4 py-3 text-slate-600">{issue.dueDate}</td>
                            <td className="px-4 py-3 text-slate-600">{issue.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Recent complaints</h3>
                    <p className="text-sm text-slate-500">Newest complaints submitted by students.</p>
                  </div>
                  <div className="mt-6 space-y-3">
                    {recentComplaints.length === 0 ? (
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">No recent complaints.</div>
                    ) : recentComplaints.map((complaint) => (
                      <div key={complaint.complaintId} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <p className="font-medium text-slate-900">{complaint.subject}</p>
                        <p className="mt-1 text-sm text-slate-500">{complaint.userName}</p>
                        <div className="mt-3 flex items-center justify-between gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
                          <span>{complaint.status}</span>
                          <span>{complaint.createdAt?.slice(0, 10)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default ReportsPage

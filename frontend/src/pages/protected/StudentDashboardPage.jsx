import { useEffect, useMemo, useState } from 'react'
import { BookOpen, BookText, CalendarDays, ClipboardList, Newspaper, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import DashboardCard from '../../components/layout/DashboardCard'
import SectionHeader from '../../components/layout/SectionHeader'
import { Button } from '../../components/ui/button'
import { useAuth } from '../../components/common/AuthContext'
import api from '../../components/common/api'

function StudentDashboardPage() {
  const { user } = useAuth()
  const [issues, setIssues] = useState([])
  const [complaints, setComplaints] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        const [issuesResponse, complaintsResponse, newsResponse] = await Promise.all([
          api.get('/book-issues/my'),
          api.get('/complaints/my'),
          api.get('/news'),
        ])

        setIssues(issuesResponse.data || [])
        setComplaints(complaintsResponse.data || [])
        setNews(newsResponse.data || [])
      } catch (requestError) {
        setError(requestError?.response?.data?.message || 'Unable to load student dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const cards = useMemo(() => {
    const currentIssuedCount = issues.filter((issue) => issue.status !== 'RETURNED').length
    const overdueCount = issues.filter((issue) => issue.overdue).length
    const pendingComplaintsCount = complaints.filter((complaint) => complaint.status === 'PENDING').length

    return [
      { title: 'Books Currently Issued', value: currentIssuedCount, subtitle: 'Active loans', icon: <BookOpen size={20} />, accent: 'sky' },
      { title: 'Total Books Borrowed', value: issues.length, subtitle: 'All borrow history', icon: <BookText size={20} />, accent: 'emerald' },
      { title: 'Overdue Books', value: overdueCount, subtitle: 'Need attention', icon: <TriangleAlert size={20} />, accent: 'amber' },
      { title: 'Pending Complaints', value: pendingComplaintsCount, subtitle: 'Awaiting review', icon: <ClipboardList size={20} />, accent: 'violet' },
    ]
  }, [complaints, issues])

  const dueSoonBooks = useMemo(() => {
    return [...issues]
      .filter((issue) => issue.status !== 'RETURNED')
      .sort((first, second) => new Date(first.dueDate) - new Date(second.dueDate))
      .slice(0, 5)
  }, [issues])

  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Student Portal</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Welcome back, {user?.fullName || user?.email || 'Student'}.</h1>
              <p className="mt-2 text-sm text-slate-500">{currentDate}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <p className="font-medium text-slate-900">Quick access to your library activities</p>
            </div>
          </div>
        </div>

        {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading your dashboard...</div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {cards.map((card) => (
                <DashboardCard key={card.title} {...card} />
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <SectionHeader
                  title="Quick Actions"
                  description="Jump straight to the student pages you use most often."
                />
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Button asChild className="justify-start">
                    <Link to="/student/books">Browse Books</Link>
                  </Button>
                  <Button asChild variant="outline" className="justify-start">
                    <Link to="/student/issued-books">My Issued Books</Link>
                  </Button>
                  <Button asChild variant="outline" className="justify-start">
                    <Link to="/student/complaints">Submit Complaint</Link>
                  </Button>
                  <Button asChild variant="outline" className="justify-start">
                    <Link to="/student/feedback">Give Feedback</Link>
                  </Button>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <SectionHeader title="Latest News" description="The newest announcements from the library." />
                <div className="mt-4 space-y-3">
                  {news.slice(0, 5).map((item) => (
                    <div key={item.newsId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-2 text-sm text-sky-600">
                        <Newspaper size={16} />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="mt-2 font-medium text-slate-900">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader title="Books Due Soon" description="Your active loans sorted by the next due date." />
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-3">Book</th>
                      <th className="px-4 py-3">Issue Date</th>
                      <th className="px-4 py-3">Due Date</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dueSoonBooks.length === 0 ? (
                      <tr><td colSpan="4" className="px-4 py-8 text-center text-slate-500">You do not currently have any active loans.</td></tr>
                    ) : (
                      dueSoonBooks.map((issue) => (
                        <tr key={issue.issueId} className="border-t border-slate-200">
                          <td className="px-4 py-3 font-medium text-slate-900">{issue.bookTitle}</td>
                          <td className="px-4 py-3 text-slate-600">{issue.issueDate}</td>
                          <td className={`px-4 py-3 ${issue.overdue ? 'font-medium text-red-600' : 'text-slate-600'}`}>{issue.dueDate}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${issue.overdue ? 'bg-red-100 text-red-700' : 'bg-sky-100 text-sky-700'}`}>
                              {issue.overdue ? 'Overdue' : 'Active'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}

export default StudentDashboardPage

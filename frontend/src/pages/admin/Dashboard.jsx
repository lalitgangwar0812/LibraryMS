import { useEffect, useMemo, useState } from 'react'
import { BookOpen, BookText, ClipboardList, GraduationCap, TriangleAlert, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import DashboardCard from '../../components/layout/DashboardCard'
import SectionHeader from '../../components/layout/SectionHeader'
import { Button } from '../../components/ui/button'
import api from '../../components/common/api'

function Dashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [recentIssues, setRecentIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)
        const [dashboardResponse, issuesResponse] = await Promise.all([
          api.get('/dashboard'),
          api.get('/book-issues'),
        ])
        setDashboard(dashboardResponse.data)
        setRecentIssues(issuesResponse.data.filter((issue) => issue.status === 'ISSUED').slice(0, 5))
      } catch (requestError) {
        setError(requestError?.response?.data?.message || 'Unable to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  const cards = useMemo(() => {
    if (!dashboard) return []
    return [
      { title: 'Total Books', value: dashboard.totalBooks, subtitle: 'Catalog records', icon: <BookText size={20} />, accent: 'sky' },
      { title: 'Total Students', value: dashboard.totalStudents, subtitle: 'Registered students', icon: <GraduationCap size={20} />, accent: 'emerald' },
      { title: 'Total Librarians', value: dashboard.totalLibrarians, subtitle: 'Staff accounts', icon: <Users size={20} />, accent: 'violet' },
      { title: 'Books Issued', value: dashboard.totalIssuedBooks, subtitle: 'Currently on loan', icon: <ClipboardList size={20} />, accent: 'amber' },
      { title: 'Overdue Books', value: dashboard.overdueBooks, subtitle: 'Need follow-up', icon: <TriangleAlert size={20} />, accent: 'amber' },
      { title: 'Categories', value: dashboard.totalCategories, subtitle: 'Library collections', icon: <BookOpen size={20} />, accent: 'emerald' },
    ]
  }, [dashboard])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button asChild variant="outline"><Link to="/admin/librarians?create=1">Add Librarian</Link></Button>
          <Button asChild><Link to="/admin/news?create=1">Add News</Link></Button>
        </div>

        {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
        {loading ? <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading dashboard statistics...</div> : <>
          <div className="lms-stagger grid gap-4 md:grid-cols-2 xl:grid-cols-3">{cards.map((card) => <DashboardCard key={card.title} {...card} />)}</div>
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><SectionHeader title="Book issue activity" description="Current loans and upcoming due dates" action={<Button asChild variant="outline" size="sm"><Link to="/admin/issues">View all</Link></Button>} />
              <div className="overflow-x-auto rounded-2xl border border-slate-200"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Book</th><th className="px-4 py-3">Due</th></tr></thead><tbody>{recentIssues.length ? recentIssues.map((issue) => <tr key={issue.issueId} className="border-t border-slate-200"><td className="px-4 py-3 font-medium text-slate-900">{issue.userName}</td><td className="px-4 py-3 text-slate-600">{issue.bookTitle}</td><td className={`px-4 py-3 ${issue.overdue ? 'font-medium text-red-600' : 'text-slate-600'}`}>{issue.overdue ? 'Overdue: ' : ''}{issue.dueDate}</td></tr>) : <tr><td colSpan="3" className="px-4 py-8 text-center text-slate-500">No active book issues.</td></tr>}</tbody></table></div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><SectionHeader title="Issue summary" description="Real-time circulation status" /><div className="space-y-3"><div className="rounded-2xl bg-amber-50 p-4"><p className="text-sm text-amber-700">Active loans</p><p className="mt-1 text-2xl font-semibold text-amber-900">{dashboard.totalIssuedBooks}</p></div><div className="rounded-2xl bg-red-50 p-4"><p className="text-sm text-red-700">Overdue loans</p><p className="mt-1 text-2xl font-semibold text-red-900">{dashboard.overdueBooks}</p></div><div className="rounded-2xl bg-emerald-50 p-4"><p className="text-sm text-emerald-700">Returned books</p><p className="mt-1 text-2xl font-semibold text-emerald-900">{dashboard.totalReturnedBooks}</p></div></div></div>
          </div>
        </>}
      </div>
    </AdminLayout>
  )
}

export default Dashboard

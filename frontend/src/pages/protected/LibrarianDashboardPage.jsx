import { useEffect, useMemo, useState } from 'react'
import { BookText, ClipboardList, TriangleAlert, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import LibrarianLayout from '../../components/layout/LibrarianLayout'
import DashboardCard from '../../components/layout/DashboardCard'
import SectionHeader from '../../components/layout/SectionHeader'
import { Button } from '../../components/ui/button'
import api from '../../components/common/api'

function LibrarianDashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const [latestIssues, setLatestIssues] = useState([])
  const [recentReturns, setRecentReturns] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [dashboardResponse, issuesResponse] = await Promise.all([
          api.get('/dashboard'),
          api.get('/book-issues'),
        ])
        setDashboard(dashboardResponse.data)
        setLatestIssues(issuesResponse.data.slice(0, 5))
        setRecentReturns(issuesResponse.data.filter((issue) => issue.status === 'RETURNED').sort((left, right) => String(right.returnDate).localeCompare(String(left.returnDate))).slice(0, 5))
      } catch (requestError) {
        setError(requestError?.response?.data?.message || 'Unable to load dashboard data.')
      }
    }
    loadDashboard()
  }, [])

  const cards = useMemo(() => dashboard ? [
    { title: 'Total Books', value: dashboard.totalBooks, subtitle: 'Catalog records', icon: <BookText size={20} />, accent: 'sky' },
    { title: 'Active Loans', value: dashboard.totalIssuedBooks, subtitle: 'Currently on loan', icon: <ClipboardList size={20} />, accent: 'amber' },
    { title: 'Overdue Books', value: dashboard.overdueBooks, subtitle: 'Need follow-up', icon: <TriangleAlert size={20} />, accent: 'amber' },
    { title: 'Books Issued Today', value: dashboard.booksIssuedToday, subtitle: 'New circulation today', icon: <ClipboardList size={20} />, accent: 'emerald' },
    { title: 'Books Returned Today', value: dashboard.booksReturnedToday, subtitle: 'Completed returns today', icon: <ClipboardList size={20} />, accent: 'emerald' },
    { title: 'Total Registered Students', value: dashboard.totalStudents, subtitle: 'Student accounts', icon: <Users size={20} />, accent: 'violet' },
  ] : [], [dashboard, latestIssues])

  return (
    <LibrarianLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap justify-end gap-3">
          <Button asChild variant="outline"><Link to="/librarian/books">Manage Books</Link></Button>
          <Button asChild><Link to="/librarian/issues">Issue/Return Books</Link></Button>
        </div>
        {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
        {!dashboard ? <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading dashboard statistics...</div> : <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{cards.map((card) => <DashboardCard key={card.title} {...card} />)}</div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader title="Latest issue transactions" description="The five most recent book issue and return records." action={<Button asChild variant="outline" size="sm"><Link to="/librarian/issues">View all</Link></Button>} />
            <div className="overflow-x-auto rounded-2xl border border-slate-200"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Book</th><th className="px-4 py-3">Issued</th><th className="px-4 py-3">Status</th></tr></thead><tbody>{latestIssues.length ? latestIssues.map((issue) => <tr key={issue.issueId} className="border-t border-slate-200"><td className="px-4 py-3 font-medium text-slate-900">{issue.userName}</td><td className="px-4 py-3 text-slate-600">{issue.bookTitle}</td><td className="px-4 py-3 text-slate-600">{issue.issueDate}</td><td className="px-4 py-3 text-slate-600">{issue.overdue ? 'Overdue' : issue.status === 'ISSUED' ? 'Issued' : 'Returned'}</td></tr>) : <tr><td colSpan="4" className="px-4 py-8 text-center text-slate-500">No issue transactions yet.</td></tr>}</tbody></table></div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader title="Recently Returned Books" description="The five most recently completed returns." />
            <div className="overflow-x-auto rounded-2xl border border-slate-200"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Book</th><th className="px-4 py-3">Returned</th></tr></thead><tbody>{recentReturns.length ? recentReturns.map((issue) => <tr key={issue.issueId} className="border-t border-slate-200"><td className="px-4 py-3 font-medium text-slate-900">{issue.userName}</td><td className="px-4 py-3 text-slate-600">{issue.bookTitle}</td><td className="px-4 py-3 text-slate-600">{issue.returnDate}</td></tr>) : <tr><td colSpan="3" className="px-4 py-8 text-center text-slate-500">No returned books yet.</td></tr>}</tbody></table></div>
          </div>
        </>}
      </div>
    </LibrarianLayout>
  )
}

export default LibrarianDashboardPage

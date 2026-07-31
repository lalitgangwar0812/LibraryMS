import { useEffect, useMemo, useState } from 'react'
import { Search, Newspaper } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import SectionHeader from '../../components/layout/SectionHeader'
import api from '../../components/common/api'

function StudentNewsPage() {
  const [newsItems, setNewsItems] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true)
        const response = await api.get('/news')
        setNewsItems(response.data || [])
      } catch (requestError) {
        setError(requestError?.response?.data?.message || 'Unable to load news updates.')
      } finally {
        setLoading(false)
      }
    }

    loadNews()
  }, [])

  const filteredNews = useMemo(() => {
    const normalizedSearch = search.toLowerCase()

    return newsItems.filter((item) => !normalizedSearch || item.title.toLowerCase().includes(normalizedSearch))
  }, [newsItems, search])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader title="Latest News" description="Browse the latest library announcements and updates." />

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

          {loading ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">Loading news...</div>
          ) : filteredNews.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">No published news matches your search.</div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {filteredNews.map((item) => (
                <article key={item.newsId} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-2 text-sm text-sky-600">
                    <Newspaper size={16} />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default StudentNewsPage

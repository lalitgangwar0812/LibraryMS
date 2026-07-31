import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, UserRound } from 'lucide-react'
import api from '../../components/common/api'

function PublicNewsPage() {
  const [newsItems, setNewsItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true)
        const response = await api.get('/news')
        setNewsItems(response.data)
      } catch (requestError) {
        setError(requestError?.response?.data?.message || 'Unable to load news.')
      } finally {
        setLoading(false)
      }
    }

    loadNews()
  }, [])

  const filteredNews = useMemo(() => {
    const query = search.toLowerCase()
    return newsItems.filter((item) => !query || [item.title, item.description, item.postedByName].join(' ').toLowerCase().includes(query))
  }, [newsItems, search])

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Library News</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Latest updates from the library</h1>
              <p className="mt-2 text-sm text-slate-600">Browse the latest announcements shared by the administration.</p>
            </div>
            <div className="w-full max-w-md">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                placeholder="Search news"
              />
            </div>
          </div>

          {error ? <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          {loading ? (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">Loading published news...</div>
          ) : filteredNews.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">No published news available right now.</div>
          ) : (
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {filteredNews.map((item) => (
                <article key={item.newsId} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <div className="flex items-center gap-2 text-sm text-sky-600">
                    <CalendarDays size={16} />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-slate-900">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                  <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                    <UserRound size={16} />
                    <span>Posted by {item.postedByName}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PublicNewsPage

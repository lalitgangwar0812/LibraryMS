import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import AdminLayout from '../../../components/layout/AdminLayout'
import SectionHeader from '../../../components/layout/SectionHeader'
import { Button } from '../../../components/ui/button'
import api from '../../../components/common/api'
import { PAGE_SIZE } from '../../../constants/pagination'

function NewsPage() {
  const location = useLocation()
  const [newsItems, setNewsItems] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [formData, setFormData] = useState({ title: '', description: '', published: true })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [message, setMessage] = useState('')

  const fetchNews = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/news', { params: { search, page: page - 1, size: PAGE_SIZE } })
      setNewsItems(response.data)
    } catch (error) {
      console.error('Failed to fetch news', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [page, search])

  useEffect(() => {
    if (new URLSearchParams(location.search).get('create') === '1') {
      openCreateModal()
    }
  }, [location.search])

  useEffect(() => {
    setPage(1)
  }, [search])

  const resetForm = () => {
    setFormData({ title: '', description: '', published: true })
    setErrors({})
    setSubmitError('')
  }

  const validate = () => {
    const nextErrors = {}
    if (!formData.title.trim()) nextErrors.title = 'Title is required.'
    if (!formData.description.trim()) nextErrors.description = 'Description is required.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const openCreateModal = () => {
    resetForm()
    setEditingItem(null)
    setShowModal(true)
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setFormData({ title: item.title, description: item.description, published: item.published })
    setErrors({})
    setSubmitError('')
    setShowModal(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    try {
      if (editingItem) {
        await api.put(`/admin/news/${editingItem.newsId}`, formData)
        setMessage('News updated successfully.')
      } else {
        await api.post('/admin/news', formData)
        setMessage('News created successfully.')
      }
      setShowModal(false)
      resetForm()
      fetchNews()
    } catch (error) {
      setSubmitError(error?.response?.data?.message || 'Unable to save news.')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await api.delete(`/admin/news/${deleteTarget.newsId}`)
      setDeleteTarget(null)
      setMessage('News deleted successfully.')
      fetchNews()
    } catch (error) {
      console.error('Failed to delete news', error)
    }
  }

  const totalPages = Math.max(1, Math.ceil(newsItems.length / PAGE_SIZE))
  const paginatedNews = useMemo(() => newsItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [newsItems, page])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="News Management"
            description="Create, edit, and remove public library announcements."
            action={<Button onClick={openCreateModal}><Plus size={16} className="mr-2" />Add News</Button>}
          />

          {message ? <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}

          <div className="mt-6 relative w-full lg:max-w-sm">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-500"
              placeholder="Search news by title"
            />
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Posted By</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="px-4 py-8 text-center text-slate-500">Loading news...</td></tr>
                ) : newsItems.length === 0 ? (
                  <tr><td colSpan="4" className="px-4 py-8 text-center text-slate-500">No news found.</td></tr>
                ) : (
                  paginatedNews.map((item) => (
                    <tr key={item.newsId} className="border-t border-slate-200">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{item.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.description.slice(0, 80)}{item.description.length > 80 ? '...' : ''}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{item.postedByName}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                          {item.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditModal(item)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"><Pencil size={16} /></button>
                          <button onClick={() => setDeleteTarget(item)} className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">Showing {paginatedNews.length} of {newsItems.length} items</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>Previous</Button>
              <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)}>Next</Button>
            </div>
          </div>
        </div>
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{editingItem ? 'Edit News' : 'Create News'}</h3>
                <p className="mt-1 text-sm text-slate-500">{editingItem ? 'Update the announcement details.' : 'Publish a new announcement for students and librarians.'}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-sm text-slate-500">Close</button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
                <input value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none ${errors.title ? 'border-red-400' : 'border-slate-200'}`} />
                {errors.title ? <p className="mt-2 text-sm text-red-500">{errors.title}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                <textarea value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} rows="5" className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none ${errors.description ? 'border-red-400' : 'border-slate-200'}`} />
                {errors.description ? <p className="mt-2 text-sm text-red-500">{errors.description}</p> : null}
              </div>
              <div className="flex items-center gap-2">
                <input id="published" type="checkbox" checked={formData.published} onChange={(event) => setFormData({ ...formData, published: event.target.checked })} />
                <label htmlFor="published" className="text-sm text-slate-700">Publish immediately</label>
              </div>
              {submitError ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{submitError}</div> : null}
              <div className="flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit">{editingItem ? 'Save Changes' : 'Create News'}</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-slate-900">Delete news?</h3>
            <p className="mt-3 text-sm text-slate-600">This will permanently remove <span className="font-semibold">{deleteTarget.title}</span>.</p>
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

export default NewsPage

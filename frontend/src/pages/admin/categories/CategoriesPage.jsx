import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Trash2, Pencil, Filter } from 'lucide-react'
import AdminLayout from '../../../components/layout/AdminLayout'
import SectionHeader from '../../../components/layout/SectionHeader'
import { Button } from '../../../components/ui/button'
import api from '../../../components/common/api'

const PAGE_SIZE = 6

function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({ categoryName: '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await api.get('/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to fetch categories', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const filteredCategories = useMemo(() => {
    const query = search.toLowerCase()
    return categories.filter((category) => !query || category.categoryName.toLowerCase().includes(query))
  }, [categories, search])

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / PAGE_SIZE))
  const paginatedCategories = filteredCategories.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [search])

  const resetForm = () => {
    setFormData({ categoryName: '' })
    setErrors({})
    setSubmitError('')
  }

  const validate = () => {
    const nextErrors = {}
    if (!formData.categoryName.trim()) nextErrors.categoryName = 'Category name is required.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const openCreateModal = () => {
    resetForm()
    setEditingCategory(null)
    setShowModal(true)
  }

  const openEditModal = (category) => {
    setEditingCategory(category)
    setFormData({ categoryName: category.categoryName })
    setErrors({})
    setSubmitError('')
    setShowModal(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.categoryId}`, formData)
      } else {
        await api.post('/categories', formData)
      }

      setShowModal(false)
      resetForm()
      fetchCategories()
    } catch (error) {
      setSubmitError(error?.response?.data?.message || 'Unable to save category.')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      await api.delete(`/categories/${deleteTarget.categoryId}`)
      setDeleteTarget(null)
      fetchCategories()
    } catch (error) {
      setSubmitError(error?.response?.data?.message || 'Unable to delete category.')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Categories"
            description="Create, update, search, and manage library categories."
            action={
              <Button onClick={openCreateModal}>
                <Plus size={16} className="mr-2" />
                Add Category
              </Button>
            }
          />

          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-500"
                placeholder="Search categories"
              />
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <Filter size={16} />
              <span>Search + manage</span>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Category Name</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="2" className="px-4 py-8 text-center text-slate-500">Loading categories...</td>
                  </tr>
                ) : paginatedCategories.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="px-4 py-8 text-center text-slate-500">No categories found.</td>
                  </tr>
                ) : (
                  paginatedCategories.map((category) => (
                    <tr key={category.categoryId} className="border-t border-slate-200">
                      <td className="px-4 py-3 font-medium text-slate-900">{category.categoryName}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditModal(category)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => setDeleteTarget(category)} className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">Showing {paginatedCategories.length} of {filteredCategories.length} categories</p>
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
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
                <p className="mt-1 text-sm text-slate-500">{editingCategory ? 'Update the category name.' : 'Create a new category for the catalog.'}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-sm text-slate-500">Close</button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Category Name</label>
                <input value={formData.categoryName} onChange={(event) => setFormData({ ...formData, categoryName: event.target.value })} className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none ${errors.categoryName ? 'border-red-400' : 'border-slate-200'}`} />
                {errors.categoryName ? <p className="mt-2 text-sm text-red-500">{errors.categoryName}</p> : null}
              </div>

              {submitError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{submitError}</div>
              ) : null}

              <div className="flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit">{editingCategory ? 'Save Changes' : 'Create Category'}</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-slate-900">Delete category?</h3>
            <p className="mt-3 text-sm text-slate-600">This will remove <span className="font-semibold">{deleteTarget.categoryName}</span> from the catalog.</p>
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

export default CategoriesPage

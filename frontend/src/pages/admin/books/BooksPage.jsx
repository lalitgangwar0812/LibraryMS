import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Trash2, Pencil, Filter } from 'lucide-react'
import AdminLayout from '../../../components/layout/AdminLayout'
import SectionHeader from '../../../components/layout/SectionHeader'
import { Button } from '../../../components/ui/button'
import api from '../../../components/common/api'
import { useAuth } from '../../../components/common/AuthContext'

const PAGE_SIZE = 6

function BooksPage() {
  const { user } = useAuth()
  const isLibrarian = user?.role?.toUpperCase() === 'LIBRARIAN'
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    categoryId: '',
    quantity: '',
    shelfNo: '',
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const response = await api.get('/books')
      setBooks(response.data)
    } catch (error) {
      console.error('Failed to fetch books', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get(isLibrarian ? '/books/categories' : '/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to fetch categories', error)
    }
  }

  useEffect(() => {
    fetchBooks()
    fetchCategories()
  }, [isLibrarian])

  const filteredBooks = useMemo(() => {
    const query = search.toLowerCase()
    return books.filter((book) => {
      const matchesSearch = !query || [book.title, book.author, book.isbn, book.categoryName].join(' ').toLowerCase().includes(query)
      const matchesCategory = !selectedCategory || String(book.categoryId) === String(selectedCategory)
      return matchesSearch && matchesCategory
    })
  }, [books, search, selectedCategory])

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE))
  const paginatedBooks = filteredBooks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [search, selectedCategory])

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      categoryId: '',
      quantity: '',
      shelfNo: '',
    })
    setErrors({})
    setSubmitError('')
  }

  const validate = () => {
    const nextErrors = {}

    if (!formData.title.trim()) nextErrors.title = 'Title is required.'
    if (!formData.author.trim()) nextErrors.author = 'Author is required.'
    if (!formData.isbn.trim()) nextErrors.isbn = 'ISBN is required.'
    if (!formData.categoryId) nextErrors.categoryId = 'Category is required.'
    if (!formData.quantity || Number(formData.quantity) < 1) nextErrors.quantity = 'Quantity must be at least 1.'
    if (!formData.shelfNo.trim()) nextErrors.shelfNo = 'Shelf number is required.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const openCreateModal = () => {
    resetForm()
    setEditingBook(null)
    setShowModal(true)
  }

  const openEditModal = (book) => {
    setEditingBook(book)
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      categoryId: book.categoryId,
      quantity: book.quantity,
      shelfNo: book.shelfNo,
    })
    setErrors({})
    setSubmitError('')
    setShowModal(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    try {
      const payload = {
        ...formData,
        quantity: Number(formData.quantity),
        categoryId: Number(formData.categoryId),
      }

      if (editingBook) {
        await api.put(`/books/${editingBook.bookId}`, payload)
      } else {
        await api.post('/books', payload)
      }

      setShowModal(false)
      resetForm()
      fetchBooks()
    } catch (error) {
      setSubmitError(error?.response?.data?.message || 'Unable to save book.')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      await api.delete(`/books/${deleteTarget.bookId}`)
      setDeleteTarget(null)
      fetchBooks()
    } catch (error) {
      console.error('Failed to delete book', error)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Books"
            description="Manage the catalog, search books, and keep inventory up to date."
            action={
              <Button onClick={openCreateModal}>
                <Plus size={16} className="mr-2" />
                Add Book
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
                placeholder="Search title, author, or ISBN"
              />
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <Filter size={16} />
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="bg-transparent outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Author</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Shelf</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                      Loading books...
                    </td>
                  </tr>
                ) : paginatedBooks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                      No books found.
                    </td>
                  </tr>
                ) : (
                  paginatedBooks.map((book) => (
                    <tr key={book.bookId} className={`border-t border-slate-200 ${book.quantity <= 2 ? 'bg-amber-50/60' : ''}`}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{book.title}</p>
                        <p className="text-xs text-slate-500">ISBN: {book.isbn}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{book.author}</td>
                      <td className="px-4 py-3 text-slate-600">{book.categoryName}</td>
                      <td className="px-4 py-3 text-slate-600"><div className="flex items-center gap-2"><span>{book.availableQuantity}/{book.quantity}</span>{book.quantity <= 2 ? <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">Low Stock</span> : null}</div></td>
                      <td className="px-4 py-3 text-slate-600">{book.shelfNo}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditModal(book)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50">
                            <Pencil size={16} />
                          </button>
                          {!isLibrarian ? <button onClick={() => setDeleteTarget(book)} className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50">
                            <Trash2 size={16} />
                          </button> : null}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing {paginatedBooks.length} of {filteredBooks.length} books
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
                Previous
              </Button>
              <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{editingBook ? 'Edit Book' : 'Add Book'}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {editingBook ? 'Update book details and inventory.' : 'Create a new book record for the library catalog.'}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-sm text-slate-500">Close</button>
            </div>

            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit} noValidate>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
                <input value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none ${errors.title ? 'border-red-400' : 'border-slate-200'}`} />
                {errors.title ? <p className="mt-2 text-sm text-red-500">{errors.title}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Author</label>
                <input value={formData.author} onChange={(event) => setFormData({ ...formData, author: event.target.value })} className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none ${errors.author ? 'border-red-400' : 'border-slate-200'}`} />
                {errors.author ? <p className="mt-2 text-sm text-red-500">{errors.author}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">ISBN</label>
                <input value={formData.isbn} onChange={(event) => setFormData({ ...formData, isbn: event.target.value })} className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none ${errors.isbn ? 'border-red-400' : 'border-slate-200'}`} />
                {errors.isbn ? <p className="mt-2 text-sm text-red-500">{errors.isbn}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
                <select value={formData.categoryId} onChange={(event) => setFormData({ ...formData, categoryId: event.target.value })} className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none ${errors.categoryId ? 'border-red-400' : 'border-slate-200'}`}>
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
                {errors.categoryId ? <p className="mt-2 text-sm text-red-500">{errors.categoryId}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Quantity</label>
                <input type="number" min="1" value={formData.quantity} onChange={(event) => setFormData({ ...formData, quantity: event.target.value })} className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none ${errors.quantity ? 'border-red-400' : 'border-slate-200'}`} />
                {errors.quantity ? <p className="mt-2 text-sm text-red-500">{errors.quantity}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Shelf Number</label>
                <input value={formData.shelfNo} onChange={(event) => setFormData({ ...formData, shelfNo: event.target.value })} className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none ${errors.shelfNo ? 'border-red-400' : 'border-slate-200'}`} />
                {errors.shelfNo ? <p className="mt-2 text-sm text-red-500">{errors.shelfNo}</p> : null}
              </div>

              {submitError ? (
                <div className="md:col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {submitError}
                </div>
              ) : null}

              <div className="md:col-span-2 flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingBook ? 'Save Changes' : 'Create Book'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {!isLibrarian && deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-slate-900">Delete book?</h3>
            <p className="mt-3 text-sm text-slate-600">
              This will permanently remove <span className="font-semibold">{deleteTarget.title}</span> from the catalog.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  )
}

export default BooksPage

import { useEffect, useMemo, useState } from 'react'
import { Filter, Search, Eye } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import SectionHeader from '../../components/layout/SectionHeader'
import { Button } from '../../components/ui/button'
import api from '../../components/common/api'

function StudentBooksPage() {
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [titleQuery, setTitleQuery] = useState('')
  const [authorQuery, setAuthorQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBook, setSelectedBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [booksResponse, categoriesResponse] = await Promise.all([
          api.get('/books'),
          api.get('/categories'),
        ])

        setBooks(booksResponse.data || [])
        setCategories(categoriesResponse.data || [])
      } catch (requestError) {
        setError(requestError?.response?.data?.message || 'Unable to load books.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredBooks = useMemo(() => {
    const normalizedTitle = titleQuery.toLowerCase()
    const normalizedAuthor = authorQuery.toLowerCase()

    return books.filter((book) => {
      const matchesTitle = !normalizedTitle || book.title.toLowerCase().includes(normalizedTitle)
      const matchesAuthor = !normalizedAuthor || book.author.toLowerCase().includes(normalizedAuthor)
      const matchesCategory = !selectedCategory || String(book.categoryId) === String(selectedCategory)
      return matchesTitle && matchesAuthor && matchesCategory
    })
  }, [authorQuery, books, selectedCategory, titleQuery])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Browse Books"
            description="Search the catalog and view available books without changing inventory."
          />

          {error ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          <div className="grid gap-4 lg:grid-cols-[1fr_1fr_220px]">
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={titleQuery}
                onChange={(event) => setTitleQuery(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-500"
                placeholder="Search by title"
              />
            </div>
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={authorQuery}
                onChange={(event) => setAuthorQuery(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-500"
                placeholder="Search by author"
              />
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <Filter size={16} />
              <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="w-full bg-transparent outline-none">
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>{category.categoryName}</option>
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
                  <th className="px-4 py-3">Available</th>
                  <th className="px-4 py-3">Shelf</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-500">Loading books...</td></tr>
                ) : filteredBooks.length === 0 ? (
                  <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-500">No books match your filters.</td></tr>
                ) : (
                  filteredBooks.map((book) => (
                    <tr key={book.bookId} className="border-t border-slate-200">
                      <td className="px-4 py-3 font-medium text-slate-900">{book.title}</td>
                      <td className="px-4 py-3 text-slate-600">{book.author}</td>
                      <td className="px-4 py-3 text-slate-600">{book.categoryName}</td>
                      <td className="px-4 py-3 text-slate-600">{book.availableQuantity}</td>
                      <td className="px-4 py-3 text-slate-600">{book.shelfNo}</td>
                      <td className="px-4 py-3">
                        <Button variant="outline" size="sm" onClick={() => setSelectedBook(book)}>
                          <Eye size={14} className="mr-2" />View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedBook ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{selectedBook.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{selectedBook.author}</p>
              </div>
              <button onClick={() => setSelectedBook(null)} className="text-sm text-slate-500">Close</button>
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-700">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p><span className="font-semibold text-slate-900">Category:</span> {selectedBook.categoryName}</p>
                <p className="mt-2"><span className="font-semibold text-slate-900">Available Quantity:</span> {selectedBook.availableQuantity}</p>
                <p className="mt-2"><span className="font-semibold text-slate-900">Shelf Number:</span> {selectedBook.shelfNo}</p>
                <p className="mt-2"><span className="font-semibold text-slate-900">ISBN:</span> {selectedBook.isbn}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  )
}

export default StudentBooksPage

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import AdminLayout from '../../../components/layout/AdminLayout'
import SectionHeader from '../../../components/layout/SectionHeader'
import { Button } from '../../../components/ui/button'
import api from '../../../components/common/api'

const emptyForm = { fullName: '', email: '', phoneNumber: '', password: '', confirmPassword: '' }
const messageFor = (error, fallback) => error?.response?.data?.message || fallback

function LibrariansPage() {
  const [librarians, setLibrarians] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingLibrarian, setEditingLibrarian] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const fetchLibrarians = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await api.get('/admin/librarians', { params: { search: search || undefined, page, size: 8 } })
      setLibrarians(response.data.content || [])
      setTotalPages(Math.max(response.data.totalPages || 1, 1))
      setTotalElements(response.data.totalElements || 0)
    } catch (requestError) {
      setError(messageFor(requestError, 'Unable to load librarians.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(fetchLibrarians, 250)
    return () => clearTimeout(timeout)
  }, [search, page])

  useEffect(() => {
    if (searchParams.get('create') === '1') {
      openCreateForm()
      navigate('/admin/librarians', { replace: true })
    }
  }, [searchParams, navigate])

  const openCreateForm = () => {
    setEditingLibrarian(null)
    setFormData(emptyForm)
    setFormError('')
    setShowForm(true)
  }

  const openEditForm = (librarian) => {
    setEditingLibrarian(librarian)
    setFormData({ fullName: librarian.fullName, email: librarian.email, phoneNumber: librarian.phoneNumber, password: '', confirmPassword: '' })
    setFormError('')
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingLibrarian(null)
    setFormError('')
  }

  const validate = () => {
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phoneNumber.trim()) return 'Name, email, and phone number are required.'
    if (!editingLibrarian && !formData.password) return 'Password is required.'
    if (formData.password && formData.password.length < 8) return 'Password must be at least 8 characters.'
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match.'
    return ''
  }

  const saveLibrarian = async (event) => {
    event.preventDefault()
    const validationError = validate()
    if (validationError) {
      setFormError(validationError)
      return
    }
    try {
      setSubmitting(true)
      const payload = { fullName: formData.fullName.trim(), email: formData.email.trim(), phoneNumber: formData.phoneNumber.trim() }
      if (formData.password) {
        payload.password = formData.password
        payload.confirmPassword = formData.confirmPassword
      }
      if (editingLibrarian) await api.put(`/admin/librarians/${editingLibrarian.id}`, payload)
      else await api.post('/admin/librarians', payload)
      setSuccess(editingLibrarian ? 'Librarian updated successfully.' : 'Librarian created successfully.')
      closeForm()
      fetchLibrarians()
    } catch (requestError) {
      setFormError(messageFor(requestError, 'Unable to save librarian.'))
    } finally {
      setSubmitting(false)
    }
  }

  const changeStatus = async (librarian) => {
    try {
      await api.patch(`/admin/librarians/${librarian.id}/status`, { enabled: !librarian.enabled })
      setSuccess(`${librarian.fullName} has been ${librarian.enabled ? 'disabled' : 'enabled'}.`)
      fetchLibrarians()
    } catch (requestError) {
      setError(messageFor(requestError, 'Unable to update librarian status.'))
    }
  }

  const deleteLibrarian = async () => {
    if (!deleteTarget) return
    try {
      setSubmitting(true)
      await api.delete(`/admin/librarians/${deleteTarget.id}`)
      setSuccess(`${deleteTarget.fullName} has been deleted.`)
      setDeleteTarget(null)
      if (librarians.length === 1 && page > 0) setPage((value) => value - 1)
      else fetchLibrarians()
    } catch (requestError) {
      setError(messageFor(requestError, 'Unable to delete librarian.'))
      setDeleteTarget(null)
    } finally {
      setSubmitting(false)
    }
  }

  return <AdminLayout><div className="space-y-6">
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <SectionHeader title="Librarians" description="Create, update, and manage librarian access." action={<Button onClick={openCreateForm}><Plus size={16} /> Add Librarian</Button>} />
      {success ? <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div> : null}
      {error ? <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      <div className="relative mt-6 max-w-md"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(0) }} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-500" placeholder="Search name or email" /></div>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="px-4 py-3">Librarian</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead><tbody>
        {loading ? <tr><td colSpan="4" className="px-4 py-10 text-center text-slate-500">Loading librarians...</td></tr> : null}
        {!loading && !librarians.length ? <tr><td colSpan="4" className="px-4 py-10 text-center text-slate-500">No librarians found. Add the first librarian to get started.</td></tr> : null}
        {!loading && librarians.map((librarian) => <tr key={librarian.id} className="border-t border-slate-200"><td className="px-4 py-3"><p className="font-medium text-slate-900">{librarian.fullName}</p><p className="text-xs text-slate-500">{librarian.email}</p></td><td className="px-4 py-3 text-slate-600">{librarian.phoneNumber}</td><td className="px-4 py-3"><button onClick={() => changeStatus(librarian)} className={`rounded-full px-2.5 py-1 text-xs font-medium ${librarian.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>{librarian.enabled ? 'Enabled' : 'Disabled'}</button></td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => openEditForm(librarian)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50" aria-label={`Edit ${librarian.fullName}`}><Pencil size={16} /></button><button onClick={() => setDeleteTarget(librarian)} className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50" aria-label={`Delete ${librarian.fullName}`}><Trash2 size={16} /></button></div></td></tr>)}
      </tbody></table></div>
      <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>Showing {librarians.length} of {totalElements} librarians</span><div className="flex items-center gap-2"><Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((value) => value - 1)}>Previous</Button><span>Page {page + 1} of {totalPages}</span><Button variant="outline" size="sm" disabled={page + 1 >= totalPages} onClick={() => setPage((value) => value + 1)}>Next</Button></div></div>
    </div>
  </div>
  {showForm ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4"><div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><h3 className="text-xl font-semibold text-slate-900">{editingLibrarian ? 'Edit Librarian' : 'Add Librarian'}</h3><p className="mt-1 text-sm text-slate-500">Librarian access is assigned automatically.</p></div><button onClick={closeForm} className="text-sm text-slate-500">Close</button></div><form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={saveLibrarian} noValidate><label className="md:col-span-2 text-sm font-medium text-slate-700">Name<input value={formData.fullName} onChange={(event) => setFormData({ ...formData, fullName: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /></label><label className="text-sm font-medium text-slate-700">Email<input type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /></label><label className="text-sm font-medium text-slate-700">Phone Number<input value={formData.phoneNumber} onChange={(event) => setFormData({ ...formData, phoneNumber: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /></label><label className="text-sm font-medium text-slate-700">{editingLibrarian ? 'New Password (optional)' : 'Password'}<input type="password" value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /></label><label className="text-sm font-medium text-slate-700">Confirm Password<input type="password" value={formData.confirmPassword} onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /></label>{formError ? <p className="md:col-span-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p> : null}<div className="md:col-span-2 flex justify-end gap-3"><Button type="button" variant="outline" onClick={closeForm}>Cancel</Button><Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : editingLibrarian ? 'Save Changes' : 'Create Librarian'}</Button></div></form></div></div> : null}
  {deleteTarget ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4"><div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"><h3 className="text-xl font-semibold text-slate-900">Delete librarian?</h3><p className="mt-3 text-sm text-slate-600">This permanently removes <strong>{deleteTarget.fullName}</strong>. Associated records will prevent deletion.</p><div className="mt-6 flex justify-end gap-3"><Button variant="outline" disabled={submitting} onClick={() => setDeleteTarget(null)}>Cancel</Button><Button variant="destructive" disabled={submitting} onClick={deleteLibrarian}>{submitting ? 'Deleting...' : 'Delete'}</Button></div></div></div> : null}
  </AdminLayout>
}

export default LibrariansPage

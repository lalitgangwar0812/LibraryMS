import { useEffect, useMemo, useState } from 'react'
import { Eye, Search, MessageSquare } from 'lucide-react'
import AdminLayout from '../../../components/layout/AdminLayout'
import SectionHeader from '../../../components/layout/SectionHeader'
import { Button } from '../../../components/ui/button'
import api from '../../../components/common/api'
import { PAGE_SIZE } from '../../../constants/pagination'

const statusOptions = [
  { value: '', label: 'All statuses' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'CLOSED', label: 'Closed' },
]

const statusStyles = {
  OPEN: 'bg-amber-100 text-amber-700',
  IN_PROGRESS: 'bg-sky-100 text-sky-700',
  CLOSED: 'bg-emerald-100 text-emerald-700',
}

function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedEnquiry, setSelectedEnquiry] = useState(null)
  const [updatedStatus, setUpdatedStatus] = useState('')
  const [savingStatus, setSavingStatus] = useState(false)
  const [page, setPage] = useState(1)

  const fetchEnquiries = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await api.get('/enquiries')
      setEnquiries(response.data || [])
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to load enquiries.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const selectedStatusLabel = (value) => statusOptions.find((option) => option.value === value)?.label || value

  const openEnquiry = (enquiry) => {
    setSelectedEnquiry(enquiry)
    setUpdatedStatus(enquiry.status)
  }

  const closeEnquiry = () => {
    setSelectedEnquiry(null)
    setUpdatedStatus('')
    setSavingStatus(false)
  }

  const updateEnquiryStatus = async () => {
    if (!selectedEnquiry || !updatedStatus) return

    try {
      setSavingStatus(true)
      await api.put(`/enquiries/${selectedEnquiry.enquiryId}/status`, null, {
        params: { status: updatedStatus },
      })
      setSuccess('Enquiry status updated successfully.')
      await fetchEnquiries()
      setSelectedEnquiry((current) => (current ? { ...current, status: updatedStatus } : current))
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to update enquiry status.')
    } finally {
      setSavingStatus(false)
    }
  }

  const filteredEnquiries = useMemo(() => {
    const query = search.trim().toLowerCase()
    return enquiries.filter((enquiry) => {
      const matchesStatus = !status || enquiry.status === status
      const matchesSearch =
        !query ||
        (enquiry.subject || '').toLowerCase().includes(query) ||
        (enquiry.userName || '').toLowerCase().includes(query)
      return matchesStatus && matchesSearch
    })
  }, [enquiries, search, status])

  const enquiryCount = filteredEnquiries.length

  const totalPages = Math.max(1, Math.ceil(enquiryCount / PAGE_SIZE))
  const enquiryRows = useMemo(() => filteredEnquiries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filteredEnquiries, page])

  useEffect(() => {
    setPage(1)
  }, [search, status])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Enquiries"
            description="Review and manage library enquiries from students."
          />

          {success ? (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          ) : null}

          {error ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 lg:max-w-md">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-500"
                placeholder="Search subject or student name"
              />
            </div>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full max-w-xs rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
            >
              {statusOptions.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-10 text-center text-slate-500">
                      Loading enquiries...
                    </td>
                  </tr>
                ) : enquiryRows.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-10 text-center text-slate-500">
                      No enquiries found.
                    </td>
                  </tr>
                ) : (
                  enquiryRows.map((enquiry) => (
                    <tr key={enquiry.enquiryId} className="border-t border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{enquiry.userName}</td>
                      <td className="px-4 py-3 text-slate-600">{enquiry.subject}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[enquiry.status] || 'bg-slate-100 text-slate-700'}`}>
                          {selectedStatusLabel(enquiry.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{enquiry.createdAt?.replace('T', ' ')}</td>
                      <td className="px-4 py-3">
                        <Button variant="outline" size="sm" onClick={() => openEnquiry(enquiry)}>
                          <Eye size={14} /> View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>Showing {enquiryRows.length} of {enquiryCount} enquiry{enquiryCount === 1 ? '' : 's'}.</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</Button>
              <span>Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((value) => value + 1)}>Next</Button>
            </div>
          </div>
        </div>
      </div>

      {selectedEnquiry ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-8">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                  <MessageSquare size={16} /> Enquiry details
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">{selectedEnquiry.subject}</h2>
                <p className="mt-1 text-sm text-slate-600">Submitted by {selectedEnquiry.userName} on {selectedEnquiry.createdAt?.replace('T', ' ')}</p>
              </div>
              <button className="text-sm text-slate-500" onClick={closeEnquiry}>Close</button>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-600">Current status</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{selectedStatusLabel(selectedEnquiry.status)}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-600">Update status</p>
                <select
                  value={updatedStatus}
                  onChange={(event) => setUpdatedStatus(event.target.value)}
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                >
                  <option value="">Select status</option>
                  {statusOptions.filter((item) => item.value).map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
                <div className="mt-4 flex items-center gap-3">
                  <Button
                    onClick={updateEnquiryStatus}
                    disabled={savingStatus || !updatedStatus || updatedStatus === selectedEnquiry.status}
                  >
                    {savingStatus ? 'Saving...' : 'Save status'}
                  </Button>
                  <Button variant="outline" onClick={closeEnquiry}>Cancel</Button>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-600">Message</p>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{selectedEnquiry.message}</p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-600">Enquiry ID</p>
                <p className="mt-2 text-sm text-slate-900">#{selectedEnquiry.enquiryId}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-600">Student</p>
                <p className="mt-2 text-sm text-slate-900">{selectedEnquiry.userName}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  )
}

export default EnquiriesPage

import { useAuth } from '../../components/common/AuthContext'

function AdminDashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Admin Dashboard</h1>
        <p className="mt-3 text-lg text-slate-600">
          Placeholder page for admin users. Routing is working for the admin role.
        </p>
        <div className="mt-8 rounded-2xl bg-slate-50 p-6 text-sm text-slate-700">
          <p><span className="font-semibold">Signed in as:</span> {user?.email || 'Unknown'}</p>
          <p className="mt-2"><span className="font-semibold">Role:</span> {user?.role || 'Unknown'}</p>
        </div>
        <button
          onClick={logout}
          className="mt-8 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default AdminDashboardPage

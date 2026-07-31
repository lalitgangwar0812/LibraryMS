import AdminLayout from '../../../components/layout/AdminLayout'
import SectionHeader from '../../../components/layout/SectionHeader'

function SettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Settings"
            description="Adjust administration preferences and platform settings."
          />
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-900">Settings module coming soon.</h3>
            <p className="mt-3 text-sm text-slate-600">This area will host configuration controls for the admin panel.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default SettingsPage

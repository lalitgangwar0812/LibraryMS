import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="h-dvh overflow-hidden bg-slate-50 text-slate-900">
      <div className="flex h-full">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col lg:ml-72">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="lms-page-enter mx-auto w-full max-w-[1600px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout

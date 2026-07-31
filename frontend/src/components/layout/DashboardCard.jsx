function DashboardCard({ title, value, subtitle, icon, accent = 'sky' }) {
  const accentClasses = {
    sky: 'bg-sky-50 text-sky-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    violet: 'bg-violet-50 text-violet-600',
    amber: 'bg-amber-50 text-amber-600',
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${accentClasses[accent] || accentClasses.sky}`}>
          {icon}
        </div>
      </div>
      {subtitle ? <p className="mt-4 text-sm text-slate-500">{subtitle}</p> : null}
    </div>
  )
}

export default DashboardCard

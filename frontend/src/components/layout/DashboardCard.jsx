import { useEffect, useState } from 'react'

function AnimatedValue({ value }) {
  const numericValue = Number(value)
  const [displayValue, setDisplayValue] = useState(Number.isFinite(numericValue) ? 0 : value)

  useEffect(() => {
    const start = performance.now()
    let frame
    const tick = (now) => {
      if (!Number.isFinite(numericValue)) {
        setDisplayValue(value)
        return
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setDisplayValue(numericValue)
        return
      }
      const progress = Math.min((now - start) / 420, 1)
      setDisplayValue(Math.round(numericValue * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [numericValue, value])

  return typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue
}

function DashboardCard({ title, value, subtitle, icon, accent = 'sky' }) {
  const accentClasses = {
    sky: 'bg-sky-50 text-sky-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    violet: 'bg-violet-50 text-violet-600',
    amber: 'bg-amber-50 text-amber-600',
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900"><AnimatedValue value={value} /></p>
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

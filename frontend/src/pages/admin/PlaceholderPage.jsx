import { Sparkles } from 'lucide-react'

function PlaceholderPage({ title, message }) {
  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600">
        <Sparkles size={20} />
      </div>
      <h4 className="mt-4 text-lg font-semibold text-slate-900">{title}</h4>
      <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">{message}</p>
    </div>
  )
}

export default PlaceholderPage

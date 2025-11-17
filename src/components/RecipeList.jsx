import { useEffect, useState } from 'react'

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function RecipeList({ onSelect }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${apiBase}/api/recipes`)
      const data = await res.json()
      const list = data.items || []
      setItems(list)
    } catch (e) {
      setError('Failed to load recipes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = items.filter(r => r.title.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="sticky top-0 bg-slate-900/80 backdrop-blur z-10 -mx-4 px-4 pt-2 pb-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes..."
          className="w-full rounded-lg bg-slate-800 text-slate-100 placeholder-slate-400 px-4 py-3 border border-slate-700 focus:outline-none focus:border-blue-500"
        />
      </div>

      {loading && <p className="text-slate-300">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      <div className="grid gap-4">
        {filtered.map((r) => (
          <button key={r.id}
            onClick={() => onSelect?.(r)}
            className="text-left bg-slate-800/60 border border-slate-700 hover:border-blue-500/40 rounded-xl p-4 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-slate-700 flex items-center justify-center text-blue-300 font-semibold">
                {r.title.slice(0,1).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-100">{r.title}</p>
                <p className="text-sm text-slate-400 line-clamp-2">{r.description || 'No description'}</p>
                {r.total_nutrition && (
                  <p className="text-xs text-slate-500 mt-1">
                    {Math.round(r.total_nutrition.calories)} kcal • P {Math.round(r.total_nutrition.protein)}g • C {Math.round(r.total_nutrition.carbs)}g • F {Math.round(r.total_nutrition.fat)}g
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
        {(!loading && filtered.length === 0) && (
          <p className="text-slate-400 text-center py-8">No recipes yet. Add one!</p>
        )}
      </div>

      <div className="h-4" />
    </div>
  )
}

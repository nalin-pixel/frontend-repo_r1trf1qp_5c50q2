import { useState } from 'react'
import RecipeList from './components/RecipeList'
import RecipeForm from './components/RecipeForm'
import RecipeDetail from './components/RecipeDetail'

function App() {
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-slate-700 flex items-center justify-center font-bold">R</div>
            <div>
              <h1 className="text-2xl font-semibold">Recipe Tracker</h1>
              <p className="text-slate-400 text-sm">Save recipes and track nutrition</p>
            </div>
          </div>
          <button onClick={() => setShowForm(s=>!s)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
            {showForm ? 'Close' : 'Add Recipe'}
          </button>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            {showForm ? (
              <RecipeForm onCreated={() => { setShowForm(false); window.location.reload() }} />
            ) : (
              <RecipeList onSelect={setSelected} />
            )}
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <RecipeDetail recipe={selected} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

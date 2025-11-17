import { useState } from 'react'

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const emptyIngredient = { name: '', quantity: 0, unit: 'g', nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 } }

export default function RecipeForm({ onCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [servings, setServings] = useState(1)
  const [tags, setTags] = useState('')
  const [ingredients, setIngredients] = useState([ { ...emptyIngredient } ])
  const [instructions, setInstructions] = useState([''])
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addIngredient = () => setIngredients((prev) => [...prev, { ...emptyIngredient }])
  const removeIngredient = (idx) => setIngredients(prev => prev.filter((_,i) => i!==idx))
  const updateIngredient = (idx, key, value) => setIngredients(prev => prev.map((ing,i) => i===idx ? { ...ing, [key]: value } : ing))
  const updateIngredientNutrition = (idx, key, value) => setIngredients(prev => prev.map((ing,i) => i===idx ? { ...ing, nutrition: { ...ing.nutrition, [key]: value } } : ing))

  const addInstruction = () => setInstructions(prev => [...prev, ''])
  const updateInstruction = (idx, value) => setInstructions(prev => prev.map((s,i) => i===idx ? value : s))
  const removeInstruction = (idx) => setInstructions(prev => prev.filter((_,i)=>i!==idx))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        title,
        description,
        servings: Number(servings) || 1,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        ingredients: ingredients.map(ing => ({
          ...ing,
          quantity: Number(ing.quantity) || 0,
          nutrition: {
            calories: Number(ing.nutrition.calories) || 0,
            protein: Number(ing.nutrition.protein) || 0,
            carbs: Number(ing.nutrition.carbs) || 0,
            fat: Number(ing.nutrition.fat) || 0,
          }
        })),
        instructions: instructions.filter(Boolean),
        image_url: imageUrl || undefined,
      }
      const res = await fetch(`${apiBase}/api/recipes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to create')
      const data = await res.json()
      onCreated?.(data)
      // reset
      setTitle(''); setDescription(''); setServings(1); setTags(''); setIngredients([{...emptyIngredient}]); setInstructions(['']); setImageUrl('')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-400">{error}</p>}
      <div>
        <label className="block text-slate-300 text-sm mb-1">Title</label>
        <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full rounded-lg bg-slate-800 text-slate-100 px-3 py-2 border border-slate-700 focus:border-blue-500 outline-none" required />
      </div>
      <div>
        <label className="block text-slate-300 text-sm mb-1">Description</label>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} className="w-full rounded-lg bg-slate-800 text-slate-100 px-3 py-2 border border-slate-700 focus:border-blue-500 outline-none" rows={2} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-300 text-sm mb-1">Servings</label>
          <input type="number" min={1} value={servings} onChange={e=>setServings(e.target.value)} className="w-full rounded-lg bg-slate-800 text-slate-100 px-3 py-2 border border-slate-700 focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-slate-300 text-sm mb-1">Tags (comma separated)</label>
          <input value={tags} onChange={e=>setTags(e.target.value)} className="w-full rounded-lg bg-slate-800 text-slate-100 px-3 py-2 border border-slate-700 focus:border-blue-500 outline-none" />
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-semibold text-slate-200">Ingredients</p>
        {ingredients.map((ing, idx) => (
          <div key={idx} className="p-3 rounded-lg border border-slate-700 bg-slate-800/50">
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Name" value={ing.name} onChange={e=>updateIngredient(idx,'name',e.target.value)} className="rounded bg-slate-900/60 text-slate-100 px-3 py-2 border border-slate-700 focus:border-blue-500 outline-none" required />
              <div className="grid grid-cols-3 gap-2">
                <input type="number" placeholder="Qty" value={ing.quantity} onChange={e=>updateIngredient(idx,'quantity',e.target.value)} className="rounded bg-slate-900/60 text-slate-100 px-3 py-2 border border-slate-700 focus:border-blue-500 outline-none" />
                <input placeholder="Unit" value={ing.unit} onChange={e=>updateIngredient(idx,'unit',e.target.value)} className="rounded bg-slate-900/60 text-slate-100 px-3 py-2 border border-slate-700 focus:border-blue-500 outline-none" />
                <button type="button" onClick={()=>removeIngredient(idx)} className="rounded bg-red-500/80 hover:bg-red-500 text-white text-sm px-2">Remove</button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {['calories','protein','carbs','fat'].map(key => (
                <div key={key}>
                  <label className="block text-xs text-slate-400 capitalize">{key}</label>
                  <input type="number" value={ing.nutrition[key]} onChange={e=>updateIngredientNutrition(idx,key,e.target.value)} className="w-full rounded bg-slate-900/60 text-slate-100 px-2 py-1 border border-slate-700 focus:border-blue-500 outline-none" />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button type="button" onClick={addIngredient} className="bg-slate-700 hover:bg-slate-600 text-slate-100 px-3 py-2 rounded">Add ingredient</button>
      </div>

      <div className="space-y-2">
        <p className="font-semibold text-slate-200">Instructions</p>
        {instructions.map((step, idx) => (
          <div key={idx} className="flex gap-2">
            <input value={step} onChange={e=>updateInstruction(idx, e.target.value)} placeholder={`Step ${idx+1}`} className="flex-1 rounded bg-slate-900/60 text-slate-100 px-3 py-2 border border-slate-700 focus:border-blue-500 outline-none" />
            <button type="button" onClick={()=>removeInstruction(idx)} className="rounded bg-red-500/80 hover:bg-red-500 text-white text-sm px-2">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addInstruction} className="bg-slate-700 hover:bg-slate-600 text-slate-100 px-3 py-2 rounded">Add step</button>
      </div>

      <div>
        <label className="block text-slate-300 text-sm mb-1">Image URL</label>
        <input value={imageUrl} onChange={e=>setImageUrl(e.target.value)} className="w-full rounded-lg bg-slate-800 text-slate-100 px-3 py-2 border border-slate-700 focus:border-blue-500 outline-none" />
      </div>

      <button disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-semibold py-2 rounded">
        {loading ? 'Saving...' : 'Save Recipe'}
      </button>
    </form>
  )
}

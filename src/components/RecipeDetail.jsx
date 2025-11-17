export default function RecipeDetail({ recipe }) {
  if (!recipe) return (
    <div className="text-slate-400 text-center py-8">Select a recipe to view details</div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-slate-700 flex items-center justify-center text-2xl text-emerald-300 font-bold">
          {recipe.title?.slice(0,1).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-100">{recipe.title}</h2>
          {recipe.description && <p className="text-slate-400">{recipe.description}</p>}
          {recipe.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {recipe.tags.map(t => (
                <span key={t} className="text-xs bg-slate-800 text-slate-300 border border-slate-700 rounded px-2 py-1">{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {recipe.total_nutrition && (
        <div className="grid grid-cols-4 gap-2">
          {[
            ['Calories', Math.round(recipe.total_nutrition.calories)],
            ['Protein', `${Math.round(recipe.total_nutrition.protein)} g`],
            ['Carbs', `${Math.round(recipe.total_nutrition.carbs)} g`],
            ['Fat', `${Math.round(recipe.total_nutrition.fat)} g`],
          ].map(([label, val]) => (
            <div key={label} className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
              <p className="text-xs text-slate-400">{label}</p>
              <p className="text-slate-100 font-semibold">{val}</p>
            </div>
          ))}
        </div>
      )}

      <div>
        <h3 className="text-slate-200 font-semibold mb-2">Ingredients</h3>
        <ul className="list-disc list-inside space-y-1 text-slate-300">
          {recipe.ingredients?.map((ing, i) => (
            <li key={i}>{ing.quantity} {ing.unit} {ing.name}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-slate-200 font-semibold mb-2">Instructions</h3>
        <ol className="list-decimal list-inside space-y-1 text-slate-300">
          {recipe.instructions?.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}

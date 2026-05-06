import { useState } from 'react'
import {useRecipes} from '../hooks/useRecipe'
import RecipeCard from './RecipeCard'
import RecipeForm from './RecipeForm'

const CATEGORIES =['todas','desayuno','comida','cena','postre','snack','bebida']

export default function RecipeBoard() {
  const {recipe, loading, error, createRecipe, updateRecipe, deleteRecipe} = useRecipes()
  const [activeCategory, setActiveCategory] = useState('todas')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const filtered = useRecipes.filter(r => {
    const matchCat = activeCategory === 'todas' || r.category === activeCategory
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })
  async function handleSubmit(data) {
    if (editing){
      await updateRecipe(editing._id, data)
      setEditing(null)
    } else {
      await createRecipe(data)
    }
    setShowForm(false)
  } 
  if (loading) return <p> Cargando recetas... </p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <header>
        <h1>Mi recetario</h1>
        <button onClick={() => setShowForm(true)}>+ Nueva receta</button>
      </header>
      <div className='filters'>
        {CATEGORIES.map(cat => (
          <button 
            key={cat} 
            className={activeCategory === cat ? 'active' : ''}
            onClick={() => setActiveCategory(cat)}>
          {cat}
          </button>
        ))}
        <input 
          placeholder='Buscar...'
          value={search}
          onChange={e => setSearch(e.target.value)}/>
      </div>
      <div className='grid'>
        {filtered.map(recipe => (
          <RecipeCard
          key={recipe._id}
          recipe={recipe}
          onEdit={()=> {setEditing(recipe); setShowForm(true)}}
          onDelete={() => deleteRecipe(recipe._id)}
            />
        ))}
      </div>
      {showForm && (
        <RecipeForm
        defaultValues={editing}
        onSubmit={handleSubmit}
        onCancel={()=> {setShowForm(false); setEditing(null)}}/>
      )}
    </div>
  )
}
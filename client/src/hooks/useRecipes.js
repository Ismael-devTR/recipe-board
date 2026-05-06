import {useEffect, useState} from  'react'
import axios from 'axios'

export function useRecipes(){
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=> { 
      async function fetchAll() {
    try{
      setLoading(true)
      const {data} = await axios.get('http://localhost:3001/api/recipes')
      setRecipes(data)
      setLoading(false)
    } catch (_e){
      setError('Error cargando recetas'+ _e)
    }
    
  }
    
    fetchAll()
  }, [])


  async function createRecipe(formData){
    const {data} = await axios.post('/api/recipes', formData)
    setRecipes(prev =>[data, ...prev] )
  }
  async function updateRecipe(id, formData) {
    const {data} = await axios.put(`/api/recipes/${id}`, formData)
    setRecipes(prev => prev.map(r => r._id === id ? data : r))
  }
  async function deleteRecipe(id) {
    await axios.delete(`/api/recipes/${id}`)
    setRecipes(prev => prev.filter(r => r._id !== id))
  }
  return {recipes, loading, error, createRecipe, updateRecipe, deleteRecipe }
}
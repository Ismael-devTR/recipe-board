import express from 'express'
import Recipe from '../models/Recipe.js'

const router =  express.Router()

router.get('/', async(req, res) => {
  let recipes = (await Recipe.find())
  res.json(recipes)
})
router.post('/', async(req, res) =>{
  try{
    const recipe =  await Recipe.create(req.doby)
    res.status(201).json(recipe)
  } catch (e){
    res.status(400).json({error: e.message})
  }
})
router.put('/:id', async(req, res) => {
  const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true })
  recipe ? res.json(recipe) : res.status(404).json({error: 'Not found'})
})
router.delete('/:id', async(req, res)=> {
  await Recipe.findByIdAndDelete(req.params.id)
  res.status(204).end()
})
export default router
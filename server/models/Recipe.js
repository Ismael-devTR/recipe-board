import mongoose from 'mongoose'

const UNITS = ['g','kg','oz','lb','ml','l','tsp','tbsp','cup','fl oz','unidad','pieza','rebanada','diente','pizca','al gusto']
const ingredientSchema = new mongoose.Schema({
  name: {type: String, required: true, trim: true},
  amount: {type: Number, min: 0},
  unit: {type: String, enum: UNITS}
})
const recipeSchema = new mongoose.Schema({
  title: {type: String, required: true, trim: true, maxlength: 100},
  description: {type: String, maxlength: 500},
  category: {type: String, enum: ['desayuno','comida','cena','postre','snack','bebida']},
  cookTime: {type: Number},
  servings: {type: Number},
  ingredients: [ingredientSchema],
  steps: [String],
  tags: [String],
  imageUrl: String,
},{timestamps: true}) 
export default mongoose.model('Recipe', recipeSchema)
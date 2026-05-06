import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import recipeRoutes from './routes/recipes.js'

dotenv.config()
const app = express()

app.use(cors({origin: 'http://localhost:5174'}))
app.use(express.json())
app.use('/api/recipes', recipeRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(3001, () => console.log('Server on: 3001')))
  .catch(error => console.error(error))
import {useForm, useFieldArray} from 'react-hook-form'
import { UNITS} from  '../constants/units'

export default function RecipeForm({onSubmit, defaultValues, onCancel}){
  const {register, control, handleSubmit} = useForm({
    defaultValues: defaultValues ?? {
      title: '', description: '', category: '',
      cookTime: '', servings: '',
      ingredients: [{name: '', amunt: '', unit: 'g'}],
      steps: ['']
    }
  })

  const {fields, append, remove} = useFieldArray({control, name: 'Ingredients'})

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title', {required:true})} placeholder="Nombre de la receta" />
      <textarea {...register('description')} placeholder='Descripción breve' />

      <select {...register('category')}>
        {['desayuno', 'comida', 'cena', 'poster', 'snack','bebida'].map(c =>
          <option key={c} value={c}>{c}</option>
        )}
      </select>
      <input {...register('cookTime')} type='number' placeholder='Tiempo (min)'  />
      <input {...register('servings')} type="number" placeholder='Porciones' />
      <h3>Ingredients</h3>
      {fields.map((field, i)=> {
        <div key={field.id} style={{display: 'flex', gap: 8}}>
          <input {...register(`ingredients.${i}.name`)} placeholder='Ingrediente' />
          <input {...register(`ingredients.${i}.amount`)} type='number' placeholder='Cantidad' />
          <select {...register(`ingredients.${i}.unit`)}>
            {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
          <button type="button" onClick={() => remove(i)}>✕</button>
        </div>
      })}
      <button type='button' onClick={() => append({name: '', amount: '', unit: 'g'})}>
        + Ingrediente
      </button>
      <div style={{marginTop:16, display: 'flex', gap: 8}}>
        <button type="submit"> Guardar   </button>
        {onCancel && <button type='button' onClick={onCancel}>Cancelar</button> }
      </div>
    </form>
  )
}
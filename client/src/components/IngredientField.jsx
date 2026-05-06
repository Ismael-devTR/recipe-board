const UNITS = ['g','kg','oz','lb','ml','l','tsp','tbsp','cup','fl oz','unidad','pieza','rebanada','diente','pizca','al gusto']

export function IngredientField({index, register, remove}){
  return(
  <div style={{display:flex, gap: 8, marginBottom: 8}}>
    <input {...register(`ingredients.${index}.name`)} placeholder='Ingrediente' />
    <input {...register(`ingredients.${index}.amount`)} type='number' placeholder='Cantidad' />
    <select {...register(`ingredients.${index}.unit`)} >
      {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
    </select>
    <button type='button' onClick={() => remove (index)}>✕</button>
  </div>
  )
}
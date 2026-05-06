import { useState } from 'react'

const CATEGORY_COLORS = {
  desayuno: { bg: '#FAEEDA', text: '#633806' },
  comida:   { bg: '#E1F5EE', text: '#085041' },
  cena:     { bg: '#EEEDFE', text: '#3C3489' },
  postre:   { bg: '#FBEAF0', text: '#72243E' },
  snack:    { bg: '#FAECE7', text: '#712B13' },
  bebida:   { bg: '#E6F1FB', text: '#0C447C' },
}
export default function RecipeCard({ recipe, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const color = CATEGORY_COLORS[recipe.category] ?? { bg: '#F1EFE8', text: '#444441' }

  function handleDelete(e) {
    e.stopPropagation()
    if (confirmDelete) {
      onDelete()
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000) // resetea si no confirma
    }
  }

  function handleEdit(e) {
    e.stopPropagation()
    onEdit()
  }

  return (
    <div style={styles.card} onClick={onEdit}>

      {/* Imagen / emoji */}
      <div style={{ ...styles.imgArea, background: color.bg }}>
        <span style={styles.emoji}>
          {recipe.imageUrl
            ? <img src={recipe.imageUrl} alt={recipe.title} style={styles.img} />
            : CATEGORY_EMOJI[recipe.category] ?? '🍽️'
          }
        </span>
      </div>

      {/* Cuerpo */}
      <div style={styles.body}>

        {/* Título + badge */}
        <div style={styles.topRow}>
          <h3 style={styles.title}>{recipe.title}</h3>
          <span style={{ ...styles.badge, background: color.bg, color: color.text }}>
            {recipe.category}
          </span>
        </div>

        {/* Descripción */}
        {recipe.description && (
          <p style={styles.desc}>{recipe.description}</p>
        )}

        {/* Meta: tiempo, porciones, ingredientes */}
        <div style={styles.meta}>
          {recipe.cookTime && (
            <span style={styles.metaItem}>🕐 {recipe.cookTime} min</span>
          )}
          {recipe.servings && (
            <span style={styles.metaItem}>👥 {recipe.servings} porc.</span>
          )}
          {recipe.ingredients?.length > 0 && (
            <span style={styles.metaItem}>🧺 {recipe.ingredients.length} ingr.</span>
          )}
        </div>
      </div>

      {/* Tags */}
      {recipe.tags?.length > 0 && (
        <div style={styles.footer}>
          {recipe.tags.map(tag => (
            <span key={tag} style={styles.tag}>{tag}</span>
          ))}
        </div>
      )}

      {/* Acciones — aparecen al hacer hover */}
      <div style={styles.actions}>
        <button
          style={styles.actionBtn}
          onClick={handleEdit}
          title="Editar receta"
        >
          ✏️
        </button>
        <button
          style={{
            ...styles.actionBtn,
            background: confirmDelete ? '#FCEBEB' : undefined,
            color: confirmDelete ? '#A32D2D' : undefined,
          }}
          onClick={handleDelete}
          title={confirmDelete ? 'Confirmar eliminación' : 'Eliminar receta'}
        >
          {confirmDelete ? '¿Seguro?' : '🗑️'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  card: {
    position: 'relative',
    background: 'white',
    border: '0.5px solid #e5e3dc',
    borderRadius: 12,
    overflow: 'hidden',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    transition: 'border-color .15s',
  },
  imgArea: {
    height: 110,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 40,
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  body: {
    padding: '12px 14px 10px',
    flex: 1,
  },
  topRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.3,
    margin: 0,
    color: '#1a1a1a',
  },
  badge: {
    fontSize: 11,
    padding: '2px 8px',
    borderRadius: 20,
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  desc: {
    fontSize: 12,
    color: '#6b6b6b',
    lineHeight: 1.5,
    marginBottom: 10,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  meta: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  },
  metaItem: {
    fontSize: 12,
    color: '#6b6b6b',
  },
  footer: {
    borderTop: '0.5px solid #eeece5',
    padding: '8px 14px',
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
  },
  tag: {
    fontSize: 11,
    padding: '2px 7px',
    borderRadius: 20,
    background: '#f1efe8',
    color: '#5f5e5a',
    border: '0.5px solid #e5e3dc',
  },
  actions: {
    position: 'absolute',
    top: 8,
    right: 8,
    display: 'flex',
    gap: 4,
    opacity: 0,
    transition: 'opacity .15s',
  },
  actionBtn: {
    fontSize: 14,
    padding: '4px 8px',
    borderRadius: 8,
    border: '0.5px solid #e5e3dc',
    background: 'white',
    cursor: 'pointer',
    lineHeight: 1,
  },
}
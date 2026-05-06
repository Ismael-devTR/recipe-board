import { useState } from 'react'
import { useRecipes } from './hooks/useRecipes'
import RecipeCard from './components/RecipeCard'
import RecipeForm from './components/RecipeForm'

const CATEGORIES = ['todas', 'desayuno', 'comida', 'cena', 'postre', 'snack', 'bebida']

export default function App() {
  const { recipes, loading, error, createRecipe, updateRecipe, deleteRecipe } = useRecipes()

  const [activeCategory, setActiveCategory] = useState('todas')
  const [search, setSearch]                 = useState('')
  const [showForm, setShowForm]             = useState(false)
  const [editing, setEditing]               = useState(null)

  // Filtrado local
  const filtered = recipes.filter(r => {
    const matchCat    = activeCategory === 'todas' || r.category === activeCategory
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  function openCreate() {
    setEditing(null)
    setShowForm(true)
  }

  function openEdit(recipe) {
    setEditing(recipe)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditing(null)
  }

  async function handleSubmit(data) {
    try {
      if (editing) {
        await updateRecipe(editing._id, data)
      } else {
        await createRecipe(data)
      }
      closeForm()
    } catch (e) {
      alert('Error al guardar la receta. Intenta de nuevo.'+ e)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteRecipe(id)
    } catch (e) {
      alert('Error al eliminar la receta.' + e)
    }
  }

  return (
    <div style={styles.page}>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div>
            <h1 style={styles.title}>Recetario</h1>
            <p style={styles.subtitle}>{recipes.length} recetas guardadas</p>
          </div>
        </div>
        <button style={styles.btnPrimary} onClick={openCreate}>
          + Nueva receta
        </button>
      </header>

      {/* Filtros + búsqueda */}
      <div style={styles.toolbar}>
        <div style={styles.pills}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              style={{
                ...styles.pill,
                ...(activeCategory === cat ? styles.pillActive : {})
              }}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <input
          style={styles.search}
          placeholder="Buscar receta..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Estados: cargando / error / vacío */}
      {loading && (
        <div style={styles.centered}>
          <p style={styles.muted}>Cargando recetas...</p>
        </div>
      )}

      {!loading && error && (
        <div style={styles.centered}>
          <p style={{ color: '#A32D2D' }}>{error}</p>
          <button style={styles.btnSecondary} onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={styles.centered}>
          <p style={styles.muted}>
            {search || activeCategory !== 'todas'
              ? 'No hay recetas con ese filtro.'
              : 'Aún no tienes recetas. ¡Agrega la primera!'}
          </p>
          {!search && activeCategory === 'todas' && (
            <button style={styles.btnSecondary} onClick={openCreate}>
              + Nueva receta
            </button>
          )}
        </div>
      )}

      {/* Grid de tarjetas */}
      {!loading && !error && filtered.length > 0 && (
        <div style={styles.grid}>
          {filtered.map(recipe => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              onEdit={() => openEdit(recipe)}
              onDelete={() => handleDelete(recipe._id)}
            />
          ))}

          {/* Tarjeta de agregar */}
          <div style={styles.addCard} onClick={openCreate}>
            <span style={styles.addIcon}>+</span>
            <span style={styles.addLabel}>Agregar receta</span>
          </div>
        </div>
      )}

      {/* Modal del formulario */}
      {showForm && (
        <div style={styles.overlay} onClick={closeForm}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editing ? 'Editar receta' : 'Nueva receta'}
              </h2>
              <button style={styles.closeBtn} onClick={closeForm}>✕</button>
            </div>
            <div style={styles.modalBody}>
              <RecipeForm
                defaultValues={editing}
                onSubmit={()=> handleSubmit()}
                onCancel={()=> closeForm()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  page: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '0 24px 48px',
    fontFamily: 'system-ui, sans-serif',
  },

  // Header
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px 0 20px',
    borderBottom: '0.5px solid #e5e3dc',
    marginBottom: 20,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logo: { fontSize: 32 },
  title: { fontSize: 20, fontWeight: 500, margin: 0 },
  subtitle: { fontSize: 13, color: '#888', margin: 0 },

  // Toolbar
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  pills: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
    flex: 1,
  },
  pill: {
    fontSize: 12,
    padding: '5px 12px',
    borderRadius: 20,
    border: '0.5px solid #d3d1c7',
    background: 'white',
    color: '#6b6b6b',
    cursor: 'pointer',
    textTransform: 'capitalize',
    transition: 'all .15s',
  },
  pillActive: {
    background: '#EEEDFE',
    borderColor: '#534AB7',
    color: '#3C3489',
  },
  search: {
    fontSize: 13,
    padding: '6px 12px',
    border: '0.5px solid #d3d1c7',
    borderRadius: 8,
    width: 200,
    outline: 'none',
  },

  // Grid
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 14,
  },

  // Add card
  addCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 200,
    border: '0.5px dashed #b4b2a9',
    borderRadius: 12,
    cursor: 'pointer',
    color: '#b4b2a9',
    transition: 'all .15s',
  },
  addIcon:  { fontSize: 28, lineHeight: 1 },
  addLabel: { fontSize: 13 },

  // Estados vacíos
  centered: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    padding: '64px 0',
  },
  muted: { fontSize: 14, color: '#888', margin: 0 },

  // Botones
  btnPrimary: {
    fontSize: 13,
    padding: '8px 16px',
    borderRadius: 8,
    border: '0.5px solid #534AB7',
    background: '#EEEDFE',
    color: '#3C3489',
    cursor: 'pointer',
    fontWeight: 500,
  },
  btnSecondary: {
    fontSize: 13,
    padding: '7px 14px',
    borderRadius: 8,
    border: '0.5px solid #d3d1c7',
    background: 'white',
    color: '#444',
    cursor: 'pointer',
  },

  // Modal
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: 24,
  },
  modal: {
    background: 'white',
    borderRadius: 16,
    width: '100%',
    maxWidth: 560,
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '0.5px solid #e5e3dc',
  },
  modalTitle: { fontSize: 16, fontWeight: 500, margin: 0 },
  closeBtn: {
    fontSize: 14,
    padding: '4px 8px',
    border: '0.5px solid #e5e3dc',
    borderRadius: 8,
    background: 'white',
    cursor: 'pointer',
    color: '#888',
  },
  modalBody: {
    overflowY: 'auto',
    padding: '20px',
    flex: 1,
  },
}
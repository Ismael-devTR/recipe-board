# 🍳 Recipe Board

Un tablero personal para guardar, organizar y consultar recetas de cocina. Construido con React, Node.js y MongoDB.

---

## Tabla de contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Comandos disponibles](#comandos-disponibles)
- [Arquitectura](#arquitectura)
- [API Reference](#api-reference)
- [Modelo de datos](#modelo-de-datos)

---

## Características

- **Board visual** con tarjetas por receta, filtros por categoría y búsqueda en tiempo real
- **Vista de detalle** de cada receta con ingredientes, pasos y metadatos
- **Formulario de creación y edición** con soporte para múltiples unidades de medida
- **Eliminación con confirmación** de doble clic para evitar borrados accidentales
- **Categorías**: desayuno, comida, cena, postre, snack, bebida
- **Unidades soportadas**: gramos, kilogramos, onzas, libras, mililitros, litros, cucharadita, cucharada, taza, pieza, diente, pizca, al gusto

---

## Tecnologías

### Frontend
| Paquete | Versión | Uso |
|---|---|---|
| React | 18+ | UI |
| Vite | 5+ | Bundler y dev server |
| react-hook-form | 7+ | Manejo de formularios |
| axios | 1+ | Peticiones HTTP |

### Backend
| Paquete | Versión | Uso |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express | 4+ | Servidor HTTP |
| Mongoose | 8+ | ODM para MongoDB |
| dotenv | 16+ | Variables de entorno |
| cors | 2+ | Control de acceso HTTP |
| nodemon | 3+ | Hot reload en desarrollo |

### Base de datos
- **MongoDB Atlas** (recomendado) o MongoDB local

---

## Estructura del proyecto

```
recipe-board/
├── client/                         # Frontend React + Vite
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RecipeCard.jsx      # Tarjeta individual del board
│   │   │   ├── RecipeCard.css
│   │   │   ├── RecipeDetail.jsx    # Vista de detalle (solo lectura)
│   │   │   ├── RecipeDetail.css
│   │   │   ├── RecipeForm.jsx      # Formulario crear / editar
│   │   │   └── RecipeForm.css
│   │   ├── constants/
│   │   │   └── units.js            # Lista de unidades de medida
│   │   ├── hooks/
│   │   │   └── useRecipes.js       # Lógica de fetch y CRUD
│   │   ├── App.jsx                 # Componente raíz
│   │   ├── App.css
│   │   ├── index.css               # Variables CSS globales y reset
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                         # Backend Node.js + Express
│   ├── models/
│   │   └── Recipe.js               # Schema de Mongoose
│   ├── routes/
│   │   └── recipes.js              # Rutas CRUD /api/recipes
│   ├── index.js                    # Entry point del servidor
│   ├── .env                        # Variables de entorno (no subir a Git)
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Requisitos previos

- [Node.js](https://nodejs.org) v18 o superior
- Cuenta en [MongoDB Atlas](https://mongodb.com/atlas) (gratis) o MongoDB instalado localmente
- Git

---

## Instalación

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/recipe-board.git
cd recipe-board
```

### 2. Instala dependencias del backend

```bash
cd server
npm install
```

### 3. Instala dependencias del frontend

```bash
cd ../client
npm install
```

---

## Variables de entorno

Crea el archivo `server/.env` con las siguientes variables:

```env
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/recipe-board
PORT=3001
CLIENT_URL=http://localhost:5173
```

> ⚠️ Nunca subas el archivo `.env` a Git. Ya está incluido en `.gitignore`.

### Cómo obtener la URI de MongoDB Atlas

1. Entra a [cloud.mongodb.com](https://cloud.mongodb.com)
2. Crea un cluster gratuito (M0)
3. En **Database Access** crea un usuario con contraseña
4. En **Network Access** agrega `0.0.0.0/0` para permitir cualquier IP
5. En tu cluster haz clic en **Connect → Drivers → Node.js** y copia la URI
6. Reemplaza `<password>` con tu contraseña real

---

## Comandos disponibles

### Opción A — Dos terminales

```bash
# Terminal 1: backend
cd server
npm run dev

# Terminal 2: frontend
cd client
npm run dev
```

### Opción B — Un solo comando desde la raíz

Instala `concurrently` en la raíz del proyecto:

```bash
npm init -y
npm install -D concurrently
```

Agrega al `package.json` raíz:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix server\" \"npm run dev --prefix client\""
  }
}
```

Luego:

```bash
npm run dev
```

La app estará disponible en:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

---

## Arquitectura

```
[ React + Vite ]  →  HTTP /api/*  →  [ Express ]  →  [ Mongoose ]  →  [ MongoDB ]
   :5173                                 :3001
```

El frontend usa un proxy de Vite durante desarrollo para evitar problemas de CORS — todas las peticiones a `/api` se redirigen automáticamente al backend en el puerto 3001. Esto se configura en `vite.config.js`:

```js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
}
```

---

## API Reference

Base URL: `http://localhost:3001/api`

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/recipes` | Obtiene todas las recetas |
| `POST` | `/recipes` | Crea una nueva receta |
| `PUT` | `/recipes/:id` | Actualiza una receta existente |
| `DELETE` | `/recipes/:id` | Elimina una receta |

### Ejemplo de respuesta `GET /recipes`

```json
[
  {
    "_id": "664abc123...",
    "title": "Tostadas de aguacate",
    "description": "Pan tostado con aguacate y huevo pochado.",
    "category": "desayuno",
    "cookTime": 15,
    "servings": 2,
    "ingredients": [
      { "name": "aguacate", "amount": 2, "unit": "pza" },
      { "name": "huevo",    "amount": 2, "unit": "pza" }
    ],
    "steps": ["Tuesta el pan.", "Aplasta el aguacate.", "Pocha los huevos."],
    "tags": ["rápido", "vegetariano"],
    "createdAt": "2024-05-01T10:00:00.000Z",
    "updatedAt": "2024-05-01T10:00:00.000Z"
  }
]
```

---

## Modelo de datos

```js
// server/models/Recipe.js
{
  title:       String,   // requerido, máx 100 caracteres
  description: String,   // máx 500 caracteres
  category:    String,   // enum: desayuno | comida | cena | postre | snack | bebida
  cookTime:    Number,   // en minutos
  servings:    Number,   // número de porciones
  ingredients: [
    {
      name:   String,   // nombre del ingrediente
      amount: Number,   // cantidad
      unit:   String,   // enum: g | kg | oz | lb | ml | l | tsp | tbsp | cup | pza | diente | pizca | al gusto
    }
  ],
  steps:    [String],   // pasos de preparación
  tags:     [String],   // etiquetas libres
  imageUrl:  String,    // URL de imagen opcional
  createdAt: Date,      // auto — timestamps de Mongoose
  updatedAt: Date,      // auto — timestamps de Mongoose
}
```
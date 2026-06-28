import { createApiThunk } from '../shared/createApiThunk'
import {
  createProduct,
  deleteProduct,
  fetchProductOnly,
  fetchProductsOnly,
  fetchCategories,
  fetchSellerProducts,
  normalizeProduct,
} from '../../services/api'
import { categoriesSet, selectCategories } from '../categories/categoriesSlice'
import { loadCategories } from '../categories/categoriesThunks'

// Garantiza que las categorías estén en el store y devuelve un índice {id: categoria}
// para normalizar productos SIN volver a pedir /api/categorias si ya están cargadas.
async function ensureCategoriesById({ getState, dispatch }) {
  if (!selectCategories(getState()).length) {
    // Pide categorías una sola vez y las publica en su slice (sin romper si fallan).
    const categories = await fetchCategories().catch(() => [])
    if (categories.length) dispatch(categoriesSet(categories))
  }
  return Object.fromEntries(selectCategories(getState()).map((c) => [c.id, c]))
}

// Thunks CRUD de productos (GET / POST / DELETE) contra el backend vía Axios.
// Las lecturas reutilizan las categorías del store para evitar GET redundantes.
export const loadProducts = createApiThunk('products/fetchAll', async (params, thunkApi) => {
  const categoriesById = await ensureCategoriesById(thunkApi)
  const raw = await fetchProductsOnly(params)
  return raw.map((p) => normalizeProduct(p, categoriesById))
})

export const loadSellerProducts = createApiThunk('products/fetchSeller', async (_, thunkApi) => {
  const categoriesById = await ensureCategoriesById(thunkApi)
  const raw = await fetchSellerProducts()
  return raw.map((p) => normalizeProduct(p, categoriesById))
})

export const loadProductById = createApiThunk('products/fetchOne', async (id, thunkApi) => {
  const categoriesById = await ensureCategoriesById(thunkApi)
  const raw = await fetchProductOnly(id)
  return normalizeProduct(raw, categoriesById)
})

export const createProductThunk = createApiThunk('products/create', (payload) => createProduct(payload))
export const deleteProductThunk = createApiThunk('products/delete', async (id) => {
  await deleteProduct(id)
  return id
})

// Orquestadores: cargan categorías primero (una sola vez) y luego los productos,
// de modo que el GET /api/categorias ocurra exactamente una vez por pantalla.

// Para pantallas de catálogo que muestran categorías + productos (Home, Catálogo, AdminCategorías).
export const loadCatalog = (params) => async (dispatch) => {
  await dispatch(loadCategories())
  await dispatch(loadProducts(params))
}

// Para el detalle de producto: una sola carga de categorías, luego el producto y su listado (relacionados).
export const loadProductPage = (id) => async (dispatch) => {
  await dispatch(loadCategories())
  await Promise.all([dispatch(loadProductById(id)), dispatch(loadProducts())])
}

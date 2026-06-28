import { createApiThunk } from '../shared/createApiThunk'
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  normalizeCategory,
  updateCategory,
} from '../../services/api'

// Thunks CRUD de categorías (GET / POST / PUT / DELETE) vía Axios.
// create/update normalizan la respuesta cruda del backend (nombre/descripcion) al
// formato del slice (name/desc) para mantener el estado consistente sin recargar.
export const loadCategories = createApiThunk('categories/fetchAll', () => fetchCategories())
export const createCategoryThunk = createApiThunk('categories/create', async (payload) =>
  normalizeCategory(await createCategory(payload)))
export const updateCategoryThunk = createApiThunk('categories/update', async ({ id, payload }) =>
  normalizeCategory(await updateCategory(id, payload)))
export const deleteCategoryThunk = createApiThunk('categories/delete', async (id) => {
  await deleteCategory(id)
  return id
})

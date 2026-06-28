import { createApiThunk } from '../shared/createApiThunk'
import {
  createProduct,
  deleteProduct,
  fetchProductById,
  fetchProducts,
  fetchSellerProducts,
} from '../../services/api'

// Thunks CRUD de productos (GET / POST / DELETE) contra el backend vía Axios.
export const loadProducts = createApiThunk('products/fetchAll', (params) => fetchProducts(params))
export const loadSellerProducts = createApiThunk('products/fetchSeller', () => fetchSellerProducts())
export const loadProductById = createApiThunk('products/fetchOne', (id) => fetchProductById(id))
export const createProductThunk = createApiThunk('products/create', (payload) => createProduct(payload))
export const deleteProductThunk = createApiThunk('products/delete', async (id) => {
  await deleteProduct(id)
  return id
})

import { createSlice } from '@reduxjs/toolkit'
import { handleAsync } from '../shared/asyncState'
import {
  createCategoryThunk,
  deleteCategoryThunk,
  loadCategories,
  updateCategoryThunk,
} from './categoriesThunks'

const initialState = {
  items: [],
  loading: false,
  error: null,
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    // Permite que los thunks de productos pueblen las categorías una sola vez
    // (cuando las obtienen junto con el catálogo) y así evitar un GET /api/categorias extra.
    categoriesSet(state, { payload }) {
      state.items = payload
    },
  },
  extraReducers: (builder) => {
    handleAsync(builder, loadCategories, (state, { payload }) => { state.items = payload })
    handleAsync(builder, createCategoryThunk, (state, { payload }) => {
      if (payload?.id) state.items.push(payload)
    })
    handleAsync(builder, updateCategoryThunk, (state, { payload }) => {
      if (payload?.id) state.items = state.items.map((c) => (c.id === payload.id ? { ...c, ...payload } : c))
    })
    handleAsync(builder, deleteCategoryThunk, (state, { payload: id }) => {
      state.items = state.items.filter((c) => c.id !== id)
    })
  },
})

export const { categoriesSet } = categoriesSlice.actions

export const selectCategories = (state) => state.categories.items
export const selectCategoriesLoading = (state) => state.categories.loading
export const selectCategoriesError = (state) => state.categories.error

export default categoriesSlice.reducer

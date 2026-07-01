import { createSlice } from '@reduxjs/toolkit'
import { handleAsync } from '../shared/asyncState'
import {
  createProductThunk,
  deleteProductThunk,
  loadProductById,
  loadProducts,
  loadSellerProducts,
  updateProductThunk,
} from './productsThunks'

const initialState = {
  items: [], // listado de productos
  current: null, // producto en detalle
  loading: false,
  error: null,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct(state) {
      state.current = null
    },
  },
  extraReducers: (builder) => {
    const setList = (state, { payload }) => { state.items = payload }
    handleAsync(builder, loadProducts, setList)
    handleAsync(builder, loadSellerProducts, setList)
    handleAsync(builder, loadProductById, (state, { payload }) => { state.current = payload })
    handleAsync(builder, createProductThunk, (state, { payload }) => {
      if (payload?.id) {
        state.items.unshift(payload)
        state.current = payload
      }
    })
    handleAsync(builder, updateProductThunk, (state, { payload }) => {
      if (payload?.id) {
        state.items = state.items.map((p) => (p.id === payload.id ? payload : p))
        if (state.current?.id === payload.id) state.current = payload
      }
    })
    handleAsync(builder, deleteProductThunk, (state, { payload: id }) => {
      state.items = state.items.filter((p) => p.id !== id)
      if (state.current?.id === id) state.current = null
    })
  },
})

export const { clearCurrentProduct } = productsSlice.actions

export const selectProducts = (state) => state.products.items
export const selectCurrentProduct = (state) => state.products.current
export const selectProductsLoading = (state) => state.products.loading
export const selectProductsError = (state) => state.products.error

export default productsSlice.reducer

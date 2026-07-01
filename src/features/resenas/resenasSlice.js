import { createSlice } from '@reduxjs/toolkit'
import { handleAsync } from '../shared/asyncState'
import { createResenaThunk, loadResenas } from './resenasThunks'

const initialState = {
  items: [],
  loading: false,
  error: null,
}

const resenasSlice = createSlice({
  name: 'resenas',
  initialState,
  reducers: {
    // Limpia las reseñas al cambiar de producto (evita mostrar las del producto anterior).
    clearResenas(state) {
      state.items = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    handleAsync(builder, loadResenas, (state, { payload }) => { state.items = payload })
    handleAsync(builder, createResenaThunk, (state, { payload }) => {
      if (payload?.id) state.items.unshift(payload)
    })
  },
})

export const { clearResenas } = resenasSlice.actions

export const selectResenas = (state) => state.resenas.items
export const selectResenasLoading = (state) => state.resenas.loading
export const selectResenasError = (state) => state.resenas.error

export default resenasSlice.reducer

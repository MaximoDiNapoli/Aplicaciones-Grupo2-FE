import { createSlice } from '@reduxjs/toolkit'
import { handleAsync } from '../shared/asyncState'
import { createMetodoPagoThunk, deleteMetodoPagoThunk, loadMetodosPago } from './metodosPagoThunks'

const initialState = {
  items: [],
  loading: false,
  error: null,
}

const metodosPagoSlice = createSlice({
  name: 'metodosPago',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    handleAsync(builder, loadMetodosPago, (state, { payload }) => { state.items = payload })
    handleAsync(builder, createMetodoPagoThunk, (state, { payload }) => {
      if (payload?.id) state.items.push(payload)
    })
    handleAsync(builder, deleteMetodoPagoThunk, (state, { payload: id }) => {
      state.items = state.items.filter((m) => m.id !== id)
    })
  },
})

export const selectMetodosPago = (state) => state.metodosPago.items
export const selectMetodosPagoLoading = (state) => state.metodosPago.loading
export const selectMetodosPagoError = (state) => state.metodosPago.error

export default metodosPagoSlice.reducer

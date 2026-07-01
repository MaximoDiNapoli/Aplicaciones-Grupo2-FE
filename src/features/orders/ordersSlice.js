import { createSlice } from '@reduxjs/toolkit'
import { handleAsync } from '../shared/asyncState'
import {
  createPurchaseThunk,
  loadOrderById,
  loadOrderItems,
  loadOrders,
  updateOrderStatusThunk,
} from './ordersThunks'

const initialState = {
  items: [], // listado de compras
  current: null, // compra en detalle
  currentItems: [], // detalle de líneas de la compra
  loading: false,
  error: null,
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    handleAsync(builder, loadOrders, (state, { payload }) => { state.items = payload })
    handleAsync(builder, loadOrderById, (state, { payload }) => { state.current = payload })
    handleAsync(builder, loadOrderItems, (state, { payload }) => { state.currentItems = payload })
    handleAsync(builder, updateOrderStatusThunk, (state, { payload }) => {
      state.items = state.items.map((o) => (o.id === payload.id ? { ...o, idEstado: payload.idEstado } : o))
    })
    handleAsync(builder, createPurchaseThunk, (state, { payload }) => {
      if (payload?.id) {
        state.current = payload
        state.items = [payload, ...state.items.filter((order) => order.id !== payload.id)]
      }
    })
  },
})

export const selectOrders = (state) => state.orders.items
export const selectCurrentOrder = (state) => state.orders.current
export const selectOrderItems = (state) => state.orders.currentItems
export const selectOrdersLoading = (state) => state.orders.loading
export const selectOrdersError = (state) => state.orders.error

export default ordersSlice.reducer

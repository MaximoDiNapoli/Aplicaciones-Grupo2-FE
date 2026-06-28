import { createSlice } from '@reduxjs/toolkit'
import { handleAsync } from '../shared/asyncState'
import { toLocalItem } from './cartUtils'
import {
  addItemRemote,
  clearCartRemote,
  loadCart,
  removeItemRemote,
  setQtyRemote,
} from './cartThunks'

const initialState = {
  items: [],
  cartId: null,
  loading: false,
  error: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // ---- Mutaciones locales (carrito del invitado, sin backend) ----
    addItemLocal(state, { payload: { product, qty = 1 } }) {
      const existing = state.items.find((it) => it.id === product.id)
      if (existing) existing.qty += qty
      else state.items.push(toLocalItem(product, qty))
    },
    setQtyLocal(state, { payload: { id, qty } }) {
      const item = state.items.find((it) => it.id === id)
      if (item) item.qty = Math.max(1, qty)
    },
    removeItemLocal(state, { payload: id }) {
      state.items = state.items.filter((it) => it.id !== id)
    },
    // Vacía sólo el estado local (tras una compra el backend ya vació el carrito).
    clearLocal(state) {
      state.items = []
    },
    resetCart(state) {
      state.items = []
      state.cartId = null
    },
  },
  extraReducers: (builder) => {
    handleAsync(builder, loadCart, (state, { payload }) => {
      state.cartId = payload.cartId
      state.items = payload.items
    })
    // Aplica el resultado de agregar/actualizar un ítem (append o replace por itemId).
    const applyItem = (state, { payload }) => {
      if (payload.mode === 'append') {
        state.items.push(payload.item)
      } else {
        state.items = state.items.map((it) => (it.itemId === payload.item.itemId ? payload.item : it))
      }
    }
    handleAsync(builder, addItemRemote, applyItem)
    handleAsync(builder, setQtyRemote, applyItem)
    handleAsync(builder, removeItemRemote, (state, { payload }) => {
      state.items = state.items.filter((it) => it.id !== payload.id)
    })
    handleAsync(builder, clearCartRemote, (state) => {
      state.items = []
    })
  },
})

export const { addItemLocal, setQtyLocal, removeItemLocal, clearLocal, resetCart } = cartSlice.actions

export const selectCartItems = (state) => state.cart.items
export const selectCartId = (state) => state.cart.cartId
export const selectCartSubtotal = (state) => state.cart.items.reduce((sum, it) => sum + it.price * it.qty, 0)
export const selectCartCount = (state) => state.cart.items.reduce((sum, it) => sum + it.qty, 0)

export default cartSlice.reducer

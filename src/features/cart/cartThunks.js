import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  addCartItem,
  createCart,
  deleteCartItem,
  fetchCartItems,
  fetchCarts,
  updateCartItem,
} from '../../services/api'
import { isComprador, toBackendItem } from './cartUtils'

// Operaciones de carrito persistidas en el backend (CRUD vía Axios).
// Sólo se usan cuando el usuario es un comprador logueado; el invitado opera con
// reducers locales del slice. El estado de auth/cart se lee con getState().

// GET: carga (o crea) el carrito del comprador y sus ítems.
export const loadCart = createAsyncThunk('cart/load', async (_, { getState, rejectWithValue }) => {
  const { auth } = getState()
  const backed = Boolean(auth.token) && isComprador(auth.user)
  if (!backed) return { cartId: null, items: [] }
  try {
    const carts = await fetchCarts()
    const cart = carts[0] || (await createCart('Mi carrito'))
    const serverItems = await fetchCartItems(cart.id)
    return { cartId: cart.id, items: serverItems.map(toBackendItem) }
  } catch (err) {
    return rejectWithValue(err.message || 'No se pudo cargar el carrito')
  }
})

// POST/PUT: agrega un producto; si ya está en el carrito, suma la cantidad.
export const addItemRemote = createAsyncThunk('cart/addItem', async ({ product, qty = 1 }, { getState, rejectWithValue }) => {
  const { cart } = getState()
  try {
    const existing = cart.items.find((it) => it.id === product.id)
    if (existing) {
      const updated = await updateCartItem(existing.itemId, { idProducto: product.id, cantidad: existing.qty + qty })
      return { mode: 'replace', item: toBackendItem(updated) }
    }
    const created = await addCartItem(cart.cartId, { idProducto: product.id, cantidad: qty })
    return { mode: 'append', item: toBackendItem(created) }
  } catch (err) {
    return rejectWithValue(err.message || 'No se pudo agregar al carrito')
  }
})

// PUT: fija la cantidad de un ítem existente.
export const setQtyRemote = createAsyncThunk('cart/setQty', async ({ id, qty }, { getState, rejectWithValue }) => {
  const { cart } = getState()
  const existing = cart.items.find((it) => it.id === id)
  if (!existing) return rejectWithValue('El ítem no existe en el carrito')
  try {
    const updated = await updateCartItem(existing.itemId, { idProducto: id, cantidad: Math.max(1, qty) })
    return { mode: 'replace', item: toBackendItem(updated) }
  } catch (err) {
    return rejectWithValue(err.message || 'No se pudo actualizar la cantidad')
  }
})

// DELETE: quita un producto del carrito.
export const removeItemRemote = createAsyncThunk('cart/removeItem', async ({ id }, { getState, rejectWithValue }) => {
  const { cart } = getState()
  const existing = cart.items.find((it) => it.id === id)
  if (!existing) return { id }
  try {
    await deleteCartItem(existing.itemId)
    return { id }
  } catch (err) {
    return rejectWithValue(err.message || 'No se pudo quitar el producto')
  }
})

// DELETE (en lote): vacía el carrito en el backend.
export const clearCartRemote = createAsyncThunk('cart/clear', async (_, { getState, rejectWithValue }) => {
  const { cart } = getState()
  try {
    await Promise.all(cart.items.map((it) => deleteCartItem(it.itemId)))
  } catch (err) {
    return rejectWithValue(err.message || 'No se pudo vaciar el carrito')
  }
  return true
})

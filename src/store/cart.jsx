/* eslint-disable react-refresh/only-export-components */
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectAuth } from '../features/auth/authSlice'
import {
  addItemLocal,
  clearLocal as clearLocalAction,
  removeItemLocal,
  resetCart,
  selectCartCount,
  selectCartId,
  selectCartItems,
  selectCartSubtotal,
  setQtyLocal,
} from '../features/cart/cartSlice'
import {
  addItemRemote,
  clearCartRemote,
  loadCart,
  removeItemRemote,
  setQtyRemote,
} from '../features/cart/cartThunks'
import { isComprador } from '../features/cart/cartUtils'

// Reexportamos las reglas de precio/resumen para no romper imports existentes.
export { PRICING, shippingFor, buildCheckoutSummary } from '../features/cart/cartUtils'

// Compatibilidad: misma API del antiguo CartContext, respaldada por el slice `cart`.
// Decide entre operaciones persistidas (comprador logueado -> thunks) y locales (invitado).
export function useCart() {
  const dispatch = useDispatch()
  const { token, user } = useSelector(selectAuth)
  const items = useSelector(selectCartItems)
  const cartId = useSelector(selectCartId)
  const subtotal = useSelector(selectCartSubtotal)
  const count = useSelector(selectCartCount)
  const backed = Boolean(token) && isComprador(user)

  return {
    items,
    cartId,
    subtotal,
    count,
    addItem: (product, qty = 1) =>
      backed && cartId
        ? dispatch(addItemRemote({ product, qty }))
        : dispatch(addItemLocal({ product, qty })),
    setQty: (id, qty) =>
      backed && cartId
        ? dispatch(setQtyRemote({ id, qty }))
        : dispatch(setQtyLocal({ id, qty: Math.max(1, qty) })),
    remove: (id) =>
      backed && cartId ? dispatch(removeItemRemote({ id })) : dispatch(removeItemLocal(id)),
    clear: () =>
      backed && cartId ? dispatch(clearCartRemote()) : dispatch(clearLocalAction()),
    // Limpia sólo el estado local (tras una compra el backend ya vació el carrito).
    clearLocal: () => dispatch(clearLocalAction()),
  }
}

// Sincroniza el carrito con el backend cuando cambia la sesión: al loguearse un comprador
// carga su carrito; al desloguear lo vacía. Reemplaza al efecto del antiguo CartProvider.
export function CartProvider({ children }) {
  const dispatch = useDispatch()
  const { token, user } = useSelector(selectAuth)
  const backed = Boolean(token) && isComprador(user)

  useEffect(() => {
    if (backed) dispatch(loadCart())
    else dispatch(resetCart())
  }, [backed, dispatch])

  return children
}

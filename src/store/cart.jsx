/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './auth'
import { useToast } from './toast'
import {
  addCartItem,
  createCart,
  deleteCartItem,
  fetchCartItems,
  fetchCarts,
  normalizeProduct,
  updateCartItem,
} from '../services/api'

// ---- Reglas de precios (única fuente de verdad para carrito y checkout) ----
export const PRICING = {
  freeShippingFrom: 50, // envío gratis a partir de este subtotal
  flatShipping: 5, // costo de envío cuando no aplica el gratis
  taxRate: 0.08, // impuestos estimados (8%)
  memberDiscountFrom: 100, // subtotal mínimo para el descuento de miembro
  memberDiscount: 30, // monto fijo del descuento de miembro
}

// Costo de envío para un subtotal dado.
export const shippingFor = (subtotal) =>
  subtotal === 0 || subtotal >= PRICING.freeShippingFrom ? 0 : PRICING.flatShipping

// Normaliza un producto (catálogo o detalle) al formato de ítem del carrito local.
const toLocalItem = (product, qty) => ({
  id: product.id,
  itemId: null,
  name: product.name,
  variant: product.variant || product.tagline || '',
  price: product.price,
  qty,
  g: product.g,
})

// Mapea un DetalleCarrito del backend al formato de ítem del carrito.
const toBackendItem = (detalle) => {
  const np = normalizeProduct(detalle.producto || {})
  return {
    id: np.id ?? detalle.producto?.id,
    itemId: detalle.id,
    name: np.name,
    variant: np.tagline || '',
    price: Number(detalle.precioUnitario ?? np.price ?? 0),
    qty: detalle.cantidad,
    g: np.g,
  }
}

const isComprador = (user) => String(user?.rol || '').toUpperCase().includes('COMPRADOR')

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { token, user } = useAuth()
  const notify = useToast()
  const backed = Boolean(token) && isComprador(user)

  const [items, setItems] = useState([])
  const [cartId, setCartId] = useState(null)

  // Sincroniza el carrito con el backend cuando el usuario es un comprador logueado.
  // Al desloguear (backed pasa a false) vacía el carrito local.
  useEffect(() => {
    let alive = true
    ;(async () => {
      await Promise.resolve() // evita setState sincrónico dentro del efecto
      if (!alive) return
      if (!backed) {
        setCartId(null)
        setItems([])
        return
      }
      try {
        const carts = await fetchCarts()
        const cart = carts[0] || (await createCart('Mi carrito'))
        const serverItems = await fetchCartItems(cart.id)
        if (!alive) return
        setCartId(cart.id)
        setItems(serverItems.map(toBackendItem))
      } catch {
        if (alive) { setCartId(null); setItems([]) }
      }
    })()
    return () => { alive = false }
  }, [backed])

  const value = useMemo(() => {
    // Agrega un producto; si ya está, suma la cantidad. Persiste en backend si corresponde.
    const addItem = async (product, qty = 1) => {
      if (backed && cartId) {
        const existing = items.find((it) => it.id === product.id)
        try {
          if (existing) {
            const updated = await updateCartItem(existing.itemId, { idProducto: product.id, cantidad: existing.qty + qty })
            setItems((list) => list.map((it) => (it.itemId === existing.itemId ? toBackendItem(updated) : it)))
          } else {
            const created = await addCartItem(cartId, { idProducto: product.id, cantidad: qty })
            setItems((list) => [...list, toBackendItem(created)])
          }
        } catch (err) {
          notify(err.message || 'No se pudo agregar al carrito')
        }
        return
      }
      setItems((list) => {
        const exists = list.some((it) => it.id === product.id)
        return exists
          ? list.map((it) => (it.id === product.id ? { ...it, qty: it.qty + qty } : it))
          : [...list, toLocalItem(product, qty)]
      })
    }

    // Fija la cantidad de un ítem (mínimo 1).
    const setQty = async (id, qty) => {
      const nextQty = Math.max(1, qty)
      if (backed && cartId) {
        const existing = items.find((it) => it.id === id)
        if (!existing) return
        try {
          const updated = await updateCartItem(existing.itemId, { idProducto: id, cantidad: nextQty })
          setItems((list) => list.map((it) => (it.itemId === existing.itemId ? toBackendItem(updated) : it)))
        } catch (err) {
          notify(err.message || 'No se pudo actualizar la cantidad')
        }
        return
      }
      setItems((list) => list.map((it) => (it.id === id ? { ...it, qty: nextQty } : it)))
    }

    const remove = async (id) => {
      if (backed && cartId) {
        const existing = items.find((it) => it.id === id)
        if (!existing) return
        try {
          await deleteCartItem(existing.itemId)
          setItems((list) => list.filter((it) => it.id !== id))
        } catch (err) {
          notify(err.message || 'No se pudo quitar el producto')
        }
        return
      }
      setItems((list) => list.filter((it) => it.id !== id))
    }

    // Vacía el carrito (borra los ítems en el backend si corresponde).
    const clear = async () => {
      if (backed && cartId) {
        try {
          await Promise.all(items.map((it) => deleteCartItem(it.itemId)))
        } catch { /* ignoramos: el carrito se vacía igual al confirmar la compra */ }
      }
      setItems([])
    }

    // Limpia solo el estado local (tras una compra el backend ya vació el carrito).
    const clearLocal = () => setItems([])

    const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0)
    const count = items.reduce((sum, it) => sum + it.qty, 0)

    return { items, cartId, addItem, setQty, remove, clear, clearLocal, subtotal, count }
  }, [items, backed, cartId, notify])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}

// Arma el resumen del checkout a partir del carrito real (sin impuestos: el envío
// y el descuento de miembro se muestran en los pasos del checkout).
export function buildCheckoutSummary(items, subtotal) {
  const shipping = shippingFor(subtotal)
  const discount = subtotal >= PRICING.memberDiscountFrom ? PRICING.memberDiscount : 0
  return {
    // price = total de la línea (unitario × cantidad) para que sumen el subtotal.
    items: items.map((it) => ({
      id: it.id,
      name: it.name,
      variant: it.variant,
      qty: it.qty,
      price: it.price * it.qty,
      unitPrice: it.price,
      g: it.g,
    })),
    count: items.reduce((n, it) => n + it.qty, 0),
    subtotal,
    shipping,
    discount,
    total: subtotal + shipping - discount,
  }
}

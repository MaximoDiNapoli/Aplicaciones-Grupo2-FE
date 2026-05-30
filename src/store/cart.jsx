/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { cartItems as initialCart } from '../data/mock'

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

// Normaliza un producto (catálogo o detalle) al formato de ítem del carrito.
const toCartItem = (product, qty) => ({
  id: product.id,
  name: product.name,
  variant: product.variant || product.tagline || '',
  price: product.price,
  qty,
  g: product.g,
})

// ---- Store de carrito en memoria (demo) ----
const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(initialCart)

  const value = useMemo(() => {
    // Agrega un producto; si ya está en el carrito, suma la cantidad.
    const addItem = (product, qty = 1) =>
      setItems((list) => {
        const exists = list.some((it) => it.id === product.id)
        return exists
          ? list.map((it) => (it.id === product.id ? { ...it, qty: it.qty + qty } : it))
          : [...list, toCartItem(product, qty)]
      })

    // Fija la cantidad de un ítem (mínimo 1).
    const setQty = (id, qty) =>
      setItems((list) => list.map((it) => (it.id === id ? { ...it, qty: Math.max(1, qty) } : it)))

    const remove = (id) => setItems((list) => list.filter((it) => it.id !== id))
    const clear = () => setItems([])

    const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0)
    const count = items.reduce((sum, it) => sum + it.qty, 0)

    return { items, addItem, setQty, remove, clear, subtotal, count }
  }, [items])

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

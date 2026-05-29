/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { cartItems as initialCart } from '../data/mock'

// Store de carrito en memoria (demo). Mantiene los items y deriva totales.
const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(initialCart)

  const value = useMemo(() => {
    // Agrega un producto al carrito; si ya existe, incrementa su cantidad.
    const addItem = (product, qty = 1) =>
      setItems((list) => {
        const found = list.find((it) => it.id === product.id)
        if (found) {
          return list.map((it) => (it.id === product.id ? { ...it, qty: it.qty + qty } : it))
        }
        return [
          ...list,
          {
            id: product.id,
            name: product.name,
            variant: product.variant || product.tagline || '',
            price: product.price,
            qty,
            g: product.g,
          },
        ]
      })
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

// Reglas de envío/descuento del checkout, derivadas del carrito real.
export const FREE_SHIPPING_FROM = 50
export function buildCheckoutSummary(items, subtotal) {
  const shipping = subtotal >= FREE_SHIPPING_FROM || subtotal === 0 ? 0 : 5
  const discount = subtotal >= 100 ? 30 : 0
  const count = items.reduce((n, it) => n + it.qty, 0)
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
    count,
    subtotal,
    shipping,
    discount,
    total: subtotal + shipping - discount,
  }
}

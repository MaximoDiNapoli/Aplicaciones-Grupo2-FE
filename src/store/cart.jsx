/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { cartItems as initialCart } from '../data/mock'

// Store de carrito en memoria (demo). Mantiene los items y deriva totales.
const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(initialCart)

  const value = useMemo(() => {
    const setQty = (id, qty) =>
      setItems((list) => list.map((it) => (it.id === id ? { ...it, qty: Math.max(1, qty) } : it)))
    const remove = (id) => setItems((list) => list.filter((it) => it.id !== id))
    const clear = () => setItems([])
    const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0)
    const count = items.reduce((sum, it) => sum + it.qty, 0)
    return { items, setQty, remove, clear, subtotal, count }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}

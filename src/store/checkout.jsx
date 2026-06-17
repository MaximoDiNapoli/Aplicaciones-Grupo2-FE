/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'

// Store del checkout: guarda la dirección de envío y el método de pago elegidos
// para compartirlos entre los pasos (envío -> pago -> resumen), y la última orden creada.
const CheckoutContext = createContext(null)

export function CheckoutProvider({ children }) {
  const [shipping, setShipping] = useState(null) // { id, label, lines: [] }
  const [payment, setPayment] = useState(null) // { idMetodoPago, label, brand?, last4?, exp? }
  const [lastOrder, setLastOrder] = useState(null) // { id, total, items }

  const value = useMemo(() => ({
    shipping,
    payment,
    lastOrder,
    setShipping,
    setPayment,
    setLastOrder,
    // Limpia los datos del flujo, pero conserva lastOrder para la pantalla de confirmación.
    reset: () => { setShipping(null); setPayment(null) },
  }), [shipping, payment, lastOrder])

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext)
  if (!ctx) throw new Error('useCheckout debe usarse dentro de CheckoutProvider')
  return ctx
}

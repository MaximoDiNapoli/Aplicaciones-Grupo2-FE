/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'

// Store del checkout: guarda la dirección de envío y el método de pago elegidos
// para compartirlos entre los pasos (envío -> pago -> resumen).
const CheckoutContext = createContext(null)

export function CheckoutProvider({ children }) {
  const [shipping, setShipping] = useState(null) // { id, label, lines: [] }
  const [payment, setPayment] = useState(null) // { method, label, brand?, last4?, exp?, name? }

  const value = useMemo(() => ({
    shipping,
    payment,
    setShipping,
    setPayment,
    reset: () => { setShipping(null); setPayment(null) },
  }), [shipping, payment])

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext)
  if (!ctx) throw new Error('useCheckout debe usarse dentro de CheckoutProvider')
  return ctx
}

import { createSlice } from '@reduxjs/toolkit'

// Estado del flujo de checkout: dirección de envío y método de pago elegidos
// (compartidos entre los pasos envío -> pago -> resumen) y la última orden creada.
const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    shipping: null, // { id, label, lines: [] }
    payment: null, // { idMetodoPago, label, brand?, last4?, exp? }
    lastOrder: null, // { id, total, items }
  },
  reducers: {
    setShipping(state, { payload }) {
      state.shipping = payload
    },
    setPayment(state, { payload }) {
      state.payment = payload
    },
    setLastOrder(state, { payload }) {
      state.lastOrder = payload
    },
    // Limpia los datos del flujo, pero conserva lastOrder para la pantalla de confirmación.
    resetCheckout(state) {
      state.shipping = null
      state.payment = null
    },
  },
})

export const { setShipping, setPayment, setLastOrder, resetCheckout } = checkoutSlice.actions

export const selectShipping = (state) => state.checkout.shipping
export const selectPayment = (state) => state.checkout.payment
export const selectLastOrder = (state) => state.checkout.lastOrder

export default checkoutSlice.reducer

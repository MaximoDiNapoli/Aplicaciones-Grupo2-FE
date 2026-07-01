/* eslint-disable react-refresh/only-export-components */
import { useDispatch, useSelector } from 'react-redux'
import {
  resetCheckout,
  selectPayment,
  selectShipping,
  selectLastOrder,
  setLastOrder as setLastOrderAction,
  setPayment as setPaymentAction,
  setShipping as setShippingAction,
} from '../features/checkout/checkoutSlice'

// Compatibilidad: misma API del antiguo CheckoutContext, respaldada por el slice `checkout`.
export function useCheckout() {
  const dispatch = useDispatch()
  const shipping = useSelector(selectShipping)
  const payment = useSelector(selectPayment)
  const lastOrder = useSelector(selectLastOrder)
  return {
    shipping,
    payment,
    lastOrder,
    setShipping: (value) => dispatch(setShippingAction(value)),
    setPayment: (value) => dispatch(setPaymentAction(value)),
    setLastOrder: (value) => dispatch(setLastOrderAction(value)),
    reset: () => dispatch(resetCheckout()),
  }
}

export function CheckoutProvider({ children }) {
  return children
}

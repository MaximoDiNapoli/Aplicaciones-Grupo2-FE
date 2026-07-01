import { configureStore } from '@reduxjs/toolkit'
import { saveStoredSession } from '../services/session'
import authReducer from '../features/auth/authSlice'
import cartReducer from '../features/cart/cartSlice'
import checkoutReducer from '../features/checkout/checkoutSlice'
import toastReducer from '../features/ui/toastSlice'
import productsReducer from '../features/products/productsSlice'
import categoriesReducer from '../features/categories/categoriesSlice'
import usersReducer from '../features/users/usersSlice'
import ordersReducer from '../features/orders/ordersSlice'
import resenasReducer from '../features/resenas/resenasSlice'
import metodosPagoReducer from '../features/metodosPago/metodosPagoSlice'

// Store global de la aplicación: un reducer por dominio funcional (feature).
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    toast: toastReducer,
    products: productsReducer,
    categories: categoriesReducer,
    users: usersReducer,
    orders: ordersReducer,
    resenas: resenasReducer,
    metodosPago: metodosPagoReducer,
  },
})

// Persiste la sesión (token + usuario) en localStorage ante cada cambio de auth,
// replicando el comportamiento del antiguo AuthProvider con un único punto de verdad.
let lastAuth = store.getState().auth
store.subscribe(() => {
  const { auth } = store.getState()
  if (auth === lastAuth) return
  lastAuth = auth
  saveStoredSession({ token: auth.token, user: auth.user })
})

export default store

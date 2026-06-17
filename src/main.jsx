import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './store/cart'
import { ToastProvider } from './store/toast'
import { AuthProvider } from './store/auth'
import { CheckoutProvider } from './store/checkout'

// Punto de entrada: router + providers globales (auth, toasts, carrito, checkout) envuelven la app.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <CheckoutProvider>
              <App />
            </CheckoutProvider>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

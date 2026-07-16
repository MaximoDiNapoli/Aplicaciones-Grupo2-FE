import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import { store } from './app/store'
import { CartProvider } from './store/cart'
import { ToastViewport } from './store/toast'

// Punto de entrada: el estado global vive en el store de Redux Toolkit (<Provider>).
// CartProvider ya no aporta estado: sólo sincroniza el carrito con el backend al cambiar la sesión.
// ToastViewport renderiza la pila de notificaciones leyendo del slice `toast`.
createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <BrowserRouter>
        <CartProvider>
          <App />
          <ToastViewport />
        </CartProvider>
      </BrowserRouter>
    </Provider>
)

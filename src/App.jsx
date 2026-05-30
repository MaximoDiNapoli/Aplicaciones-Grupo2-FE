import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import './styles/app.css'
import './styles/dashboard.css'
import { useAuth } from './store/auth'

import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import CheckoutShipping from './pages/CheckoutShipping'
import CheckoutPayment from './pages/CheckoutPayment'
import CheckoutSummary from './pages/CheckoutSummary'
import CheckoutConfirmation from './pages/CheckoutConfirmation'
import MyOrders from './pages/MyOrders'
import OrderDetail from './pages/OrderDetail'
import Profile from './pages/Profile'
import Register from './pages/Register'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import NoResults from './pages/NoResults'

import SellerDashboard from './pages/seller/SellerDashboard'
import SellerProducts from './pages/seller/SellerProducts'
import SellerCreateProduct from './pages/seller/SellerCreateProduct'
import SellerProductDetail from './pages/seller/SellerProductDetail'
import SellerSales from './pages/seller/SellerSales'
import SellerOrderDetail from './pages/seller/SellerOrderDetail'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminSales from './pages/admin/AdminSales'
import AdminProducts from './pages/admin/AdminProducts'
import AdminCategories from './pages/admin/AdminCategories'

// Bloquea el checkout a los invitados (sin cuenta): los manda al login.
function RequireAccount({ children }) {
  const { isGuest } = useAuth()
  if (isGuest) return <Navigate to="/login" replace />
  return children
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/checkout/envio" element={<RequireAccount><CheckoutShipping /></RequireAccount>} />
        <Route path="/checkout/pago" element={<RequireAccount><CheckoutPayment /></RequireAccount>} />
        <Route path="/checkout/resumen" element={<RequireAccount><CheckoutSummary /></RequireAccount>} />
        <Route path="/checkout/confirmacion" element={<RequireAccount><CheckoutConfirmation /></RequireAccount>} />
        <Route path="/compras" element={<MyOrders />} />
        <Route path="/compras/:id" element={<OrderDetail />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sin-resultados" element={<NoResults />} />

        {/* Vendedor */}
        <Route path="/vendedor" element={<SellerDashboard />} />
        <Route path="/vendedor/inventario" element={<SellerProducts />} />
        <Route path="/vendedor/inventario/nuevo" element={<SellerCreateProduct />} />
        <Route path="/vendedor/inventario/:id" element={<SellerProductDetail />} />
        <Route path="/vendedor/ventas" element={<SellerSales />} />
        <Route path="/vendedor/ventas/:id" element={<SellerOrderDetail />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/usuarios" element={<AdminUsers />} />
        <Route path="/admin/ventas" element={<AdminSales />} />
        <Route path="/admin/catalogo" element={<AdminProducts />} />
        <Route path="/admin/categorias" element={<AdminCategories />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App

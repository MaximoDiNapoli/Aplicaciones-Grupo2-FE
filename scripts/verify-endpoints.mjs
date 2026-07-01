// Verificación dinámica de llamadas a endpoints.
// Levanta un backend MOCK que registra cada request y despacha los thunks REALES
// (slices + api + axios) para contar cuántas veces se llama a cada endpoint por pantalla,
// comprobando que no haya GET redundantes (p. ej. /api/categorias duplicado).
//
// Uso:  node --import ./scripts/loader.mjs scripts/verify-endpoints.mjs
import http from 'node:http'
import { configureStore } from '@reduxjs/toolkit'

const PORT = 8080
const log = []

// ---- Backend mock: responde JSON plausible y registra method+path (sin querystring) ----
const sample = {
  categorias: [
    { id: 1, nombre: 'Chocolates', descripcion: 'Cacao' },
    { id: 2, nombre: 'Gomitas', descripcion: 'Dulces' },
  ],
  productos: [
    { id: 1, nombre: 'Trufa', precio: 12, stock: 5, categoriaId: 1 },
    { id: 2, nombre: 'Osito', precio: 3, stock: 0, categoriaId: 2 },
  ],
  producto: { id: 1, nombre: 'Trufa', precio: 12, stock: 5, categoriaId: 1 },
}
function body(pathname) {
  if (pathname === '/api/categorias') return sample.categorias
  if (pathname === '/api/productos') return sample.productos
  if (/^\/api\/productos\/\d+$/.test(pathname)) return sample.producto
  if (/^\/api\/compras\/\d+\/detalle$/.test(pathname)) return []
  if (/^\/api\/compras\/\d+$/.test(pathname)) return { id: 1, total: 10, idUsuario: 1 }
  if (pathname === '/api/compras') return []
  if (pathname === '/api/users') return []
  if (pathname === '/api/estados') return []
  return {}
}
const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://localhost:${PORT}`)
  log.push(`${req.method} ${pathname}`)
  res.writeHead(200, { 'content-type': 'application/json' })
  res.end(JSON.stringify(body(pathname)))
})

const counts = () => log.reduce((m, e) => ((m[e] = (m[e] || 0) + 1), m), {})
const reset = () => { log.length = 0 }

async function run() {
  // Reducers reales -> store fresco por escenario (cada uno simula una pantalla "en frío").
  const [auth, cart, checkout, toast, products, categories, users, orders] = await Promise.all([
    import('../src/features/auth/authSlice.js'),
    import('../src/features/cart/cartSlice.js'),
    import('../src/features/checkout/checkoutSlice.js'),
    import('../src/features/ui/toastSlice.js'),
    import('../src/features/products/productsSlice.js'),
    import('../src/features/categories/categoriesSlice.js'),
    import('../src/features/users/usersSlice.js'),
    import('../src/features/orders/ordersSlice.js'),
  ])
  const makeStore = () => configureStore({
    reducer: {
      auth: auth.default, cart: cart.default, checkout: checkout.default, toast: toast.default,
      products: products.default, categories: categories.default, users: users.default, orders: orders.default,
    },
  })

  const { loadCatalog, loadProductPage, loadProducts, loadSellerProducts } = await import('../src/features/products/productsThunks.js')
  const { loadCategories } = await import('../src/features/categories/categoriesThunks.js')
  const { loadUsers } = await import('../src/features/users/usersThunks.js')
  const { loadOrders } = await import('../src/features/orders/ordersThunks.js')

  const results = []
  // fn recibe un store fresco; expect = conteo máximo permitido por endpoint.
  const scenario = async (name, fn, expect) => {
    reset()
    await fn(makeStore())
    const got = counts()
    const over = Object.entries(got).filter(([k, v]) => (expect[k] || 0) < v)
    if (over.length) ok = false
    results.push({ name, got, expect, over })
  }
  let ok = true

  await scenario('Home / Catalog / AdminCategories  -> loadCatalog()',
    (s) => s.dispatch(loadCatalog()),
    { 'GET /api/categorias': 1, 'GET /api/productos': 1 })

  await scenario('ProductDetail  -> loadProductPage(1)',
    (s) => s.dispatch(loadProductPage(1)),
    { 'GET /api/categorias': 1, 'GET /api/productos': 1, 'GET /api/productos/1': 1 })

  await scenario('AdminProducts  -> loadProducts()',
    (s) => s.dispatch(loadProducts()),
    { 'GET /api/categorias': 1, 'GET /api/productos': 1 })

  await scenario('SellerProducts -> loadSellerProducts()',
    (s) => s.dispatch(loadSellerProducts()),
    { 'GET /api/categorias': 1, 'GET /api/productos': 1 })

  // Concurrencia estilo StrictMode: dos dispatch sin await intermedio -> debe deduplicar.
  await scenario('loadCategories() x2 concurrente (condition)',
    (s) => Promise.all([s.dispatch(loadCategories()), s.dispatch(loadCategories())]),
    { 'GET /api/categorias': 1 })
  await scenario('loadUsers() x2 concurrente (condition)',
    (s) => Promise.all([s.dispatch(loadUsers()), s.dispatch(loadUsers())]),
    { 'GET /api/users': 1 })
  await scenario('loadOrders() x2 concurrente (condition)',
    (s) => Promise.all([s.dispatch(loadOrders()), s.dispatch(loadOrders())]),
    { 'GET /api/compras': 1 })

  // Caché de sesión: en el MISMO store, navegar a otra pantalla NO repite /api/categorias.
  await scenario('Navegación: loadCatalog() y luego loadProducts() (mismo store)',
    async (s) => { await s.dispatch(loadCatalog()); await s.dispatch(loadProducts()) },
    { 'GET /api/categorias': 1, 'GET /api/productos': 2 })

  for (const r of results) {
    console.log(`\n[${r.over.length ? 'FAIL' : ' OK '}] ${r.name}`)
    console.log('   real:', JSON.stringify(r.got))
    if (r.over.length) console.log('   >> de más:', JSON.stringify(Object.fromEntries(r.over)))
  }
  console.log(`\n=== ${ok ? 'TODO OK: sin llamadas redundantes' : 'HAY REDUNDANCIA'} ===`)
  server.close()
  process.exit(ok ? 0 : 1)
}

server.listen(PORT, run)

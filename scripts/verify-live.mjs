// Verificación END-TO-END contra el backend REAL (perfil H2 con datos sembrados, en :8080).
// Ejecuta el stack Redux del frontend (store + thunks + axios) y comprueba que los thunks
// se cumplen (fulfilled) y que el estado se puebla sin errores, incluyendo las features
// nuevas (reseñas y métodos de pago).
//
// Uso (backend levantado con SPRING_PROFILES_ACTIVE=h2):
//   node --import ./scripts/loader.mjs scripts/verify-live.mjs

// Polyfill mínimo de localStorage para que la sesión (token) persista en Node como en el navegador.
globalThis.localStorage = {
  _d: {},
  getItem(k) { return k in this._d ? this._d[k] : null },
  setItem(k, v) { this._d[k] = String(v) },
  removeItem(k) { delete this._d[k] },
}

const { store } = await import('../src/app/store.js')
const { loginUser } = await import('../src/features/auth/authThunks.js')
const { loadCatalog } = await import('../src/features/products/productsThunks.js')
const { loadOrders } = await import('../src/features/orders/ordersThunks.js')
const { loadResenas, createResenaThunk } = await import('../src/features/resenas/resenasThunks.js')
const { loadMetodosPago } = await import('../src/features/metodosPago/metodosPagoThunks.js')

let ok = true
const s = () => store.getState()
const show = (label, error, extra = '') => {
  const good = !error
  if (!good) ok = false
  console.log(`[${good ? ' OK ' : 'FAIL'}] ${label}${extra ? '  -> ' + extra : ''}${good ? '' : '  (' + error + ')'}`)
}

// 1) Catálogo público (categorías + productos sembrados)
await store.dispatch(loadCatalog())
show('loadCatalog()', s().categories.error || s().products.error,
  `categorias=${s().categories.items.length} productos=${s().products.items.length}`)

// 2) Reseñas del producto 1 (GET público) — el producto sembrado tiene reseñas del test previo
await store.dispatch(loadResenas(1))
const reviews = s().resenas.items
const avg = reviews.length ? (reviews.reduce((a, r) => a + r.puntuacion, 0) / reviews.length).toFixed(1) : '0'
show('loadResenas(1)', s().resenas.error, `count=${reviews.length} avg=${avg}`)

// 3) Login como COMPRADOR sembrado (mismas credenciales que el seed de MySQL)
await store.dispatch(loginUser({ email: 'comprador@gmail.com', password: '123' }))
show('loginUser(comprador)', s().auth.error, `usuario=${s().auth.user?.nombre} rol=${s().auth.user?.rol}`)

// 4) Crear reseña (POST autenticado) vía Redux
await store.dispatch(createResenaThunk({ idProducto: 1, puntuacion: 5, comentario: 'Reseña desde el stack Redux' }))
show('createResenaThunk()', s().resenas.error, `nuevo total=${s().resenas.items.length}`)

// 5) Métodos de pago (GET autenticado)
await store.dispatch(loadMetodosPago())
show('loadMetodosPago()', s().metodosPago.error, `metodos=${s().metodosPago.items.length}`)

// 6) Mis compras (autenticado)
await store.dispatch(loadOrders())
show('loadOrders()', s().orders.error, `compras=${s().orders.items.length}`)

console.log(`\n=== ${ok ? 'E2E OK: Redux <-> backend real (incluye reseñas y métodos de pago)' : 'E2E con fallos'} ===`)
process.exit(ok ? 0 : 1)

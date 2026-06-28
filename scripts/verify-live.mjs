// Verificación END-TO-END contra el backend REAL (debe estar corriendo en :8080).
// Ejecuta el stack Redux del frontend (store + thunks + axios) y comprueba que los
// thunks se cumplen (fulfilled) y que el estado se puebla sin errores.
//
// Uso (con el backend levantado):
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

const show = (label, error, extra = '') => {
  const ok = !error
  console.log(`[${ok ? ' OK ' : 'FAIL'}] ${label}${extra ? '  -> ' + extra : ''}${ok ? '' : '  (' + error + ')'}`)
  return ok
}

let ok = true
const s = () => store.getState()

// 1) Catálogo público (sin auth) — thunk orquestador: evaluamos el estado de los slices.
await store.dispatch(loadCatalog())
ok &= show('loadCatalog()', s().categories.error || s().products.error,
  `categorias=${s().categories.items.length} productos=${s().products.items.length}`)

// 2) Login real (usuario COMPRADOR registrado en la prueba e2e)
await store.dispatch(loginUser({ email: 'dora@test.com', password: 'secret123' }))
ok &= show('loginUser(dora)', s().auth.error,
  `token=${s().auth.token ? 'sí(' + s().auth.token.length + ')' : 'no'} usuario=${s().auth.user?.nombre} rol=${s().auth.user?.rol}`)

// 3) Endpoint autenticado (mis compras) usando el token persistido por el slice auth
await store.dispatch(loadOrders())
ok &= show('loadOrders()', s().orders.error, `compras=${s().orders.items.length}`)

console.log(`\n=== ${ok ? 'E2E OK: el stack Redux conversa con el backend real' : 'E2E con fallos'} ===`)
process.exit(ok ? 0 : 1)

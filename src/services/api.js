const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const TOKEN_KEY = 'ecomerce.token'
const USER_KEY = 'ecomerce.user'

const CATEGORY_ICONS = ['paw', 'butterfly', 'sparkles', 'store']
const CATEGORY_GRADIENTS = [
  ['#ff8c42', '#ff619b'],
  ['#9be3cf', '#3fae93'],
  ['#ffd25a', '#ff8c42'],
  ['#b07a4a', '#6b4423'],
]

function hashString(value) {
  return String(value || '')
    .split('')
    .reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0)
}

function pickFrom(value, list) {
  const index = Math.abs(hashString(value)) % list.length
  return list[index]
}

function toSlug(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getStoredToken() {
  if (typeof localStorage === 'undefined') return ''
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function getStoredUser() {
  if (typeof localStorage === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveStoredSession(session) {
  if (typeof localStorage === 'undefined') return
  if (!session) {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    return
  }
  if (session.token) {
    localStorage.setItem(TOKEN_KEY, session.token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
  if (session.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(session.user))
  } else {
    localStorage.removeItem(USER_KEY)
  }
}

export function clearStoredSession() {
  saveStoredSession(null)
}

function buildUrl(path, params) {
  const url = new URL(path, API_BASE_URL)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value != null && value !== '') {
        url.searchParams.set(key, value)
      }
    })
  }
  return url.toString()
}

async function parseResponse(response) {
  if (response.status === 204) return null
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }
  return response.text()
}

async function request(path, { method = 'GET', body, headers = {}, token, params } = {}) {
  const resolvedToken = token || getStoredToken()
  const finalHeaders = { ...headers }
  if (resolvedToken) {
    finalHeaders.Authorization = `Bearer ${resolvedToken}`
  }
  const init = { method, headers: finalHeaders }
  if (body != null) {
    if (body instanceof FormData) {
      init.body = body
    } else {
      finalHeaders['Content-Type'] = 'application/json'
      init.body = JSON.stringify(body)
    }
  }
  const response = await fetch(buildUrl(path, params), init)
  const parsed = await parseResponse(response)
  if (!response.ok) {
    const message = typeof parsed === 'string'
      ? parsed
      : parsed?.message || parsed?.error || 'No fue posible completar la solicitud'
    throw new Error(message)
  }
  return parsed
}

function normalizeCategory(category, index = 0) {
  const name = category.nombre || category.name || 'Categoría'
  const slug = toSlug(name)
  return {
    id: category.id,
    name,
    desc: category.descripcion || category.desc || '',
    icon: CATEGORY_ICONS[index % CATEGORY_ICONS.length],
    g: CATEGORY_GRADIENTS[index % CATEGORY_GRADIENTS.length],
    slug,
  }
}

function normalizeProduct(product, categoriesById = {}) {
  const category = categoriesById[product.categoriaId] || null
  const categoryName = category?.name || product.categoriaNombre || product.categoryName || product.categoria || 'General'
  const gradients = pickFrom(product.id || product.nombre || categoryName, CATEGORY_GRADIENTS)
  const price = Number(product.precio ?? product.price ?? 0)
  const finalPrice = Number(product.precioFinal ?? product.finalPrice ?? price)
  const stock = Number(product.stock ?? 0)
  const hasDiscount = finalPrice > 0 && finalPrice < price

  return {
    id: product.id,
    name: product.nombre || product.name || 'Producto',
    tagline: product.descripcion || product.tagline || categoryName,
    category: toSlug(categoryName) || product.categoriaId || 'general',
    categoryName,
    price: finalPrice,
    oldPrice: hasDiscount ? price : product.oldPrice ?? null,
    rating: product.rating ?? 4,
    reviews: product.reviews ?? 0,
    badge: product.activo === false
      ? { tone: 'neutral', label: 'Inactivo' }
      : hasDiscount
        ? { tone: 'brand', label: '- oferta' }
        : stock > 0
          ? { tone: 'mint', label: 'Disponible' }
          : null,
    g: gradients,
    stock,
    description: product.descripcion || product.tagline || '',
    features: product.activo === false ? ['Inactivo'] : ['Disponible', 'Envío rápido'],
    breadcrumbs: ['Inicio', categoryName, product.nombre || product.name || 'Producto'],
    gallery: [
      gradients,
      gradients.slice().reverse(),
      CATEGORY_GRADIENTS[(Math.abs(hashString(product.id)) + 1) % CATEGORY_GRADIENTS.length],
      CATEGORY_GRADIENTS[(Math.abs(hashString(product.id)) + 2) % CATEGORY_GRADIENTS.length],
    ],
    imageUrl: `${API_BASE_URL}/api/productos/${product.id}/foto`,
  }
}

export async function fetchHealth() {
  return request('/api/health')
}

export async function fetchCategories() {
  const categories = await request('/api/categorias')
  return categories.map((category, index) => normalizeCategory(category, index))
}

export async function fetchProducts(params = {}) {
  const [categories, products] = await Promise.all([
    fetchCategories().catch(() => []),
    request('/api/productos', { params }),
  ])
  const categoriesById = Object.fromEntries(categories.map((category) => [category.id, category]))
  return products.map((product) => normalizeProduct(product, categoriesById))
}

export async function fetchProductById(id) {
  const [categories, product] = await Promise.all([
    fetchCategories().catch(() => []),
    request(`/api/productos/${id}`),
  ])
  const categoriesById = Object.fromEntries(categories.map((category) => [category.id, category]))
  return normalizeProduct(product, categoriesById)
}

export async function fetchUsers(params = {}) {
  return request('/api/users', { params })
}

export async function createUser(payload, token) {
  return request('/api/users', { method: 'POST', body: payload, token })
}

export async function updateUser(id, payload, token) {
  return request(`/api/users/${id}`, { method: 'PUT', body: payload, token })
}

export async function fetchEstados(token) {
  return request('/api/estados', { token })
}

export async function updateOrderStatus(id, idEstado, token) {
  return request(`/api/compras/${id}`, { method: 'PUT', body: { idEstado }, token })
}

export async function fetchAddresses(token) {
  return request('/api/direcciones', { token })
}

export async function createAddress(payload, token) {
  return request('/api/direcciones', { method: 'POST', body: payload, token })
}

export async function fetchPaymentMethods(token) {
  return request('/api/metodos-pago', { token })
}

export async function fetchCarts(token) {
  return request('/api/carrito', { token })
}

export async function createCart(nombre, token) {
  return request('/api/carrito', { method: 'POST', body: { nombre }, token })
}

export async function fetchCartItems(cartId, token) {
  return request(`/api/carrito/${cartId}/items`, { token })
}

export async function addCartItem(cartId, item, token) {
  // El backend recalcula el precio final del producto; precioUnitario es requerido pero se ignora.
  return request(`/api/carrito/${cartId}/items`, {
    method: 'POST',
    body: { idProducto: item.idProducto, cantidad: item.cantidad, precioUnitario: item.precioUnitario ?? 0 },
    token,
  })
}

export async function updateCartItem(itemId, item, token) {
  return request(`/api/carrito/items/${itemId}`, {
    method: 'PUT',
    body: { idProducto: item.idProducto, cantidad: item.cantidad, precioUnitario: item.precioUnitario ?? 0 },
    token,
  })
}

export async function deleteCartItem(itemId, token) {
  return request(`/api/carrito/items/${itemId}`, { method: 'DELETE', token })
}

// Crea una compra real a partir de un carrito persistido (descuenta stock y vacía el carrito).
export async function createPurchase(cartId, payload, token) {
  return request(`/api/compras/${cartId}`, { method: 'POST', body: payload, token })
}

export async function fetchCurrentUser(token) {
  return request('/api/users/me', { token })
}

export async function updateCurrentUser(payload, token) {
  return request('/api/users/me', { method: 'PUT', body: payload, token })
}

export async function deleteCategory(id, token) {
  return request(`/api/categorias/${id}`, { method: 'DELETE', token })
}

export async function createCategory(payload, token) {
  return request('/api/categorias', { method: 'POST', body: payload, token })
}

export async function updateCategory(id, payload, token) {
  return request(`/api/categorias/${id}`, { method: 'PUT', body: payload, token })
}

export async function deleteProduct(id, token) {
  return request(`/api/productos/${id}`, { method: 'DELETE', token })
}

export async function createProduct(payload, token) {
  const form = new FormData()
  form.append('nombre', payload.nombre)
  form.append('precio', payload.precio)
  form.append('stock', payload.stock)
  if (payload.categoriaId != null && payload.categoriaId !== '') form.append('categoriaId', payload.categoriaId)
  if (payload.descripcion) form.append('descripcion', payload.descripcion)
  if (payload.descuentoPorcentaje != null && payload.descuentoPorcentaje !== '') {
    form.append('descuentoPorcentaje', payload.descuentoPorcentaje)
  }
  if (payload.descuentoInicio) form.append('descuentoInicio', payload.descuentoInicio)
  if (payload.descuentoFin) form.append('descuentoFin', payload.descuentoFin)
  if (payload.image) form.append('image', payload.image)
  return request('/api/productos', { method: 'POST', body: form, token })
}

export async function deleteUser(id, token) {
  return request(`/api/users/${id}`, { method: 'DELETE', token })
}

export async function fetchUserById(id) {
  return request(`/api/users/${id}`)
}

export async function fetchOrders() {
  return request('/api/compras')
}

export async function fetchOrderById(id) {
  return request(`/api/compras/${id}`)
}

export async function fetchOrderItems(id) {
  return request(`/api/compras/${id}/detalle`)
}

export async function login(payload) {
  return request('/api/auth/login', { method: 'POST', body: payload, headers: { Accept: 'application/json' }, token: '' })
}

export async function register(payload) {
  return request('/api/auth/register', { method: 'POST', body: payload, headers: { Accept: 'application/json' }, token: '' })
}

export async function resolveSessionFromToken(token) {
  if (!token) return null
  try {
    const user = await request('/api/users/me', { token })
    return { token, user }
  } catch {
    return { token, user: null }
  }
}

export function extractUserIdFromToken(token) {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    // El subject del token es el id del usuario (con fallback al antiguo claim userId).
    const raw = payload.sub ?? payload.userId
    const id = Number(raw)
    return Number.isInteger(id) ? id : null
  } catch {
    return null
  }
}

export async function fetchSellerProducts(token) {
  const userId = extractUserIdFromToken(token || getStoredToken())
  return request('/api/productos', { params: userId ? { usuario: userId } : undefined, token })
}

export { API_BASE_URL, buildUrl as buildApiUrl, request as apiRequest, normalizeCategory, normalizeProduct }

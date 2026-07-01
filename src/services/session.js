// Persistencia de la sesión en localStorage (token + usuario).
// Aislado en su propio módulo para que el cliente axios (http.js) y la capa de API
// puedan leer el token sin generar dependencias circulares.
const TOKEN_KEY = 'ecomerce.token'
const USER_KEY = 'ecomerce.user'

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

// Extrae el id de usuario del JWT (subject), con fallback al antiguo claim userId.
export function extractUserIdFromToken(token) {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    const raw = payload.sub ?? payload.userId
    const id = Number(raw)
    return Number.isInteger(id) ? id : null
  } catch {
    return null
  }
}

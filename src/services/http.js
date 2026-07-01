import axios from 'axios'
import { getStoredToken } from './session'

// Cliente Axios único para toda la app (requisito a.txt punto 3: "Uso de Axios para todas las peticiones HTTP").
// Centraliza baseURL, headers, inyección del token y la normalización de errores del backend.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: 'application/json' },
})

// Interceptor de request: adjunta el Bearer token a cada llamada saliente.
http.interceptors.request.use((config) => {
  // config.token === '' fuerza una petición sin auth (login/register);
  // undefined cae al token guardado en localStorage.
  const token = config.token === '' ? '' : config.token || getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // axios fija Content-Type automáticamente; para FormData lo dejamos que ponga el boundary.
  return config
})

// Interceptor de response: normaliza el error del servidor a un Error con mensaje legible,
// para que slices/thunks y componentes manejen siempre la misma forma de error.
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data
    const message =
      (typeof data === 'string' && data) ||
      data?.message ||
      data?.error ||
      error.message ||
      'No fue posible completar la solicitud'
    const normalized = new Error(message)
    // Conserva el status HTTP (si lo hay) para distinguir auth fallida (401/403)
    // de errores de red. undefined => no hubo respuesta del servidor.
    normalized.status = error.response?.status
    return Promise.reject(normalized)
  },
)

export default http

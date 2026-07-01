import { createApiThunk } from '../shared/createApiThunk'
import { createResena, fetchResenas } from '../../services/api'

// Thunks de reseñas: GET público por producto y POST (COMPRADOR) contra el backend.
export const loadResenas = createApiThunk('resenas/fetchByProduct', (productoId) => fetchResenas(productoId))
export const createResenaThunk = createApiThunk('resenas/create', (payload) => createResena(payload))

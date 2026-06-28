import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchCurrentUser,
  login,
  register,
  resolveSessionFromToken,
  updateCurrentUser,
} from '../../services/api'

// Thunks asíncronos de autenticación (separados de la definición del estado, según a.txt punto 2).

// POST /api/auth/login -> resuelve token + usuario actual.
export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const auth = await login({ email, password })
    const session = await resolveSessionFromToken(auth.accessToken)
    return session || { token: auth.accessToken, user: null }
  } catch (err) {
    return rejectWithValue(err.message || 'No fue posible iniciar sesión')
  }
})

// POST /api/auth/register -> crea la cuenta y devuelve la sesión iniciada.
export const registerUser = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const auth = await register(payload)
    const session = await resolveSessionFromToken(auth.accessToken)
    return session || { token: auth.accessToken, user: null }
  } catch (err) {
    return rejectWithValue(err.message || 'No fue posible crear la cuenta')
  }
})

// GET /api/users/me -> refresca el usuario de la sesión vigente.
export const loadCurrentUser = createAsyncThunk('auth/loadCurrentUser', async (_, { rejectWithValue }) => {
  try {
    return await fetchCurrentUser()
  } catch (err) {
    return rejectWithValue(err.message || 'No fue posible obtener el perfil')
  }
})

// PUT /api/users/me -> actualiza el perfil del usuario logueado.
export const saveProfile = createAsyncThunk('auth/saveProfile', async (payload, { rejectWithValue }) => {
  try {
    return await updateCurrentUser(payload)
  } catch (err) {
    return rejectWithValue(err.message || 'No fue posible actualizar el perfil')
  }
})

import { createSlice } from '@reduxjs/toolkit'
import { getStoredToken, getStoredUser } from '../../services/session'
import { handleAsync } from '../shared/asyncState'
import { loadCurrentUser, loginUser, registerUser, saveProfile } from './authThunks'

// Estado de sesión hidratado desde localStorage al arrancar.
// user = null            -> visitante normal (puede comprar)
// isGuest = true         -> invitado "sin cuenta" (navega pero NO puede comprar)
// user = { rol }         -> sesión iniciada (cliente / vendedor / admin)
function initialState() {
  const token = getStoredToken()
  const user = getStoredUser()
  return {
    token: token || '',
    user: user || null,
    isGuest: false,
    loading: false,
    error: null,
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState(),
  reducers: {
    // Fija la sesión a partir de un { token, user } ya resuelto.
    setSession(state, { payload }) {
      state.token = payload?.token || ''
      state.user = payload?.user || null
      state.isGuest = false
    },
    signInAsGuest(state) {
      state.token = ''
      state.user = null
      state.isGuest = true
    },
    updateUser(state, { payload }) {
      state.user = payload
      state.isGuest = false
    },
    signOut(state) {
      state.token = ''
      state.user = null
      state.isGuest = false
    },
  },
  extraReducers: (builder) => {
    const setFromSession = (state, { payload }) => {
      state.token = payload?.token || ''
      state.user = payload?.user || null
      state.isGuest = false
    }
    handleAsync(builder, loginUser, setFromSession)
    handleAsync(builder, registerUser, setFromSession)
    handleAsync(builder, loadCurrentUser, (state, { payload }) => { state.user = payload })
    handleAsync(builder, saveProfile, (state, { payload }) => { state.user = payload })
  },
})

export const { setSession, signInAsGuest, updateUser, signOut } = authSlice.actions

// Selectores: única vía de lectura del estado de auth desde componentes.
export const selectAuth = (state) => state.auth
export const selectUser = (state) => state.auth.user
export const selectToken = (state) => state.auth.token
export const selectIsGuest = (state) => state.auth.isGuest

export default authSlice.reducer

/* eslint-disable react-refresh/only-export-components */
import { useDispatch, useSelector } from 'react-redux'
import {
  selectAuth,
  setSession,
  signInAsGuest as signInAsGuestAction,
  signOut as signOutAction,
  updateUser as updateUserAction,
} from '../features/auth/authSlice'

// Compatibilidad: este hook conserva la API del antiguo AuthContext, pero ahora lee y
// escribe el estado global de Redux (useSelector/useDispatch). El estado de sesión vive
// en el slice `auth`; la persistencia en localStorage la maneja el store (subscribe).
export function useAuth() {
  const dispatch = useDispatch()
  const { user, token, isGuest } = useSelector(selectAuth)
  return {
    user: user || null,
    token: token || '',
    isGuest: isGuest === true,
    signIn: ({ token, user }) => dispatch(setSession({ token: token || '', user: user || null })),
    signInAsGuest: () => dispatch(signInAsGuestAction()),
    updateUser: (user) => dispatch(updateUserAction(user)),
    signOut: () => dispatch(signOutAction()),
  }
}

// El antiguo AuthProvider ya no es necesario (el <Provider store> de Redux lo reemplaza),
// pero lo dejamos como passthrough para no romper imports existentes.
export function AuthProvider({ children }) {
  return children
}

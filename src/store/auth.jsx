/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { clearStoredSession, getStoredToken, getStoredUser, saveStoredSession } from '../services/api'

// Estado de sesión (demo, en memoria).
// user = null            -> visitante normal (puede comprar)
// user = { guest: true } -> invitado "sin cuenta" (navega pero NO puede comprar)
// user = { role }        -> sesión iniciada (cliente / vendedor / admin)
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const token = getStoredToken()
    const user = getStoredUser()
    return token || user ? { token, user, guest: false } : null
  })

  useEffect(() => {
    saveStoredSession(session)
  }, [session])

  const value = useMemo(() => ({
    user: session?.user || null,
    token: session?.token || '',
    isGuest: session?.guest === true,
    signIn: ({ token, user }) => setSession({ token: token || '', user: user || null, guest: false }),
    signInAsGuest: () => setSession({ token: '', user: null, guest: true }),
    updateUser: (user) => setSession((current) => (current ? { ...current, user, guest: false } : { token: '', user, guest: false })),
    signOut: () => {
      clearStoredSession()
      setSession(null)
    },
  }), [session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'

// Estado de sesión (demo, en memoria).
// user = null            -> visitante normal (puede comprar)
// user = { guest: true } -> invitado "sin cuenta" (navega pero NO puede comprar)
// user = { role }        -> sesión iniciada (cliente / vendedor / admin)
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const value = useMemo(() => ({
    user,
    isGuest: user?.guest === true,
    signIn: (role) => setUser({ role, guest: false }),
    signInAsGuest: () => setUser({ role: 'invitado', guest: true }),
    signOut: () => setUser(null),
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}

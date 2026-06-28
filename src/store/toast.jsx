/* eslint-disable react-refresh/only-export-components */
import { useDispatch, useSelector } from 'react-redux'
import { notify as notifyThunk, selectToasts } from '../features/ui/toastSlice'

// Compatibilidad: devuelve la misma función `notify(message)` de antes, pero ahora
// despacha el thunk de Redux que agrega el toast y lo descarta automáticamente.
export function useToast() {
  const dispatch = useDispatch()
  return (message) => dispatch(notifyThunk(message))
}

// Render de la pila de toasts leyendo el estado global. Sustituye al ToastProvider:
// se monta una vez en la app y muestra las notificaciones del slice `toast`.
export function ToastViewport() {
  const toasts = useSelector(selectToasts)
  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className="toast">{t.message}</div>
      ))}
    </div>
  )
}

// Passthrough para no romper el import existente en main.jsx.
export function ToastProvider({ children }) {
  return (
    <>
      {children}
      <ToastViewport />
    </>
  )
}

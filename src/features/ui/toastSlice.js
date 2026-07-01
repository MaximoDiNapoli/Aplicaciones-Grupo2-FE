import { createSlice, nanoid } from '@reduxjs/toolkit'

// Notificaciones efímeras (toasts) para confirmar acciones en la UI.
const toastSlice = createSlice({
  name: 'toast',
  initialState: { items: [] },
  reducers: {
    pushToast: {
      reducer(state, { payload }) {
        state.items.push(payload)
      },
      prepare(message) {
        return { payload: { id: nanoid(), message } }
      },
    },
    removeToast(state, { payload: id }) {
      state.items = state.items.filter((t) => t.id !== id)
    },
  },
})

export const { pushToast, removeToast } = toastSlice.actions
export const selectToasts = (state) => state.toast.items

// Thunk de conveniencia: muestra un toast y lo descarta solo a los 2.6s.
// Reemplaza al antiguo `notify()` del contexto manteniendo la misma firma.
export const notify = (message) => (dispatch) => {
  const action = dispatch(pushToast(message))
  const { id } = action.payload
  setTimeout(() => dispatch(removeToast(id)), 2600)
  return id
}

export default toastSlice.reducer

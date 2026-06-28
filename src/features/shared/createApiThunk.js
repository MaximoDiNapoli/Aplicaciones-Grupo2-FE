import { createAsyncThunk } from '@reduxjs/toolkit'

// Fábrica de thunks asíncronos sobre la API (Axios).
// Unifica el manejo de errores: cualquier excepción se transforma en un payload de error
// legible vía rejectWithValue, disponible luego en `action.payload` del caso `rejected`.
//
//   export const fetchProducts = createApiThunk('products/fetchAll', api.fetchProducts)
//
// `apiFn` recibe el argumento despachado (objeto), y `thunkApi` por si se necesita getState.
export function createApiThunk(type, apiFn) {
  return createAsyncThunk(type, async (arg, thunkApi) => {
    try {
      return await apiFn(arg, thunkApi)
    } catch (err) {
      return thunkApi.rejectWithValue(err.message || 'Error de red')
    }
  })
}

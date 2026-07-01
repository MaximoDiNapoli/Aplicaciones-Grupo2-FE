// Estado asíncrono estándar compartido por todos los slices.
// Centraliza la convención { loading, error } para no duplicarla en cada feature
// (requisito a.txt: "Unificar el manejo de estados de carga, éxito y error").
export const asyncInitialState = { loading: false, error: null }

// Registra en el `builder` de extraReducers el ciclo pending/fulfilled/rejected de un thunk:
//  - pending   -> loading = true,  error = null
//  - fulfilled -> loading = false, error = null + callback opcional para volcar los datos
//  - rejected  -> loading = false, error = mensaje (desde rejectWithValue o el error nativo)
//
// Uso:
//   handleAsync(builder, fetchProducts, (state, action) => { state.items = action.payload })
export function handleAsync(builder, thunk, onFulfilled) {
  builder
    .addCase(thunk.pending, (state) => {
      state.loading = true
      state.error = null
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      if (onFulfilled) onFulfilled(state, action)
    })
    .addCase(thunk.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload || action.error?.message || 'Ocurrió un error inesperado'
    })
}

import { createApiThunk } from '../shared/createApiThunk'
import { createPaymentMethod, deletePaymentMethod, fetchPaymentMethods } from '../../services/api'

// Thunks de métodos de pago (CRUD real contra /api/metodos-pago).
export const loadMetodosPago = createApiThunk('metodosPago/fetchAll', () => fetchPaymentMethods(), {
  condition: (_, { getState }) => !getState().metodosPago.loading,
})
export const createMetodoPagoThunk = createApiThunk('metodosPago/create', (payload) => createPaymentMethod(payload))
export const deleteMetodoPagoThunk = createApiThunk('metodosPago/delete', async (id) => {
  await deletePaymentMethod(id)
  return id
})

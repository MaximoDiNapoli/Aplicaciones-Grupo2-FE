import { createApiThunk } from '../shared/createApiThunk'
import {
  createPurchase,
  fetchOrderById,
  fetchOrderItems,
  fetchOrders,
  updateOrderStatus,
} from '../../services/api'

// Thunks de compras/órdenes (GET / POST / PUT) vía Axios.
export const loadOrders = createApiThunk('orders/fetchAll', () => fetchOrders())
export const loadOrderById = createApiThunk('orders/fetchOne', (id) => fetchOrderById(id))
export const loadOrderItems = createApiThunk('orders/fetchItems', (id) => fetchOrderItems(id))
export const updateOrderStatusThunk = createApiThunk('orders/updateStatus', async ({ id, idEstado }) => {
  await updateOrderStatus(id, idEstado)
  return { id, idEstado }
})
// POST: crea la compra real a partir de un carrito persistido.
export const createPurchaseThunk = createApiThunk('orders/create', ({ cartId, payload }) => createPurchase(cartId, payload))

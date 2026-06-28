import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import AccountLayout from '../components/layout/AccountLayout'
import { StatusChip } from '../components/ui/Badge'
import { formatPrice } from '../components/ui/Misc'
import { selectOrders, selectOrdersError, selectOrdersLoading } from '../features/orders/ordersSlice'
import { loadOrders } from '../features/orders/ordersThunks'

const tabs = [
  { id: 'todos', label: 'Todos' },
  { id: 'enviado', label: 'Enviado' },
  { id: 'entregado', label: 'Entregado' },
  { id: 'procesando', label: 'Procesando' },
]

// Mis Compras: tabs de estado + tabla de órdenes (datos desde el slice `orders`).
function MyOrders() {
  const dispatch = useDispatch()
  const rawOrders = useSelector(selectOrders)
  const loading = useSelector(selectOrdersLoading)
  const error = useSelector(selectOrdersError)
  const [tab, setTab] = useState('todos')

  useEffect(() => {
    dispatch(loadOrders())
  }, [dispatch])

  const orders = useMemo(() => rawOrders.map((order) => ({
    id: order.id,
    date: order.fechaCompra ? new Date(order.fechaCompra).toLocaleDateString('es-AR') : 'Sin fecha',
    total: Number(order.total || 0),
    status: String(order.estado?.nombre || 'procesando').toLowerCase(),
  })), [rawOrders])

  const rows = useMemo(
    () => (tab === 'todos' ? orders : orders.filter((o) => o.status === tab)),
    [orders, tab],
  )

  return (
    <AccountLayout activeItem="cuenta">
      <h1 className="account__title">Mis Compras</h1>
      <p className="account__sub">Revisa el historial y estado de tus expediciones dulces.</p>

      <div className="filter-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`filter-tab${tab === t.id ? ' is-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="orders-table">
        <div className="orders-table__head">
          <span># Orden</span>
          <span>Fecha</span>
          <span>Total</span>
          <span>Estado</span>
          <span className="ta-right">Acción</span>
        </div>
        {loading && <div className="orders-table__row"><span>Cargando compras...</span></div>}
        {error && <div className="orders-table__row"><span>{error}</span></div>}
        {!loading && !error && rows.map((o) => (
          <div className="orders-table__row" key={o.id}>
            <span className="orders-table__id">#{o.id}</span>
            <span className="orders-table__muted">{o.date}</span>
            <span>{formatPrice(o.total)}</span>
            <span><StatusChip status={o.status} /></span>
            <span className="ta-right">
              <Link to={`/compras/${o.id}`} className="orders-table__link">Ver Detalle ›</Link>
            </span>
          </div>
        ))}
        {!loading && !error && rows.length === 0 && <div className="orders-table__row"><span>No hay compras para este filtro.</span></div>}
      </div>
    </AccountLayout>
  )
}

export default MyOrders

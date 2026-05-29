import { useState } from 'react'
import { Link } from 'react-router-dom'
import AccountLayout from '../components/layout/AccountLayout'
import { StatusChip } from '../components/ui/Badge'
import { formatPrice } from '../components/ui/Misc'
import { orders } from '../data/mock'

const tabs = [
  { id: 'todos', label: 'Todos' },
  { id: 'enviado', label: 'Enviado' },
  { id: 'entregado', label: 'Entregado' },
  { id: 'procesando', label: 'Procesando' },
]

// Mis Compras: tabs de estado + tabla de órdenes.
function MyOrders() {
  const [tab, setTab] = useState('todos')
  const rows = tab === 'todos' ? orders : orders.filter((o) => o.status === tab)

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
        {rows.map((o) => (
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
      </div>
    </AccountLayout>
  )
}

export default MyOrders

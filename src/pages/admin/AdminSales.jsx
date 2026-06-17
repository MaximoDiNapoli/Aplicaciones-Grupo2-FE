import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout, PageTitle, Pill, pillTone, cap } from '../../components/dashboard/shells'
import Button from '../../components/ui/Button'
import Pagination, { usePager } from '../../components/ui/Pagination'
import { formatPrice } from '../../components/ui/Misc'
import { fetchOrders } from '../../services/api'

// Gestión Global de Ventas: filtros (vendedor, método de pago) + tabla con comisión y estado.
function AdminSales() {
  const [seller, setSeller] = useState('Todos los usuarios')
  const [method, setMethod] = useState('Todos los métodos')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true

    fetchOrders()
      .then((nextOrders) => {
        if (!alive) return
        setOrders(nextOrders.map((order) => ({
          id: order.id,
          date: order.fechaCompra ? new Date(order.fechaCompra).toLocaleDateString('es-AR') : 'Sin fecha',
          customer: `Usuario #${order.idUsuario}`,
          seller: `Usuario #${order.idUsuario}`,
          total: Number(order.total || 0),
          commission: Number(order.total || 0) * 0.1,
          status: String(order.estado?.nombre || 'pendiente').toLowerCase(),
          method: order.metodoPago?.tipo || order.metodoPago?.nombre || `Método #${order.idMetodoPago || '-'}`,
        })))
        setError('')
      })
      .catch((err) => {
        if (!alive) return
        setError(err.message || 'No se pudieron cargar las ventas')
      })
      .finally(() => {
        if (alive) setLoading(false)
      })

    return () => { alive = false }
  }, [])

  const sellers = useMemo(() => ['Todos los usuarios', ...new Set(orders.map((order) => order.seller))], [orders])
  const methods = useMemo(() => ['Todos los métodos', ...new Set(orders.map((order) => order.method))], [orders])
  const clear = () => { setSeller('Todos los usuarios'); setMethod('Todos los métodos') }

  const filtered = orders.filter((s) => {
    if (seller !== 'Todos los usuarios' && s.seller !== seller) return false
    if (method !== 'Todos los métodos' && s.method !== method) return false
    return true
  })
  const { page, setPage, total, totalPages, slice, from, to } = usePager(filtered, 5, `${seller}|${method}`)

  return (
    <AdminLayout active="operaciones">
      <PageTitle title="Gestión Global de Ventas" subtitle="Monitoreo y administración de todas las transacciones de la plataforma." />

      <div className="filter-fields filter-fields--bar">
        <label className="field"><span className="field__label">Vendedor</span>
          <span className="field__control field__control--select"><select className="field__input" value={seller} onChange={(e) => setSeller(e.target.value)}>{sellers.map((s) => <option key={s}>{s}</option>)}</select></span>
        </label>
        <label className="field"><span className="field__label">Método de Pago</span>
          <span className="field__control field__control--select"><select className="field__input" value={method} onChange={(e) => setMethod(e.target.value)}>{methods.map((m) => <option key={m}>{m}</option>)}</select></span>
        </label>
        <Button variant="outline" iconLeft="refresh" className="filter-fields__btn" onClick={clear}>Limpiar</Button>
      </div>

      <div className="adm-table">
        <div className="adm-table__head" style={{ gridTemplateColumns: '0.8fr 1.4fr 1.2fr 1.3fr 1fr 1fr 1fr' }}>
          <span>Orden #</span><span>Fecha</span><span>Usuario</span><span>Método</span><span className="ta-right">Total</span><span className="ta-right">Comisión</span><span>Estado de Pago</span>
        </div>
        {loading && <div className="adm-table__empty">Cargando ventas...</div>}
        {error && <div className="adm-table__empty">{error}</div>}
        {!loading && !error && slice.map((s) => (
          <div className="adm-table__row" key={s.id} style={{ gridTemplateColumns: '0.8fr 1.4fr 1.2fr 1.3fr 1fr 1fr 1fr' }}>
            <Link className="adm-link adm-link--btn" to={`/compras/${s.id}`}>{s.id}</Link>
            <span className="adm-muted">{s.date}</span>
            <span className="adm-strong">{s.customer}</span>
            <span>{s.seller}</span>
            <span className="ta-right">{formatPrice(s.total)}</span>
            <span className="ta-right adm-link-soft">{formatPrice(s.commission)}</span>
            <span><Pill tone={pillTone(s.status)}>{cap(s.status).toUpperCase()}</Pill></span>
          </div>
        ))}
        {!loading && !error && total === 0 && <div className="adm-table__empty">No hay transacciones que coincidan con los filtros.</div>}
        <div className="adm-table__foot">
          <span className="adm-muted">Mostrando {from} a {to} de {total} transacciones</span>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminSales

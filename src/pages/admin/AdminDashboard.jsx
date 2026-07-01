import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AdminLayout, PageTitle, StatCard, Avatar, Pill, pillTone, cap } from '../../components/dashboard/shells'
import Icon from '../../components/ui/Icon'
import { formatPrice } from '../../components/ui/Misc'
import { selectOrders, selectOrdersLoading } from '../../features/orders/ordersSlice'
import { loadOrders } from '../../features/orders/ordersThunks'
import { selectUsers, selectUsersLoading } from '../../features/users/usersSlice'
import { loadUsers } from '../../features/users/usersThunks'
import { selectProducts } from '../../features/products/productsSlice'
import { loadCatalog } from '../../features/products/productsThunks'

const CATEGORY_COLORS = ['#be2c5b', '#70d6bc', '#ff8c42', '#ffd25a', '#9b6bd6']

// Panel de Control (Admin HQ): TODAS las métricas se derivan de datos reales del backend
// (compras, usuarios, productos) leídos desde los slices de Redux. Sin datos de mock.
function AdminDashboard() {
  const dispatch = useDispatch()
  const orders = useSelector(selectOrders)
  const users = useSelector(selectUsers)
  const products = useSelector(selectProducts)
  const ordersLoading = useSelector(selectOrdersLoading)
  const usersLoading = useSelector(selectUsersLoading)
  const loading = ordersLoading || usersLoading

  useEffect(() => {
    dispatch(loadOrders())
    dispatch(loadUsers())
    dispatch(loadCatalog()) // productos + categorías (una sola carga de /api/categorias)
  }, [dispatch])

  // ---- KPIs (calculados sobre las compras y usuarios reales) ----
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + Number(o.total || 0), 0), [orders])
  const pendingOrders = useMemo(
    () => orders.filter((o) => String(o.estado?.nombre || '').toLowerCase() !== 'entregado').length,
    [orders],
  )
  const avgTicket = orders.length ? totalRevenue / orders.length : 0

  const kpis = [
    { id: 'ventas', label: 'Ventas Totales', icon: 'dollar', tone: 'mint', value: loading ? '...' : formatPrice(totalRevenue), sub: `${orders.length} compras` },
    { id: 'usuarios', label: 'Usuarios Registrados', icon: 'users', tone: 'pink', value: loading ? '...' : String(users.length), sub: 'total en la plataforma' },
    { id: 'pendientes', label: 'Pedidos Pendientes', icon: 'alert', tone: 'orange', alert: pendingOrders > 0, value: loading ? '...' : String(pendingOrders), sub: 'sin entregar' },
    { id: 'ticket', label: 'Ticket Promedio', icon: 'trendUp', tone: 'mint', value: loading ? '...' : formatPrice(avgTicket), sub: 'por compra' },
  ]

  // ---- Tendencia de ventas: ingresos por mes (últimos 6 meses) desde compras reales ----
  const trend = useMemo(() => {
    const now = new Date()
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString('es-AR', { month: 'short' }), total: 0 })
    }
    const idx = Object.fromEntries(months.map((m, i) => [m.key, i]))
    orders.forEach((o) => {
      if (!o.fechaCompra) return
      const d = new Date(o.fechaCompra)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      if (key in idx) months[idx[key]].total += Number(o.total || 0)
    })
    const max = Math.max(1, ...months.map((m) => m.total))
    return months.map((m) => ({ ...m, value: Math.round((m.total / max) * 100), isTop: m.total === max && m.total > 0 }))
  }, [orders])

  // ---- Distribución de productos por categoría (desde productos reales) ----
  const byCategory = useMemo(() => {
    const counts = products.reduce((acc, p) => {
      const key = p.categoryName || 'General'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5)
    const total = entries.reduce((s, [, n]) => s + n, 0) || 1
    return entries.map(([label, n], i) => ({ id: label, label, pct: Math.round((n / total) * 100), color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }))
  }, [products])

  // ---- Actividad reciente: últimas compras reales ----
  const recentActivity = useMemo(() => orders.slice(0, 4).map((o) => ({
    id: o.id,
    user: `Usuario #${o.idUsuario}`,
    type: 'Compra registrada',
    amount: formatPrice(Number(o.total || 0)),
    status: String(o.estado?.nombre || 'pendiente').toLowerCase(),
    date: o.fechaCompra ? new Date(o.fechaCompra).toLocaleDateString('es-AR') : 'Sin fecha',
  })), [orders])

  return (
    <AdminLayout active="principal">
      <PageTitle title="Visión General" subtitle="Métricas clave y rendimiento de la tienda (datos en vivo del backend)." />

      <div className="kpi-grid kpi-grid--4">
        {kpis.map((s) => (
          <StatCard key={s.id} label={s.label} value={s.value} icon={s.icon} tone={s.tone} sub={s.sub} alert={s.alert} />
        ))}
      </div>

      <div className="chart-row">
        <section className="panel">
          <div className="panel__head"><h2 className="panel__title">Tendencia de Ventas Mensuales</h2><Icon name="dots" size={18} className="adm-muted" /></div>
          <div className="bar-chart">
            {trend.map((b) => (
              <div className="bar-chart__col" key={b.key}>
                {b.isTop && <span className="bar-chart__tip">{formatPrice(b.total)}</span>}
                <span className="bar-chart__bar" style={{ height: `${Math.max(4, b.value)}%`, background: b.isTop ? 'var(--brand)' : 'var(--pink)' }} />
                <span className="bar-chart__label">{b.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel__head"><h2 className="panel__title">Productos por Categoría</h2><Icon name="dots" size={18} className="adm-muted" /></div>
          {byCategory.length === 0 ? (
            <p className="adm-table__empty">{loading ? 'Cargando...' : 'Sin productos cargados.'}</p>
          ) : (
            <>
              <div className="donut-wrap">
                <div className="donut" style={{ background: donutGradient(byCategory) }}>
                  <div className="donut__hole"><span className="donut__num">{byCategory.length}</span><span className="donut__lbl">Categorías</span></div>
                </div>
              </div>
              <ul className="legend">
                {byCategory.map((c) => (
                  <li key={c.id}><span className="legend__dot" style={{ background: c.color }} /> {c.label} <span className="legend__pct">{c.pct}%</span></li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>

      <section className="panel">
        <div className="panel__head"><h2 className="panel__title">Actividad Reciente</h2><Link to="/admin/ventas" className="adm-link">Ver todo</Link></div>
        <div className="adm-table">
          <div className="adm-table__head" style={{ gridTemplateColumns: '1fr 1.4fr 1.3fr 1fr 1fr 1fr' }}>
            <span>ID Transacción</span><span>Cliente / Usuario</span><span>Tipo de Actividad</span><span>Monto</span><span>Estado</span><span className="ta-right">Fecha</span>
          </div>
          {loading && <div className="adm-table__empty">Cargando actividad...</div>}
          {!loading && recentActivity.length === 0 && <div className="adm-table__empty">No hay compras registradas.</div>}
          {!loading && recentActivity.map((a) => (
            <div className="adm-table__row" key={a.id} style={{ gridTemplateColumns: '1fr 1.4fr 1.3fr 1fr 1fr 1fr' }}>
              <span className="adm-muted">#{a.id}</span>
              <span className="adm-cell-user"><Avatar name={a.user} tone="pink" /> {a.user}</span>
              <span>{a.type}</span>
              <span>{a.amount}</span>
              <span><Pill tone={pillTone(a.status)}>{cap(a.status)}</Pill></span>
              <span className="adm-muted ta-right">{a.date}</span>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  )
}

function donutGradient(items) {
  let acc = 0
  const stops = items.map((it) => {
    const start = acc
    acc += it.pct
    return `${it.color} ${start}% ${acc}%`
  })
  return `conic-gradient(${stops.join(', ')})`
}

export default AdminDashboard

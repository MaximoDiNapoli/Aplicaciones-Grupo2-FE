import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { SellerLayout, PageTitle, StatCard, Avatar, Pill, pillTone, cap } from '../../components/dashboard/shells'
import Button from '../../components/ui/Button'
import { formatPrice } from '../../components/ui/Misc'
import { selectProducts, selectProductsLoading } from '../../features/products/productsSlice'
import { loadSellerProducts } from '../../features/products/productsThunks'
import { selectOrders, selectOrdersLoading } from '../../features/orders/ordersSlice'
import { loadOrders } from '../../features/orders/ordersThunks'

// Panel de Control del vendedor: KPIs + órdenes recientes (slices `products` y `orders`).
function SellerDashboard() {
  const dispatch = useDispatch()
  const products = useSelector(selectProducts)
  const rawOrders = useSelector(selectOrders)
  const productsLoading = useSelector(selectProductsLoading)
  const ordersLoading = useSelector(selectOrdersLoading)
  const loading = productsLoading || ordersLoading

  useEffect(() => {
    dispatch(loadSellerProducts())
    dispatch(loadOrders())
  }, [dispatch])

  const orders = useMemo(() => rawOrders.map((order) => ({
    id: order.id,
    customer: `Usuario #${order.idUsuario}`,
    total: Number(order.total || 0),
    status: String(order.estado?.nombre || 'pendiente').toLowerCase(),
    date: order.fechaCompra ? new Date(order.fechaCompra).toLocaleDateString('es-AR') : 'Sin fecha',
  })), [rawOrders])

  const publishedProducts = products.filter((product) => product.stock > 0).length
  const totalStock = products.reduce((sum, product) => sum + (product.stock || 0), 0)
  const recentOrders = orders.slice(0, 5)
  const pendingOrders = orders.filter((order) => !['entregado', 'entregada', 'cancelado', 'cancelada'].includes(order.status)).length

  return (
    <SellerLayout active="panel">
      <PageTitle title="Hola, Vendedor" subtitle="Aquí está el resumen de tu actividad de hoy." />

      <div className="kpi-grid kpi-grid--3">
        <StatCard label="PRODUCTOS PUBLICADOS" value={loading ? '...' : String(publishedProducts)} icon="inventory" delta="Backend" />
        <StatCard label="ÓRDENES PENDIENTES" value={loading ? '...' : String(pendingOrders)} icon="alert" note="Requieren atención" alert />
        <StatCard label="STOCK TOTAL" value={loading ? '...' : String(totalStock)} icon="receipt" note="Inventario real" tone="pink" />
      </div>

      <section className="panel">
        <div className="panel__head">
          <h2 className="panel__title">Órdenes recientes</h2>
        </div>
        <div className="adm-table adm-table--seller">
          <div className="adm-table__head" style={{ gridTemplateColumns: '1fr 1.4fr 1fr 1fr 1.3fr 1fr' }}>
            <span># Orden</span><span>Cliente</span><span className="ta-right">Total</span><span>Estado</span><span>Fecha</span><span className="ta-right">Acción</span>
          </div>
          {loading && <div className="adm-table__empty">Cargando órdenes...</div>}
          {!loading && recentOrders.map((o) => (
            <div className="adm-table__row" key={o.id} style={{ gridTemplateColumns: '1fr 1.4fr 1fr 1fr 1.3fr 1fr' }}>
              <Link to={`/vendedor/ventas/${o.id}`} className="adm-link">#{o.id}</Link>
              <span className="adm-cell-user"><Avatar name={o.customer} /> {o.customer}</span>
              <span className="ta-right">{formatPrice(o.total)}</span>
              <span><Pill tone={pillTone(o.status)}>{cap(o.status)}</Pill></span>
              <span className="adm-muted">{o.date}</span>
              <Link to={`/vendedor/ventas/${o.id}`} className="adm-link ta-right">Ver detalle</Link>
            </div>
          ))}
          {!loading && recentOrders.length === 0 && <div className="adm-table__empty">Todavía no tenés órdenes con tus productos.</div>}
          <div className="panel__foot">
            <Button to="/vendedor/ventas" variant="outline" iconRight="arrowRight">Ver todas mis órdenes</Button>
          </div>
        </div>
      </section>
    </SellerLayout>
  )
}

export default SellerDashboard

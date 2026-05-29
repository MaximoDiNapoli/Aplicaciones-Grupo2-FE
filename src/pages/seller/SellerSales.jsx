import { Link } from 'react-router-dom'
import { SellerLayout, PageTitle, StatCard, Pill, pillTone, cap } from '../../components/dashboard/shells'
import Icon from '../../components/ui/Icon'
import Pagination, { usePager } from '../../components/ui/Pagination'
import { formatPrice } from '../../components/ui/Misc'
import { sellerSales } from '../../data/mock'

// Mis Ventas (vendedor): KPIs + buscador/filtros + tabla de órdenes.
function SellerSales() {
  const { page, setPage, total, totalPages, slice, from, to } = usePager(sellerSales.rows, 5)
  return (
    <SellerLayout active="ventas">
      <PageTitle title="Mis Ventas" subtitle="Gestiona y da seguimiento a las ventas de tu tienda." />

      <div className="kpi-grid kpi-grid--2">
        <StatCard label="TOTAL DE ÓRDENES" value={sellerSales.totalOrders.toLocaleString('es-MX')} icon="receipt" tone="mint" />
        <StatCard label="TOTAL DE INGRESOS" value={formatPrice(sellerSales.totalRevenue)} icon="dollar" tone="orange" />
      </div>

      <div className="search-toolbar">
        <span className="search-toolbar__search">
          <Icon name="search" size={18} strokeFill />
          <input placeholder="Buscar por cliente o # orden..." />
        </span>
        <button className="select-btn">Todos los Estados <Icon name="arrowRight" size={14} strokeFill style={{ transform: 'rotate(90deg)' }} /></button>
        <button className="select-btn"><Icon name="calendar" size={16} strokeFill /> Rango de Fechas</button>
      </div>

      <div className="adm-table">
        <div className="adm-table__head" style={{ gridTemplateColumns: '1fr 1.4fr 0.7fr 1fr 1fr 1.1fr 0.8fr' }}>
          <span># Orden</span><span>Cliente</span><span className="ta-right">Items</span><span className="ta-right">Total</span><span>Estado</span><span>Fecha</span><span className="ta-right">Acciones</span>
        </div>
        {slice.map((o) => (
          <div className="adm-table__row" key={o.id} style={{ gridTemplateColumns: '1fr 1.4fr 0.7fr 1fr 1fr 1.1fr 0.8fr' }}>
            <Link to={`/vendedor/ventas/${o.id}`} className="adm-link">#{o.id}</Link>
            <span className="adm-strong">{o.customer}</span>
            <span className="ta-right">{o.items}</span>
            <span className="ta-right">{formatPrice(o.total)}</span>
            <span><Pill tone={pillTone(o.status)}>{cap(o.status)}</Pill></span>
            <span className="adm-muted">{o.date}</span>
            <Link to={`/vendedor/ventas/${o.id}`} className="icon-action ta-right" aria-label="Ver"><Icon name="eye" size={18} strokeFill /></Link>
          </div>
        ))}
        <div className="adm-table__foot">
          <span className="adm-muted">Mostrando {from} a {to} de {total} resultados</span>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </SellerLayout>
  )
}

export default SellerSales

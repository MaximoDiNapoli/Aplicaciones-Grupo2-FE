import { Link } from 'react-router-dom'
import { SellerLayout, PageTitle, StatCard, Avatar, Pill, pillTone, cap } from '../../components/dashboard/shells'
import Button from '../../components/ui/Button'
import { formatPrice } from '../../components/ui/Misc'
import { sellerRecentOrders } from '../../data/mock'

// Panel de Control del vendedor: KPIs + órdenes recientes.
function SellerDashboard() {
  return (
    <SellerLayout active="panel">
      <PageTitle title="Hola, Vendedor" subtitle="Aquí está el resumen de tu actividad de hoy." />

      <div className="kpi-grid kpi-grid--3">
        <StatCard label="PRODUCTOS PUBLICADOS" value="24" icon="inventory" delta="+12%" />
        <StatCard label="ÓRDENES PENDIENTES" value="5" icon="alert" note="Requieren atención" alert />
        <StatCard label="ÓRDENES TOTALES" value="1,284" icon="receipt" note="Este mes" tone="pink" />
      </div>

      <section className="panel">
        <div className="panel__head">
          <h2 className="panel__title">Órdenes recientes</h2>
        </div>
        <div className="adm-table adm-table--seller">
          <div className="adm-table__head" style={{ gridTemplateColumns: '1fr 1.4fr 1fr 1fr 1.3fr 1fr' }}>
            <span># Orden</span><span>Cliente</span><span className="ta-right">Total</span><span>Estado</span><span>Fecha</span><span className="ta-right">Acción</span>
          </div>
          {sellerRecentOrders.map((o) => (
            <div className="adm-table__row" key={o.id} style={{ gridTemplateColumns: '1fr 1.4fr 1fr 1fr 1.3fr 1fr' }}>
              <Link to={`/vendedor/ventas/${o.id}`} className="adm-link">#{o.id}</Link>
              <span className="adm-cell-user"><Avatar name={o.customer} /> {o.customer}</span>
              <span className="ta-right">{formatPrice(o.total)}</span>
              <span><Pill tone={pillTone(o.status)}>{cap(o.status)}</Pill></span>
              <span className="adm-muted">{o.date}</span>
              <Link to={`/vendedor/ventas/${o.id}`} className="adm-link ta-right">Ver detalle</Link>
            </div>
          ))}
          <div className="panel__foot">
            <Button to="/vendedor/ventas" variant="outline" iconRight="arrowRight">Ver todas mis órdenes</Button>
          </div>
        </div>
      </section>
    </SellerLayout>
  )
}

export default SellerDashboard

import { Link } from 'react-router-dom'
import { AdminLayout, PageTitle, StatCard, Avatar, Pill, pillTone, cap } from '../../components/dashboard/shells'
import Icon from '../../components/ui/Icon'
import { adminStats, adminSalesTrend, adminSalesByCategory, adminActivity } from '../../data/mock'

// Panel de Control (Admin HQ): KPIs + gráfico de tendencia + ventas por categoría + actividad.
function AdminDashboard() {
  return (
    <AdminLayout active="principal">
      <PageTitle title="Visión General" subtitle="Métricas clave y rendimiento de la tienda." />

      <div className="kpi-grid kpi-grid--4">
        {adminStats.map((s) => (
          <StatCard key={s.id} {...s} note={s.note || (s.sub ? '' : undefined)} delta={s.delta} deltaTone={s.deltaTone} />
        ))}
      </div>

      <div className="chart-row">
        <section className="panel">
          <div className="panel__head"><h2 className="panel__title">Tendencia de Ventas Mensuales</h2><Icon name="dots" size={18} className="adm-muted" /></div>
          <div className="bar-chart">
            {adminSalesTrend.map((b) => (
              <div className="bar-chart__col" key={b.label}>
                {b.top && <span className="bar-chart__tip">{b.top}</span>}
                <span className="bar-chart__bar" style={{ height: `${b.value}%`, background: b.top ? 'var(--brand)' : 'var(--pink)' }} />
                <span className="bar-chart__label">{b.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel__head"><h2 className="panel__title">Ventas por Categoría</h2><Icon name="dots" size={18} className="adm-muted" /></div>
          <div className="donut-wrap">
            <div className="donut" style={{ background: donutGradient(adminSalesByCategory) }}>
              <div className="donut__hole"><span className="donut__num">3</span><span className="donut__lbl">Categorías</span></div>
            </div>
          </div>
          <ul className="legend">
            {adminSalesByCategory.map((c) => (
              <li key={c.id}><span className="legend__dot" style={{ background: c.color }} /> {c.label} <span className="legend__pct">{c.pct}%</span></li>
            ))}
          </ul>
        </section>
      </div>

      <section className="panel">
        <div className="panel__head"><h2 className="panel__title">Actividad Reciente</h2><Link to="/admin/ventas" className="adm-link">Ver todo</Link></div>
        <div className="adm-table">
          <div className="adm-table__head" style={{ gridTemplateColumns: '1fr 1.4fr 1.3fr 1fr 1fr 1fr' }}>
            <span>ID Transacción</span><span>Cliente / Usuario</span><span>Tipo de Actividad</span><span>Monto</span><span>Estado</span><span className="ta-right">Fecha</span>
          </div>
          {adminActivity.map((a) => (
            <div className="adm-table__row" key={a.id} style={{ gridTemplateColumns: '1fr 1.4fr 1.3fr 1fr 1fr 1fr' }}>
              <span className="adm-muted">#{a.id}</span>
              <span className="adm-cell-user"><Avatar name={a.user} tone={a.id === '8902' ? 'pink' : a.id === '1045' ? 'mint' : 'orange'} /> {a.user}</span>
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

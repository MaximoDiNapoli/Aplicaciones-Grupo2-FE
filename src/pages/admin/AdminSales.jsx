import { AdminLayout, PageTitle, Pill, pillTone, cap } from '../../components/dashboard/shells'
import Button from '../../components/ui/Button'
import Icon from '../../components/ui/Icon'
import { formatPrice } from '../../components/ui/Misc'
import { adminGlobalSales } from '../../data/mock'

// Gestión Global de Ventas: filtros + tabla con comisión y estado de pago.
function AdminSales() {
  return (
    <AdminLayout active="operaciones">
      <PageTitle title="Gestión Global de Ventas" subtitle="Monitoreo y administración de todas las transacciones de la plataforma." />

      <div className="filter-fields filter-fields--bar">
        <label className="field"><span className="field__label">Rango de Fechas</span>
          <span className="field__control field__control--icon"><Icon name="calendar" size={18} strokeFill className="field__icon" /><input className="field__input" placeholder="Últimos 30 días" /></span>
        </label>
        <label className="field"><span className="field__label">Vendedor</span>
          <span className="field__control field__control--select"><select className="field__input"><option>Todos los vendedores</option></select></span>
        </label>
        <label className="field"><span className="field__label">Método de Pago</span>
          <span className="field__control field__control--select"><select className="field__input"><option>Todos los métodos</option></select></span>
        </label>
        <Button iconLeft="filter" className="filter-fields__btn">Filtrar</Button>
      </div>

      <div className="adm-table">
        <div className="adm-table__head" style={{ gridTemplateColumns: '0.8fr 1.4fr 1.2fr 1.3fr 1fr 1fr 1fr' }}>
          <span>Orden #</span><span>Fecha</span><span>Cliente</span><span>Vendedor</span><span className="ta-right">Total</span><span className="ta-right">Comisión</span><span>Estado de Pago</span>
        </div>
        {adminGlobalSales.map((s) => (
          <div className="adm-table__row" key={s.id} style={{ gridTemplateColumns: '0.8fr 1.4fr 1.2fr 1.3fr 1fr 1fr 1fr' }}>
            <a className="adm-link">{s.id}</a>
            <span className="adm-muted">{s.date}</span>
            <span className="adm-strong">{s.customer}</span>
            <span>{s.seller}</span>
            <span className="ta-right">{formatPrice(s.total)}</span>
            <span className="ta-right adm-link-soft">{formatPrice(s.commission)}</span>
            <span><Pill tone={pillTone(s.status)}>{cap(s.status).toUpperCase()}</Pill></span>
          </div>
        ))}
        <div className="adm-table__foot">
          <span className="adm-muted">Mostrando 1 a 4 de 248 transacciones</span>
          <div className="pagination">
            <button className="pagination__item">‹</button>
            <button className="pagination__item is-active">1</button>
            <button className="pagination__item">2</button>
            <button className="pagination__item">3</button>
            <button className="pagination__item">›</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminSales

import { useState } from 'react'
import { AdminLayout, PageTitle, Pill, pillTone, cap } from '../../components/dashboard/shells'
import Button from '../../components/ui/Button'
import Pagination, { usePager } from '../../components/ui/Pagination'
import { formatPrice } from '../../components/ui/Misc'
import { useToast } from '../../store/toast'
import { adminGlobalSales } from '../../data/mock'

const sellers = ['Todos los vendedores', ...new Set(adminGlobalSales.map((s) => s.seller))]
const methods = ['Todos los métodos', 'Tarjeta', 'PayPal', 'Transferencia']

// Gestión Global de Ventas: filtros (vendedor, método de pago) + tabla con comisión y estado.
function AdminSales() {
  const notify = useToast()
  const [seller, setSeller] = useState('Todos los vendedores')
  const [method, setMethod] = useState('Todos los métodos')
  const clear = () => { setSeller('Todos los vendedores'); setMethod('Todos los métodos') }

  const filtered = adminGlobalSales.filter((s) => {
    if (seller !== 'Todos los vendedores' && s.seller !== seller) return false
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
          <span>Orden #</span><span>Fecha</span><span>Cliente</span><span>Vendedor</span><span className="ta-right">Total</span><span className="ta-right">Comisión</span><span>Estado de Pago</span>
        </div>
        {slice.map((s) => (
          <div className="adm-table__row" key={s.id} style={{ gridTemplateColumns: '0.8fr 1.4fr 1.2fr 1.3fr 1fr 1fr 1fr' }}>
            <button type="button" className="adm-link adm-link--btn" onClick={() => notify(`Detalle de la transacción #${s.id} (demo)`)}>{s.id}</button>
            <span className="adm-muted">{s.date}</span>
            <span className="adm-strong">{s.customer}</span>
            <span>{s.seller}</span>
            <span className="ta-right">{formatPrice(s.total)}</span>
            <span className="ta-right adm-link-soft">{formatPrice(s.commission)}</span>
            <span><Pill tone={pillTone(s.status)}>{cap(s.status).toUpperCase()}</Pill></span>
          </div>
        ))}
        {total === 0 && <div className="adm-table__empty">No hay transacciones que coincidan con los filtros.</div>}
        <div className="adm-table__foot">
          <span className="adm-muted">Mostrando {from} a {to} de {total} transacciones</span>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminSales

import { useState } from 'react'
import { AdminLayout, PageTitle, Pill, pillTone, cap } from '../../components/dashboard/shells'
import ProductImage from '../../components/product/ProductImage'
import Icon from '../../components/ui/Icon'
import Pagination, { usePager } from '../../components/ui/Pagination'
import { formatPrice } from '../../components/ui/Misc'
import { useToast } from '../../store/toast'
import { adminProducts } from '../../data/mock'

const cats = ['Todas las Categorías', ...new Set(adminProducts.map((p) => p.category))]

// Catálogo Global de Productos (admin): busca/filtra y modera inventario de vendedores.
function AdminProducts() {
  const notify = useToast()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('Todas las Categorías')
  const [status, setStatus] = useState('Todos los Estados')
  const [stock, setStock] = useState('Stock')

  const filtered = adminProducts.filter((p) => {
    const text = `${p.name} ${p.sku} ${p.seller}`.toLowerCase()
    if (q && !text.includes(q.toLowerCase())) return false
    if (cat !== 'Todas las Categorías' && p.category !== cat) return false
    if (status !== 'Todos los Estados' && p.status !== status.toLowerCase()) return false
    if (stock !== 'Stock' && p.stock !== stock) return false
    return true
  })
  const { page, setPage, total, totalPages, slice, from, to } = usePager(filtered, 4, `${q}|${cat}|${status}|${stock}`)

  return (
    <AdminLayout active="catalogo">
      <PageTitle title="Catálogo de Productos" subtitle="Gestiona y modera el inventario global de vendedores." />

      <div className="search-toolbar">
        <span className="search-toolbar__search">
          <Icon name="search" size={18} strokeFill />
          <input placeholder="Buscar por nombre, SKU o vendedor..." value={q} onChange={(e) => setQ(e.target.value)} />
        </span>
        <select className="select-pill" value={cat} onChange={(e) => setCat(e.target.value)}>
          {cats.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="select-pill" value={status} onChange={(e) => setStatus(e.target.value)}>
          {['Todos los Estados', 'Publicado', 'Pendiente'].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="select-pill" value={stock} onChange={(e) => setStock(e.target.value)}>
          {['Stock', 'En stock', 'Bajo', 'Agotado'].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="adm-table">
        <div className="adm-table__head" style={{ gridTemplateColumns: '2fr 1fr 1.3fr 0.8fr 1fr 0.8fr' }}>
          <span>Producto</span><span>Categoría</span><span>Vendedor</span><span className="ta-right">Precio</span><span>Estado</span><span className="ta-right">Acciones</span>
        </div>
        {slice.map((p) => (
          <div className="adm-table__row" key={p.id} style={{ gridTemplateColumns: '2fr 1fr 1.3fr 0.8fr 1fr 0.8fr' }}>
            <span className="adm-cell-user">
              <ProductImage g={p.g} className="adm-thumb" />
              <span><span className="adm-strong">{p.name}</span><br /><span className="adm-mono">SKU: {p.sku}</span></span>
            </span>
            <span className="adm-muted">{p.category}</span>
            <span><span className="seller-dot" /> {p.seller}</span>
            <span className="ta-right">{formatPrice(p.price)}</span>
            <span><Pill tone={pillTone(p.status)}>{cap(p.status)}</Pill></span>
            <span className="adm-actions ta-right"><button className="icon-action" aria-label="Ver" onClick={() => notify(`Ver "${p.name}" (demo)`)}><Icon name="eye" size={18} strokeFill /></button></span>
          </div>
        ))}
        {total === 0 && <div className="adm-table__empty">No hay productos que coincidan con los filtros.</div>}
        <div className="adm-table__foot">
          <span className="adm-muted">Mostrando {from} - {to} de {total} productos</span>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminProducts

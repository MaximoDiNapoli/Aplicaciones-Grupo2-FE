import { AdminLayout, PageTitle, Pill, pillTone, cap } from '../../components/dashboard/shells'
import ProductImage from '../../components/product/ProductImage'
import Icon from '../../components/ui/Icon'
import Pagination, { usePager } from '../../components/ui/Pagination'
import { formatPrice } from '../../components/ui/Misc'
import { adminProducts } from '../../data/mock'

// Catálogo Global de Productos (admin): busca/filtra y modera inventario de vendedores.
function AdminProducts() {
  const { page, setPage, total, totalPages, slice, from, to } = usePager(adminProducts, 4)
  return (
    <AdminLayout active="catalogo">
      <PageTitle title="Catálogo de Productos" subtitle="Gestiona y modera el inventario global de vendedores." />

      <div className="search-toolbar">
        <span className="search-toolbar__search">
          <Icon name="search" size={18} strokeFill />
          <input placeholder="Buscar por nombre, SKU o vendedor..." />
        </span>
        <button className="select-btn">Todas las Categorías <Icon name="arrowRight" size={14} strokeFill style={{ transform: 'rotate(90deg)' }} /></button>
        <button className="select-btn">Todos los Estados <Icon name="arrowRight" size={14} strokeFill style={{ transform: 'rotate(90deg)' }} /></button>
        <button className="select-btn">Stock <Icon name="arrowRight" size={14} strokeFill style={{ transform: 'rotate(90deg)' }} /></button>
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
            <span className="adm-actions ta-right"><button className="icon-action"><Icon name="eye" size={18} strokeFill /></button></span>
          </div>
        ))}
        <div className="adm-table__foot">
          <span className="adm-muted">Mostrando {from} - {to} de {total} productos</span>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminProducts

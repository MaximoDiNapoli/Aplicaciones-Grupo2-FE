import { Link, useNavigate } from 'react-router-dom'
import { SellerLayout, PageTitle, Pill, pillTone, cap } from '../../components/dashboard/shells'
import ProductImage from '../../components/product/ProductImage'
import Icon from '../../components/ui/Icon'
import Pagination, { usePager } from '../../components/ui/Pagination'
import { formatPrice } from '../../components/ui/Misc'
import { sellerProducts } from '../../data/mock'

// Mis Productos (inventario). Flujo unificado: listado + CTA flotante "Crear Nuevo Producto"
// que lleva a la pantalla de creación separada (corrección de la profesora #6).
function SellerProducts() {
  const navigate = useNavigate()
  const { page, setPage, total, totalPages, slice, from, to } = usePager(sellerProducts, 5)
  return (
    <SellerLayout active="inventario">
      <PageTitle title="Mis Productos" subtitle="Gestiona el inventario, precios y disponibilidad de tus artículos." />

      <div className="search-toolbar">
        <span className="search-toolbar__search">
          <Icon name="search" size={18} strokeFill />
          <input placeholder="Filtrar por nombre de producto..." />
        </span>
        <button className="select-btn">Categoría: Todas <Icon name="arrowRight" size={14} strokeFill style={{ transform: 'rotate(90deg)' }} /></button>
        <button className="select-btn">Estado: Todos <Icon name="arrowRight" size={14} strokeFill style={{ transform: 'rotate(90deg)' }} /></button>
        <button className="icon-square"><Icon name="sliders" size={18} /></button>
      </div>

      <div className="adm-table">
        <div className="adm-table__head" style={{ gridTemplateColumns: '70px 1.6fr 1fr 0.8fr 1.1fr 0.9fr 0.9fr' }}>
          <span>Foto</span><span>Nombre</span><span>Categoría</span><span>Precio</span><span>Rendimiento</span><span>Estado</span><span className="ta-right">Acciones</span>
        </div>
        {slice.map((p) => (
          <div className="adm-table__row" key={p.id} style={{ gridTemplateColumns: '70px 1.6fr 1fr 0.8fr 1.1fr 0.9fr 0.9fr' }}>
            <ProductImage g={p.g} className="adm-thumb" />
            <span className="adm-strong">{p.name}</span>
            <span className="adm-muted">{p.category}</span>
            <span>{formatPrice(p.price)}</span>
            <span><span className="perf-chip"><Icon name="receipt" size={13} strokeFill /> Vendidos: {p.sold.toLocaleString('es-MX')}</span></span>
            <span><Pill tone={pillTone(p.status)}>{cap(p.status)}</Pill></span>
            <span className="adm-actions ta-right">
              <Link to={`/vendedor/inventario/${p.id}`} className="icon-action" aria-label="Ver"><Icon name="eye" size={18} strokeFill /></Link>
              <button className="icon-action" aria-label="Editar"><Icon name="pencil" size={17} strokeFill /></button>
            </span>
          </div>
        ))}
        <div className="adm-table__foot">
          <span className="adm-muted">Mostrando {from} a {to} de {total} productos</span>
          <Pagination variant="mini" page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>

      <button className="floating-cta" onClick={() => navigate('/vendedor/inventario/nuevo')}>
        <Icon name="plus" size={20} strokeFill /> Crear Nuevo Producto
      </button>
    </SellerLayout>
  )
}

export default SellerProducts

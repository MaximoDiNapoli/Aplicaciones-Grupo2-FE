import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { SellerLayout, PageTitle, Pill, pillTone, cap } from '../../components/dashboard/shells'
import ProductImage from '../../components/product/ProductImage'
import Icon from '../../components/ui/Icon'
import Pagination, { usePager } from '../../components/ui/Pagination'
import { formatPrice } from '../../components/ui/Misc'
import {
  selectProducts,
  selectProductsError,
  selectProductsLoading,
} from '../../features/products/productsSlice'
import { loadSellerProducts } from '../../features/products/productsThunks'

// Mis Productos (inventario). Flujo unificado: listado + CTA flotante "Crear Nuevo Producto"
// que lleva a la pantalla de creación separada. Inventario desde el slice `products`.
function SellerProducts() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const rawProducts = useSelector(selectProducts)
  const loading = useSelector(selectProductsLoading)
  const error = useSelector(selectProductsError)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('Todas')
  const [status, setStatus] = useState('Todos')

  useEffect(() => {
    dispatch(loadSellerProducts())
  }, [dispatch])

  const products = useMemo(() => rawProducts.map((product) => ({
    ...product,
    category: product.categoryName,
    sold: Math.max(0, product.stock * 2),
    status: product.stock > 0 ? 'Activo' : 'Inactivo',
  })), [rawProducts])

  const productCats = useMemo(() => ['Todas', ...new Set(products.map((p) => p.category))], [products])

  const filtered = products.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false
    if (cat !== 'Todas' && p.category !== cat) return false
    if (status !== 'Todos' && p.status !== status.toLowerCase()) return false
    return true
  })
  const { page, setPage, total, totalPages, slice, from, to } = usePager(filtered, 5, `${q}|${cat}|${status}`)

  return (
    <SellerLayout active="inventario">
      <PageTitle title="Mis Productos" subtitle="Gestiona el inventario, precios y disponibilidad de tus artículos." />

      <div className="search-toolbar">
        <span className="search-toolbar__search">
          <Icon name="search" size={18} strokeFill />
          <input placeholder="Filtrar por nombre de producto..." value={q} onChange={(e) => setQ(e.target.value)} />
        </span>
        <select className="select-pill" value={cat} onChange={(e) => setCat(e.target.value)}>
          {productCats.map((c) => <option key={c} value={c}>{c === 'Todas' ? 'Categoría: Todas' : c}</option>)}
        </select>
        <select className="select-pill" value={status} onChange={(e) => setStatus(e.target.value)}>
          {['Todos', 'Activo', 'Inactivo'].map((s) => <option key={s} value={s}>{s === 'Todos' ? 'Estado: Todos' : s}</option>)}
        </select>
      </div>

      <div className="adm-table">
        <div className="adm-table__head" style={{ gridTemplateColumns: '70px 1.6fr 1fr 0.8fr 1.1fr 0.9fr 0.9fr' }}>
          <span>Foto</span><span>Nombre</span><span>Categoría</span><span>Precio</span><span>Stock</span><span>Estado</span><span className="ta-right">Acciones</span>
        </div>
        {loading && <div className="adm-table__empty">Cargando inventario...</div>}
        {error && <div className="adm-table__empty">{error}</div>}
        {!loading && !error && slice.map((p) => (
          <div className="adm-table__row" key={p.id} style={{ gridTemplateColumns: '70px 1.6fr 1fr 0.8fr 1.1fr 0.9fr 0.9fr' }}>
            <ProductImage g={p.g} className="adm-thumb" />
            <span className="adm-strong">{p.name}</span>
            <span className="adm-muted">{p.category}</span>
            <span>{formatPrice(p.price)}</span>
            <span><span className="perf-chip"><Icon name="receipt" size={13} strokeFill /> Stock: {p.stock.toLocaleString('es-MX')}</span></span>
            <span><Pill tone={pillTone(p.status)}>{cap(p.status)}</Pill></span>
            <span className="adm-actions ta-right">
              <Link to={`/vendedor/inventario/${p.id}`} className="icon-action" aria-label="Ver"><Icon name="eye" size={18} strokeFill /></Link>
              <button className="icon-action" aria-label="Editar" onClick={() => navigate('/vendedor/inventario/nuevo')}><Icon name="pencil" size={17} strokeFill /></button>
            </span>
          </div>
        ))}
        {!loading && !error && total === 0 && <div className="adm-table__empty">No hay productos que coincidan con los filtros.</div>}
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

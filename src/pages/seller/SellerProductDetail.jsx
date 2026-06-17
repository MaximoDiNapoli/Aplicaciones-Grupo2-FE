import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { SellerLayout, Pill, pillTone, cap } from '../../components/dashboard/shells'
import ProductImage from '../../components/product/ProductImage'
import Button from '../../components/ui/Button'
import Icon from '../../components/ui/Icon'
import { formatPrice } from '../../components/ui/Misc'
import { useToast } from '../../store/toast'
import { fetchProductById, deleteProduct } from '../../services/api'

// Detalle de Producto (vendedor): datos reales del backend + baja lógica.
function SellerProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const notify = useToast()
  const [product, setProduct] = useState(null)
  const [active, setActive] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true

    fetchProductById(id)
      .then((next) => { if (alive) { setProduct(next); setError('') } })
      .catch((err) => { if (alive) setError(err.message || 'No se pudo cargar el producto') })
      .finally(() => { if (alive) setLoading(false) })

    return () => { alive = false }
  }, [id])

  const remove = async () => {
    try {
      await deleteProduct(id)
      notify('Producto eliminado')
      navigate('/vendedor/inventario')
    } catch (err) {
      notify(err.message || 'No se pudo eliminar el producto')
    }
  }

  if (loading) {
    return <SellerLayout active="inventario"><p className="adm-table__empty">Cargando producto...</p></SellerLayout>
  }
  if (error || !product) {
    return <SellerLayout active="inventario"><p className="adm-table__empty">{error || 'Producto no encontrado.'}</p></SellerLayout>
  }

  const status = product.stock > 0 ? 'disponible' : 'agotado'
  const hasDiscount = product.oldPrice && product.oldPrice > product.price
  const discount = hasDiscount ? Math.round((1 - product.price / product.oldPrice) * 100) : 0
  const gallery = product.gallery || [product.g]

  return (
    <SellerLayout active="inventario">
      <div className="dash-pagetitle dash-pagetitle--form">
        <div>
          <nav className="crumbs"><Link to="/vendedor/inventario"><Icon name="arrowLeft" size={13} strokeFill /> Volver al inventario</Link></nav>
          <h1 className="dash-pagetitle__title">{product.name} <Pill tone={pillTone(status)}>{cap(status)}</Pill></h1>
        </div>
        <div className="dash-pagetitle__actions">
          <Button variant="outline" iconLeft="trash" onClick={remove}>Eliminar</Button>
        </div>
      </div>

      <div className="spd-grid">
        <div className="spd-main">
          <ProductImage g={gallery[active]} className="spd-main__img" />
          <div className="spd-thumbs">
            {gallery.map((g, i) => (
              <button key={i} className={`spd-thumb${i === active ? ' is-active' : ''}`} onClick={() => setActive(i)}>
                <ProductImage g={g} radius="8px" />
              </button>
            ))}
          </div>
          <section className="form-card spd-desc">
            <h2 className="form-card__title">Descripción</h2>
            <p className="spd-desc__text">{product.description || 'Sin descripción.'}</p>
          </section>
        </div>

        <aside className="spd-side">
          <section className="form-card">
            <h2 className="form-card__title">Estructura de Precio</h2>
            {hasDiscount && <div className="spd-line"><span>Precio Base</span><span className="adm-muted" style={{ textDecoration: 'line-through' }}>{formatPrice(product.oldPrice)}</span></div>}
            {hasDiscount && <div className="spd-line"><span>Descuento</span><Pill tone="brand">{discount}%</Pill></div>}
            <div className="spd-line spd-line--final"><span>Precio Final</span><span className="spd-final">{formatPrice(product.price)}</span></div>
          </section>
          <section className="form-card">
            <h2 className="form-card__title">Detalles del Inventario</h2>
            <div className="spd-line"><span className="adm-muted">CATEGORÍA</span><span>{product.categoryName}</span></div>
            <div className="spd-line"><span className="adm-muted">STOCK</span><span>{product.stock}</span></div>
          </section>
        </aside>
      </div>
    </SellerLayout>
  )
}

export default SellerProductDetail

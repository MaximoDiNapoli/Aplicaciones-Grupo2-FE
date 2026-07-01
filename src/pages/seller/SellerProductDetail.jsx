import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { SellerLayout, Pill, pillTone, cap } from '../../components/dashboard/shells'
import ProductImage from '../../components/product/ProductImage'
import Button from '../../components/ui/Button'
import Icon from '../../components/ui/Icon'
import { formatPrice } from '../../components/ui/Misc'
import { notify } from '../../features/ui/toastSlice'
import { selectCurrentProduct, selectProductsError } from '../../features/products/productsSlice'
import { deleteProductThunk, loadProductById } from '../../features/products/productsThunks'

// Detalle de Producto (vendedor): datos reales del backend + baja lógica (slice `products`).
function SellerProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const current = useSelector(selectCurrentProduct)
  const error = useSelector(selectProductsError)
  const [active, setActive] = useState(0)
  const [prevId, setPrevId] = useState(id)

  useEffect(() => {
    dispatch(loadProductById(id))
  }, [dispatch, id])

  // Reinicia la galería al cambiar de producto (ajuste durante el render).
  if (id !== prevId) {
    setPrevId(id)
    setActive(0)
  }

  // Guarda de id: ignoramos el producto del store hasta que coincida con la ruta.
  const product = current && String(current.id) === String(id) ? current : null

  const remove = async () => {
    const action = await dispatch(deleteProductThunk(id))
    if (action.error) {
      dispatch(notify(action.payload || 'No se pudo eliminar el producto'))
      return
    }
    dispatch(notify('Producto eliminado'))
    navigate('/vendedor/inventario')
  }

  if (!product) {
    return <SellerLayout active="inventario"><p className="adm-table__empty">{error ? error : 'Cargando producto...'}</p></SellerLayout>
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
          <Button variant="outline" to={`/vendedor/inventario/${product.id}/editar`} iconLeft="pencil">Editar</Button>
          <Button variant="outline" iconLeft="trash" onClick={remove}>Eliminar</Button>
        </div>
      </div>

      <div className="spd-grid">
        <div className="spd-main">
          <ProductImage g={gallery[active]} src={active === 0 ? product.imageUrl : undefined} alt={product.name} className="spd-main__img" />
          <div className="spd-thumbs">
            {gallery.map((g, i) => (
              <button key={i} className={`spd-thumb${i === active ? ' is-active' : ''}`} onClick={() => setActive(i)}>
                <ProductImage g={g} src={i === 0 ? product.imageUrl : undefined} alt={product.name} radius="8px" />
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

import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PublicStoreLayout from '../components/layout/PublicStoreLayout'
import ProductImage from '../components/product/ProductImage'
import ProductGrid from '../components/product/ProductGrid'
import SectionHeader from '../components/common/SectionHeader'
import { PriceDisplay, RatingStars, QuantityStepper } from '../components/ui/Misc'
import { Badge, Tag } from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { useCart } from '../store/cart'
import { useAuth } from '../store/auth'
import { notify } from '../features/ui/toastSlice'
import {
  selectCurrentProduct,
  selectProducts,
  selectProductsError,
} from '../features/products/productsSlice'
import { loadProductPage } from '../features/products/productsThunks'
import { clearResenas, selectResenas, selectResenasLoading } from '../features/resenas/resenasSlice'
import { createResenaThunk, loadResenas } from '../features/resenas/resenasThunks'

const isComprador = (user) => String(user?.rol || '').toUpperCase().includes('COMPRADOR')

// Detalle de producto: galería + ficha + reseñas REALES del backend + relacionados.
function ProductDetail() {
  const { addItem } = useCart()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch()
  const current = useSelector(selectCurrentProduct)
  const allProducts = useSelector(selectProducts)
  const error = useSelector(selectProductsError)
  const reviews = useSelector(selectResenas)
  const reviewsLoading = useSelector(selectResenasLoading)
  const [active, setActive] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [prevId, setPrevId] = useState(id)
  // Formulario de reseña (solo compradores logueados).
  const [rating, setRating] = useState(5)
  const [comentario, setComentario] = useState('')
  const [sending, setSending] = useState(false)

  // Una sola carga de categorías + producto + listado (relacionados) + reseñas del producto.
  useEffect(() => {
    dispatch(loadProductPage(id))
    dispatch(clearResenas())
    dispatch(loadResenas(id))
  }, [dispatch, id])

  // Reinicia la vista de galería al cambiar de producto (ajuste durante el render).
  if (id !== prevId) {
    setPrevId(id)
    setActive(0)
  }

  // Guarda de id: ignoramos el producto en el store hasta que coincida con la ruta actual.
  const product = current && String(current.id) === String(id) ? current : null
  const related = useMemo(
    () => (product ? allProducts.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4) : []),
    [allProducts, product],
  )

  // Rating y cantidad se DERIVAN de las reseñas reales del backend (no hay dato fabricado).
  const reviewCount = reviews.length
  const avgRating = reviewCount ? reviews.reduce((sum, r) => sum + (r.puntuacion || 0), 0) / reviewCount : 0
  const canReview = Boolean(token) && isComprador(user)

  if (!product) {
    return (
      <PublicStoreLayout>
        <p className="catalog__empty">{error ? error : 'Cargando detalle del producto...'}</p>
      </PublicStoreLayout>
    )
  }

  const cartProduct = { ...product, g: product.gallery[active] }
  const addToCart = () => {
    addItem(cartProduct, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }
  const buyNow = () => {
    addItem(cartProduct, qty)
    navigate('/carrito')
  }

  const submitReview = async (e) => {
    e.preventDefault()
    setSending(true)
    const action = await dispatch(createResenaThunk({ idProducto: product.id, puntuacion: rating, comentario: comentario.trim() }))
    setSending(false)
    if (action.error) {
      dispatch(notify(action.payload || 'No se pudo enviar la reseña'))
      return
    }
    dispatch(notify('¡Gracias por tu reseña!'))
    setComentario('')
    setRating(5)
  }

  return (
    <PublicStoreLayout>
      <nav className="breadcrumbs">
        {product.breadcrumbs.map((b, i) => (
          <span key={b}>
            {i > 0 && <span className="breadcrumbs__sep">›</span>}
            <span className={i === product.breadcrumbs.length - 1 ? 'breadcrumbs__current' : ''}>{b}</span>
          </span>
        ))}
      </nav>

      <div className="pdp">
        <div className="pdp__gallery">
          <ProductImage g={product.gallery[active]} className="pdp__main" />
          <div className="pdp__thumbs">
            {product.gallery.map((g, i) => (
              <button
                key={i}
                className={`pdp__thumb${i === active ? ' is-active' : ''}`}
                onClick={() => setActive(i)}
                aria-label={`Vista ${i + 1}`}
              >
                <ProductImage g={g} radius="10px" />
              </button>
            ))}
          </div>
        </div>

        <div className="pdp__info">
          <Badge tone={product.badge?.tone || 'mint'} className="pdp__stock-badge"><Icon name="checkCircle" size={13} strokeFill /> {product.stock > 0 ? `En stock (${product.stock})` : 'Agotado'}</Badge>
          <h1 className="pdp__title">{product.name}</h1>
          <div className="pdp__rating">
            {reviewCount > 0
              ? <RatingStars value={Math.round(avgRating)} count={reviewCount} />
              : <span className="adm-muted">Sin reseñas aún</span>}
          </div>
          <div className="pdp__price">
            <PriceDisplay price={product.price} oldPrice={product.oldPrice} size="lg" />
          </div>
          <p className="pdp__desc">{product.description}</p>
          <div className="pdp__tags">
            {product.features.map((f) => (
              <Tag key={f} icon={f === 'Sin Gluten' ? 'check' : f === 'Artesanal' ? 'sparkles' : 'shield'}>{f}</Tag>
            ))}
          </div>
          <div className="pdp__buy">
            <div className="pdp__qty">
              <span className="pdp__qty-label">Cantidad</span>
              <QuantityStepper value={qty} onChange={setQty} />
            </div>
            <div className="pdp__cta">
              <Button size="lg" iconLeft="cart" block onClick={buyNow}>Comprar ahora</Button>
              <Button variant="outline" size="lg" iconLeft={added ? 'check' : 'cart'} block onClick={addToCart}>
                {added ? '¡Agregado!' : 'Agregar al carrito'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <section className="home-section">
        <h2 className="reviews-title">Lo que dicen nuestros exploradores</h2>

        {reviewsLoading && <p className="catalog__empty">Cargando reseñas...</p>}
        {!reviewsLoading && reviewCount === 0 && (
          <p className="catalog__empty">Este producto todavía no tiene reseñas. ¡Sé el primero en opinar!</p>
        )}
        {!reviewsLoading && reviewCount > 0 && (
          <>
            <p className="reviews-summary">
              <RatingStars value={Math.round(avgRating)} size={16} /> {avgRating.toFixed(1)} de 5 · {reviewCount} reseña{reviewCount > 1 ? 's' : ''}
            </p>
            <div className="reviews-grid">
              {reviews.map((r) => (
                <article className="review-card" key={r.id}>
                  <RatingStars value={r.puntuacion} size={14} />
                  <p className="review-card__body">«{r.comentario || 'Sin comentario'}»</p>
                  <span className="review-card__author">— {r.autorNombre || 'Usuario'}{r.createdAt ? ` · ${new Date(r.createdAt).toLocaleDateString('es-AR')}` : ''}</span>
                </article>
              ))}
            </div>
          </>
        )}

        {canReview ? (
          <form className="review-form" onSubmit={submitReview} style={{ marginTop: 20, maxWidth: 520 }}>
            <h3 className="form-card__title">Dejá tu reseña</h3>
            <label className="field">
              <span className="field__label">Puntuación</span>
              <span className="field__control field__control--select">
                <select className="field__input" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} estrella{n > 1 ? 's' : ''}</option>)}
                </select>
              </span>
            </label>
            <label className="field">
              <span className="field__label">Comentario</span>
              <textarea className="textarea" rows={3} placeholder="Contanos qué te pareció..." value={comentario} onChange={(e) => setComentario(e.target.value)} />
            </label>
            <Button type="submit" iconLeft="check" disabled={sending}>{sending ? 'Enviando...' : 'Publicar reseña'}</Button>
          </form>
        ) : (
          !token && <p className="adm-muted" style={{ marginTop: 16 }}>Iniciá sesión como comprador para dejar tu reseña.</p>
        )}
      </section>

      <section className="home-section">
        <SectionHeader title="Compañeros de Safari" actionLabel="Ver todos" to="/catalogo" />
        <ProductGrid products={related} columns={4} compact />
      </section>
    </PublicStoreLayout>
  )
}

export default ProductDetail

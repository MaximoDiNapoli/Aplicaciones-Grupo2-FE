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
import {
  selectCurrentProduct,
  selectProducts,
  selectProductsError,
} from '../features/products/productsSlice'
import { loadProductById, loadProducts } from '../features/products/productsThunks'
import { reviews } from '../data/mock'

// Detalle de producto: galería + ficha + reseñas + relacionados (slice `products`).
function ProductDetail() {
  const { addItem } = useCart()
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch()
  const current = useSelector(selectCurrentProduct)
  const allProducts = useSelector(selectProducts)
  const error = useSelector(selectProductsError)
  const [active, setActive] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [prevId, setPrevId] = useState(id)

  useEffect(() => {
    dispatch(loadProductById(id))
    dispatch(loadProducts())
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
            <RatingStars value={product.rating} count={product.reviews} />
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
        <div className="reviews-grid">
          {reviews.map((r) => (
            <article className="review-card" key={r.id}>
              <RatingStars value={r.rating} size={14} />
              <h4 className="review-card__title">{r.title}</h4>
              <p className="review-card__body">«{r.body}»</p>
              <span className="review-card__author">— {r.author}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <SectionHeader title="Compañeros de Safari" actionLabel="Ver todos" to="/catalogo" />
        <ProductGrid products={related} columns={4} compact />
      </section>
    </PublicStoreLayout>
  )
}

export default ProductDetail

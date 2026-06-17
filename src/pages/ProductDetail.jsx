import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PublicStoreLayout from '../components/layout/PublicStoreLayout'
import ProductImage from '../components/product/ProductImage'
import ProductGrid from '../components/product/ProductGrid'
import SectionHeader from '../components/common/SectionHeader'
import { PriceDisplay, RatingStars, QuantityStepper } from '../components/ui/Misc'
import { Badge, Tag } from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { useCart } from '../store/cart'
import { fetchProductById, fetchProducts } from '../services/api'
import { reviews } from '../data/mock'

// Detalle de producto: galería + ficha + reseñas + relacionados.
function ProductDetail() {
  const { addItem } = useCart()
  const navigate = useNavigate()
  const { id } = useParams()
  const [active, setActive] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true

    Promise.all([fetchProductById(id), fetchProducts()])
      .then(([nextProduct, allProducts]) => {
        if (!alive) return
        setProduct(nextProduct)
        setRelated(allProducts.filter((item) => item.id !== nextProduct.id && item.category === nextProduct.category).slice(0, 4))
        setActive(0)
        setError('')
      })
      .catch((err) => {
        if (!alive) return
        setError(err.message || 'No se pudo cargar el producto')
      })
      .finally(() => {
        if (alive) setLoading(false)
      })

    return () => { alive = false }
  }, [id])

  if (loading) {
    return <PublicStoreLayout><p className="catalog__empty">Cargando detalle del producto...</p></PublicStoreLayout>
  }

  if (error || !product) {
    return <PublicStoreLayout><p className="catalog__empty">{error || 'No encontramos este producto.'}</p></PublicStoreLayout>
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

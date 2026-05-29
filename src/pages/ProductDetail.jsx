import { useState } from 'react'
import PublicStoreLayout from '../components/layout/PublicStoreLayout'
import ProductImage from '../components/product/ProductImage'
import ProductGrid from '../components/product/ProductGrid'
import SectionHeader from '../components/common/SectionHeader'
import { PriceDisplay, RatingStars, QuantityStepper } from '../components/ui/Misc'
import { Badge, Tag } from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { productDetail as p, reviews, products } from '../data/mock'

// Detalle de producto: galería + ficha + reseñas + relacionados.
function ProductDetail() {
  const [active, setActive] = useState(0)
  const [qty, setQty] = useState(1)
  const related = products.slice(0, 4)

  return (
    <PublicStoreLayout>
      <nav className="breadcrumbs">
        {p.breadcrumbs.map((b, i) => (
          <span key={b}>
            {i > 0 && <span className="breadcrumbs__sep">›</span>}
            <span className={i === p.breadcrumbs.length - 1 ? 'breadcrumbs__current' : ''}>{b}</span>
          </span>
        ))}
      </nav>

      <div className="pdp">
        <div className="pdp__gallery">
          <ProductImage g={p.gallery[active]} className="pdp__main" />
          <div className="pdp__thumbs">
            {p.gallery.map((g, i) => (
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
          <Badge tone="mint" className="pdp__stock-badge"><Icon name="checkCircle" size={13} strokeFill /> {p.stock}</Badge>
          <h1 className="pdp__title">{p.name}</h1>
          <div className="pdp__rating">
            <RatingStars value={p.rating} count={p.reviews} />
          </div>
          <div className="pdp__price">
            <PriceDisplay price={p.price} oldPrice={p.oldPrice} size="lg" />
          </div>
          <p className="pdp__desc">{p.description}</p>
          <div className="pdp__tags">
            {p.features.map((f) => (
              <Tag key={f} icon={f === 'Sin Gluten' ? 'check' : f === 'Artesanal' ? 'sparkles' : 'shield'}>{f}</Tag>
            ))}
          </div>
          <div className="pdp__buy">
            <div className="pdp__qty">
              <span className="pdp__qty-label">Cantidad</span>
              <QuantityStepper value={qty} onChange={setQty} />
            </div>
            <div className="pdp__cta">
              <Button size="lg" iconLeft="cart" block>Comprar ahora</Button>
              <Button variant="outline" size="lg" iconLeft="cart" block>Agregar al carrito</Button>
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

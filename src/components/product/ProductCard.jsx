import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductImage from './ProductImage'
import { PriceDisplay } from '../ui/Misc'
import { Badge } from '../ui/Badge'
import Icon from '../ui/Icon'
import { useCart } from '../../store/cart'

// Tarjeta de producto: imagen, badge, favorito, nombre, precio y CTA agregar.
// compact = variante reducida (oculta el copy) para grillas densas.
function ProductCard({ product, compact = false }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false) // feedback temporal del botón agregar
  const [fav, setFav] = useState(false)

  // Agrega al carrito y muestra el check por un instante.
  const add = () => {
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1100)
  }
  return (
    <article className={`product-card${compact ? ' product-card--compact' : ''}`}>
      <Link to={`/producto/${product.id}`} className="product-card__media">
        <ProductImage g={product.g} radius="0" />
        {product.badge && (
          <Badge tone={product.badge.tone} className="product-card__badge">{product.badge.label}</Badge>
        )}
        <button
          type="button"
          className={`product-card__fav${fav ? ' is-fav' : ''}`}
          aria-label={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          aria-pressed={fav}
          onClick={(e) => { e.preventDefault(); setFav((v) => !v) }}
        >
          <Icon name="paw" size={16} />
        </button>
      </Link>
      <div className="product-card__body">
        {product.category && <span className="product-card__cat">{product.categoryName || categoryLabel(product.category) || product.category}</span>}
        <Link to={`/producto/${product.id}`} className="product-card__name">{product.name}</Link>
        {!compact && product.tagline && <p className="product-card__tagline">{product.tagline}</p>}
        <div className="product-card__footer">
          <PriceDisplay price={product.price} oldPrice={product.oldPrice} size={compact ? 'sm' : 'md'} />
          <button type="button" className={`product-card__add${added ? ' is-added' : ''}`} aria-label="Agregar al carrito" onClick={add}>
            <Icon name={added ? 'check' : 'cart'} size={18} strokeFill />
          </button>
        </div>
      </div>
    </article>
  )
}

// Etiqueta corta de categoría mostrada arriba del nombre.
function categoryLabel(id) {
  const map = {
    osos: 'Cacao Oscuro', mariposas: 'Edición Limitada', grillos: 'Fruta Natural', leones: 'Fruta Natural',
  }
  return map[id] || ''
}

export default ProductCard

/* eslint-disable react-refresh/only-export-components */
import Icon from './Icon'

export const formatPrice = (n) =>
  `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

// Precio con descuento opcional. size: sm | md | lg
export function PriceDisplay({ price, oldPrice, size = 'md', className = '' }) {
  return (
    <span className={`price price--${size} ${className}`.trim()}>
      <span className="price__now">{formatPrice(price)}</span>
      {oldPrice != null && <span className="price__old">{formatPrice(oldPrice)}</span>}
    </span>
  )
}

// Control de cantidad - / valor / +
export function QuantityStepper({ value, min = 1, max = 99, onChange }) {
  const set = (v) => onChange?.(Math.max(min, Math.min(max, v)))
  return (
    <div className="qty">
      <button type="button" className="qty__btn" aria-label="Disminuir" onClick={() => set(value - 1)}>
        <Icon name="minus" size={16} strokeFill />
      </button>
      <span className="qty__value">{value}</span>
      <button type="button" className="qty__btn" aria-label="Aumentar" onClick={() => set(value + 1)}>
        <Icon name="plus" size={16} strokeFill />
      </button>
    </div>
  )
}

// Estrellas de rating (0-5, soporta medias visualmente por redondeo).
export function RatingStars({ value = 0, count, size = 16 }) {
  return (
    <span className="rating">
      <span className="rating__stars">
        {[1, 2, 3, 4, 5].map((i) => (
          <Icon key={i} name="star" size={size} className={i <= Math.round(value) ? 'is-on' : 'is-off'} />
        ))}
      </span>
      {count != null && <span className="rating__count">({count} reseñas)</span>}
    </span>
  )
}

export function Divider({ className = '' }) {
  return <hr className={`divider ${className}`.trim()} />
}

import { useState } from 'react'
import { formatPrice } from '../ui/Misc'
import Button from '../ui/Button'

// Resumen de compra con totales y cupón opcional (carrito).
function OrderSummaryCard({ subtotal = 0, shipping = 0, taxes, discount, title = 'Resumen de Safari', withCoupon = true, ctaLabel, ctaTo, ctaIcon = 'arrowRight' }) {
  const [coupon, setCoupon] = useState('')
  const total = subtotal + shipping + (taxes || 0) - (discount || 0)
  return (
    <aside className="summary-card">
      <h2 className="summary-card__title">{title}</h2>
      <hr className="summary-card__rule" />
      <dl className="summary-card__lines">
        <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
        <div><dt>Envío</dt><dd>{formatPrice(shipping)}</dd></div>
        {taxes != null && <div><dt>Impuestos (Estimado)</dt><dd>{formatPrice(taxes)}</dd></div>}
        {discount != null && <div className="is-discount"><dt>Descuento de Miembro</dt><dd>-{formatPrice(discount)}</dd></div>}
      </dl>

      {withCoupon && (
        <div className="coupon">
          <input
            className="coupon__input"
            placeholder="Código de Cupón"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <button type="button" className="coupon__btn" disabled={!coupon}>Aplicar</button>
        </div>
      )}

      <hr className="summary-card__rule" />
      <div className="summary-card__total">
        <span>Total</span>
        <span className="summary-card__total-value">{formatPrice(total)}</span>
      </div>
      {ctaLabel && (
        <Button to={ctaTo} block size="lg" iconRight={ctaIcon} className="summary-card__cta">{ctaLabel}</Button>
      )}
    </aside>
  )
}

export default OrderSummaryCard

import { useState } from 'react'
import { formatPrice } from '../ui/Misc'
import Button from '../ui/Button'
import { useToast } from '../../store/toast'

// Cupones válidos de demostración (código -> % de descuento).
const COUPONS = { SAFARI10: 0.1, DULCE20: 0.2 }

// Resumen de compra con totales y cupón funcional (carrito).
function OrderSummaryCard({ subtotal = 0, shipping = 0, taxes, discount, title = 'Resumen de Safari', withCoupon = true, ctaLabel, ctaTo, ctaIcon = 'arrowRight' }) {
  const notify = useToast()
  const [coupon, setCoupon] = useState('')
  const [applied, setApplied] = useState(null) // { code, amount }

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase()
    const rate = COUPONS[code]
    if (!rate) {
      notify(`El cupón "${code}" no es válido`)
      return
    }
    const amount = +(subtotal * rate).toFixed(2)
    setApplied({ code, amount })
    setCoupon('')
    notify(`Cupón ${code} aplicado: -${formatPrice(amount)}`)
  }
  const removeCoupon = () => setApplied(null)

  const couponAmount = applied?.amount || 0
  const total = subtotal + shipping + (taxes || 0) - (discount || 0) - couponAmount

  return (
    <aside className="summary-card">
      <h2 className="summary-card__title">{title}</h2>
      <hr className="summary-card__rule" />
      <dl className="summary-card__lines">
        <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
        <div><dt>Envío</dt><dd>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</dd></div>
        {taxes != null && <div><dt>Impuestos (Estimado)</dt><dd>{formatPrice(taxes)}</dd></div>}
        {discount != null && <div className="is-discount"><dt>Descuento de Miembro</dt><dd>-{formatPrice(discount)}</dd></div>}
        {applied && (
          <div className="is-discount">
            <dt>Cupón {applied.code} <button type="button" className="coupon__remove" onClick={removeCoupon} aria-label="Quitar cupón">✕</button></dt>
            <dd>-{formatPrice(applied.amount)}</dd>
          </div>
        )}
      </dl>

      {withCoupon && (
        <div className="coupon">
          <input
            className="coupon__input"
            placeholder="Código de Cupón"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && coupon && applyCoupon()}
          />
          <button type="button" className="coupon__btn" disabled={!coupon} onClick={applyCoupon}>Aplicar</button>
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

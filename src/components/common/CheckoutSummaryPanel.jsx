import ProductImage from '../product/ProductImage'
import { formatPrice } from '../ui/Misc'
import Icon from '../ui/Icon'

// Panel de resumen de orden usado en el lateral del checkout (envío / pago).
function CheckoutSummaryPanel({ summary, title = 'Resumen de la Orden', shippingLabel = 'Envío (Safari Express)', secureNote = 'PAGO SEGURO Y CIFRADO', tone = 'foot', headIcon = 'cart', priceTone = 'ink' }) {
  return (
    <aside className="checkout-summary">
      <div className="checkout-summary__head">
        <h3><Icon name={headIcon} size={20} strokeFill /> {title}</h3>
      </div>
      <div className="checkout-summary__items">
        {summary.items.map((it) => (
          <div className="checkout-summary__item" key={it.id}>
            <ProductImage g={it.g} className="checkout-summary__thumb" />
            <div className="checkout-summary__meta">
              <div className="checkout-summary__name">{it.name}</div>
              <div className="checkout-summary__variant">{it.variant}{it.qty ? ` · Cant. ${it.qty}` : ''}</div>
            </div>
            <div className={`checkout-summary__price checkout-summary__price--${priceTone}`}>{formatPrice(it.price)}</div>
          </div>
        ))}
      </div>
      <div className="checkout-summary__totals">
        <div><span>Subtotal</span><span>{formatPrice(summary.subtotal)}</span></div>
        <div><span>{shippingLabel}</span><span>{formatPrice(summary.shipping)}</span></div>
      </div>
      <div className="checkout-summary__grandtotal">
        <span>Total</span>
        <span>{formatPrice(summary.total)}</span>
      </div>
      {tone === 'foot' ? (
        <div className="checkout-summary__secure">
          <Icon name="lock" size={14} strokeFill /> {secureNote}
        </div>
      ) : (
        <div className="checkout-summary__secure-soft">
          <Icon name="lock" size={16} strokeFill /> {secureNote}
        </div>
      )}
    </aside>
  )
}

export default CheckoutSummaryPanel

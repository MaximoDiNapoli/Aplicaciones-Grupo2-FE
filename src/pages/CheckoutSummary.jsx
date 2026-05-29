import { useState } from 'react'
import { Link } from 'react-router-dom'
import CheckoutLayout from '../components/layout/CheckoutLayout'
import ProductImage from '../components/product/ProductImage'
import { Checkbox } from '../components/ui/Field'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { formatPrice } from '../components/ui/Misc'
import { useCart, buildCheckoutSummary } from '../store/cart'

// Checkout paso 3: revisión final del pedido.
function CheckoutSummary() {
  const [accept, setAccept] = useState(true)
  const { items, subtotal } = useCart()
  const summary = buildCheckoutSummary(items, subtotal)
  const { count, shipping, discount, total } = summary

  return (
    <CheckoutLayout step={3} brandSize="lg">
      <h1 className="checkout-h1 checkout-h1--center">Revisa tu Pedido</h1>

      <div className="summary-layout">
        <div className="summary-layout__main">
          <div className="review-row">
            <section className="review-card">
              <header className="review-card__head">
                <span className="review-card__heading"><Icon name="pin" size={16} strokeFill /> DIRECCIÓN DE ENVÍO</span>
                <Link to="/checkout/envio" className="review-card__edit">Editar <Icon name="pencil" size={13} strokeFill /></Link>
              </header>
              <div className="review-card__name">Valeria Explorer</div>
              <div className="review-card__lines">Calle de los Dulces 123, Depto 4B<br />Ciudad de Caramelo, CP 04120</div>
            </section>
            <section className="review-card">
              <header className="review-card__head">
                <span className="review-card__heading"><Icon name="card" size={16} strokeFill /> MÉTODO DE PAGO</span>
                <Link to="/checkout/pago" className="review-card__edit">Editar <Icon name="pencil" size={13} strokeFill /></Link>
              </header>
              <div className="review-card__pay">
                <span className="card-chip">VISA</span>
                <div>
                  <div className="review-card__name">Terminada en •••• 4242</div>
                  <div className="review-card__lines">Exp: 12/25</div>
                </div>
              </div>
            </section>
          </div>

          <section className="review-card review-card--items">
            <header className="review-card__head">
              <h2 className="review-items__title">Tus Dulces</h2>
              <Link to="/carrito" className="review-card__edit">Editar Carrito <Icon name="pencil" size={13} strokeFill /></Link>
            </header>
            {summary.items.map((it) => (
              <div className="review-item" key={it.id}>
                <ProductImage g={it.g} className="review-item__img" />
                <div className="review-item__info">
                  <div className="review-card__name">{it.name}</div>
                  {it.variant && <div className="review-card__lines">{it.variant}</div>}
                </div>
                <div className="review-item__right">
                  <div className="review-item__qty">Cant: {it.qty}</div>
                  <div className="review-item__price">{formatPrice(it.price)}</div>
                </div>
              </div>
            ))}
            {summary.items.length === 0 && <p className="review-card__lines">Tu carrito está vacío.</p>}
          </section>
        </div>

        <aside className="totals-panel">
          <h2 className="totals-panel__title">Total de Compra</h2>
          <dl className="totals-panel__lines">
            <div><dt>Subtotal ({count} artículo{count === 1 ? '' : 's'})</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div><dt>Envío (Safari Express)</dt><dd>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</dd></div>
            {discount > 0 && <div className="is-discount"><dt>Descuento de Miembro</dt><dd>-{formatPrice(discount)}</dd></div>}
          </dl>
          <hr className="summary-card__rule" />
          <div className="summary-card__total">
            <span>Total</span>
            <span className="summary-card__total-value">{formatPrice(total)}</span>
          </div>
          <Checkbox
            className="totals-panel__terms"
            checked={accept}
            onChange={() => setAccept((v) => !v)}
            label={<>Acepto los <a className="link" href="#">términos y condiciones</a> y la política de privacidad de Sugar Safari.</>}
          />
          <Button to="/checkout/confirmacion" block size="lg" iconLeft="lock">
            FINALIZAR COMPRA ({formatPrice(total)})
          </Button>
          <div className="totals-panel__secure"><Icon name="shield" size={14} strokeFill /> Pago seguro encriptado</div>
        </aside>
      </div>
    </CheckoutLayout>
  )
}

export default CheckoutSummary

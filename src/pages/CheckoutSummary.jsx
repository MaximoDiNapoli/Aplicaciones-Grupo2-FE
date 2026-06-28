import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import CheckoutLayout from '../components/layout/CheckoutLayout'
import ProductImage from '../components/product/ProductImage'
import { Checkbox } from '../components/ui/Field'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { formatPrice } from '../components/ui/Misc'
import { useCart, buildCheckoutSummary } from '../store/cart'
import { useCheckout } from '../store/checkout'
import { createPurchaseThunk } from '../features/orders/ordersThunks'

// Checkout paso 3: revisión final + creación real de la compra en el backend (thunk).
function CheckoutSummary() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [accept, setAccept] = useState(false) // términos desmarcados por defecto
  const [placing, setPlacing] = useState(false)
  const [orderError, setOrderError] = useState('')
  const { items, subtotal, cartId, clearLocal } = useCart()
  const { shipping: shipAddr, payment, setLastOrder } = useCheckout()
  const summary = buildCheckoutSummary(items, subtotal)
  const { count, shipping, discount, total } = summary

  // Sin dirección o método de pago, volvemos al paso correspondiente.
  useEffect(() => {
    if (!shipAddr) navigate('/checkout/envio', { replace: true })
    else if (!payment) navigate('/checkout/pago', { replace: true })
  }, [shipAddr, payment, navigate])

  const canFinish = accept && items.length > 0 && Boolean(shipAddr) && Boolean(payment) && Boolean(cartId)

  // El carrito ya vive en el backend: solo se genera la compra a partir de él.
  const finish = async () => {
    if (!canFinish) return
    setPlacing(true)
    setOrderError('')
    const action = await dispatch(createPurchaseThunk({
      cartId,
      payload: { idMetodoPago: payment.idMetodoPago, idDireccionEnvio: shipAddr.id },
    }))
    setPlacing(false)
    if (action.error) {
      setOrderError(action.payload || 'No se pudo completar la compra')
      return
    }
    const compra = action.payload
    setLastOrder({ id: compra.id, total: Number(compra.total ?? total), items: summary.items })
    clearLocal() // el backend ya vació el carrito al crear la compra
    navigate(`/compras/${compra.id}`, { replace: true })
  }

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
              <div className="review-card__name">{shipAddr?.label || 'Sin dirección'}</div>
              <div className="review-card__lines">{(shipAddr?.lines || []).map((l, i) => <span key={i}>{l}<br /></span>)}</div>
            </section>
            <section className="review-card">
              <header className="review-card__head">
                <span className="review-card__heading"><Icon name="card" size={16} strokeFill /> MÉTODO DE PAGO</span>
                <Link to="/checkout/pago" className="review-card__edit">Editar <Icon name="pencil" size={13} strokeFill /></Link>
              </header>
              <div className="review-card__pay">
                <span className="card-chip">{payment?.brand || payment?.label || 'Pago'}</span>
                <div>
                  <div className="review-card__name">
                    {payment?.method === 'tarjeta' ? `Terminada en •••• ${payment.last4}` : (payment?.label || 'Método de pago')}
                  </div>
                  {payment?.method === 'tarjeta' && <div className="review-card__lines">Exp: {payment.exp}</div>}
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
          <Button
            block
            size="lg"
            iconLeft="lock"
            disabled={!canFinish || placing}
            onClick={finish}
          >
            {placing ? 'PROCESANDO...' : `FINALIZAR COMPRA (${formatPrice(total)})`}
          </Button>
          {orderError && <p className="auth-error" style={{ marginTop: 10 }}>{orderError}</p>}
          {!accept && <p className="totals-panel__hint">Debes aceptar los términos y condiciones para continuar.</p>}
          <div className="totals-panel__secure"><Icon name="shield" size={14} strokeFill /> Pago seguro encriptado</div>
        </aside>
      </div>
    </CheckoutLayout>
  )
}

export default CheckoutSummary

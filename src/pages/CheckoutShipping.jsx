import { useState } from 'react'
import CheckoutLayout from '../components/layout/CheckoutLayout'
import CheckoutSummaryPanel from '../components/common/CheckoutSummaryPanel'
import { TextInput } from '../components/ui/Field'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { useCart, buildCheckoutSummary } from '../store/cart'
import { addresses } from '../data/mock'

// Checkout paso 1: dirección de envío.
function CheckoutShipping() {
  const [selected, setSelected] = useState('casa')
  const { items, subtotal } = useCart()
  const checkoutSummary = buildCheckoutSummary(items, subtotal)
  return (
    <CheckoutLayout step={1}>
      <div className="checkout-grid">
        <div className="checkout-grid__main">
          <h1 className="checkout-h1">Dirección de Envío</h1>
          <p className="checkout-sub">¿A dónde enviaremos tu dulce paquete?</p>

          <h2 className="checkout-h2">Direcciones Guardadas</h2>
          <div className="address-grid">
            {addresses.map((a) => (
              <button
                key={a.id}
                className={`address-card${selected === a.id ? ' is-selected' : ''}`}
                onClick={() => setSelected(a.id)}
              >
                <Icon name={a.icon} size={22} strokeFill className="address-card__icon" />
                <div className="address-card__body">
                  <div className="address-card__label">{a.label}</div>
                  {a.lines.map((l) => <div key={l} className="address-card__line">{l}</div>)}
                </div>
                <span className="address-card__check">
                  {selected === a.id && <Icon name="checkCircle" size={22} strokeFill />}
                </span>
              </button>
            ))}
          </div>

          <div className="checkout-divider"><span>O AGREGA UNA NUEVA</span></div>

          <div className="new-address">
            <h2 className="checkout-h2">Nueva Dirección</h2>
            <TextInput label="Nombre Completo" placeholder="Ej. Juan Pérez" />
            <TextInput label="Calle" placeholder="Nombre de la calle" />
            <div className="form-row">
              <TextInput label="Número Exterior / Interior" placeholder="Ej. 123 Int. 4" />
              <TextInput label="Código Postal" placeholder="Ej. 12345" />
            </div>
            <TextInput label="Ciudad" placeholder="Tu ciudad" />
          </div>
        </div>

        <CheckoutSummaryPanel summary={checkoutSummary} />
      </div>

      <div className="checkout-footer">
        <Button to="/checkout/pago" size="lg" iconRight="arrowRight">Continuar al Pago</Button>
      </div>
    </CheckoutLayout>
  )
}

export default CheckoutShipping

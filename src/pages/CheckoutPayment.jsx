import { useState } from 'react'
import CheckoutLayout from '../components/layout/CheckoutLayout'
import CheckoutSummaryPanel from '../components/common/CheckoutSummaryPanel'
import { TextInput, Checkbox } from '../components/ui/Field'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { checkoutSummary } from '../data/mock'

const methods = [
  { id: 'tarjeta', label: 'Tarjeta de Crédito / Débito', icon: 'card' },
  { id: 'paypal', label: 'PayPal', icon: 'bank' },
  { id: 'transferencia', label: 'Transferencia Bancaria', icon: 'bank' },
]

// Checkout paso 2: método de pago.
function CheckoutPayment() {
  const [method, setMethod] = useState('tarjeta')
  const [save, setSave] = useState(true)
  const summary = { ...checkoutSummary, subtotal: 83, shipping: 5, total: 88 }

  return (
    <CheckoutLayout step={2}>
      <div className="checkout-grid">
        <div className="checkout-grid__main">
          <h1 className="checkout-h1">Método de Pago</h1>
          <p className="checkout-sub">Elige cómo te gustaría pagar tu dulce expedición.</p>

          <div className="payment-methods">
            {methods.map((m) => {
              const sel = method === m.id
              return (
                <div key={m.id} className={`payment-method${sel ? ' is-selected' : ''}`}>
                  <button className="payment-method__head" onClick={() => setMethod(m.id)}>
                    <Icon name={m.icon} size={22} strokeFill className="payment-method__icon" />
                    <span className="payment-method__label">{m.label}</span>
                    <span className={`radio-dot${sel ? ' is-on' : ''}`} />
                  </button>
                  {sel && m.id === 'tarjeta' && (
                    <div className="card-form">
                      <TextInput label="Número de Tarjeta" icon="card" placeholder="0000 0000 0000 0000" />
                      <div className="form-row">
                        <TextInput label="Vencimiento (MM/AA)" placeholder="MM/AA" />
                        <TextInput label="CVV" icon="question" placeholder="123" />
                      </div>
                      <TextInput label="Nombre en la tarjeta" placeholder="Ej. Jane Doe" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <Checkbox
            className="payment-save"
            label="Guardar método de pago para futuras expediciones"
            checked={save}
            onChange={() => setSave((v) => !v)}
          />
        </div>

        <CheckoutSummaryPanel
          summary={summary}
          title="Resumen de tu Safari"
          headIcon="bag"
          priceTone="brand"
          shippingLabel="Envío (Safari Standard)"
          tone="soft"
          secureNote="Tu transacción está encriptada y es 100% segura."
        />
      </div>

      <div className="checkout-footer checkout-footer--split">
        <Button to="/checkout/resumen" size="lg" iconRight="arrowRight">Continuar al Resumen</Button>
      </div>
    </CheckoutLayout>
  )
}

export default CheckoutPayment

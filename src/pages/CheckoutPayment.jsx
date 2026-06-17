import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CheckoutLayout from '../components/layout/CheckoutLayout'
import CheckoutSummaryPanel from '../components/common/CheckoutSummaryPanel'
import { TextInput, Checkbox } from '../components/ui/Field'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { useCart, buildCheckoutSummary } from '../store/cart'
import { useCheckout } from '../store/checkout'
import { fetchPaymentMethods } from '../services/api'

const EMPTY_CARD = { number: '', exp: '', cvv: '', name: '' }
const isCardMethod = (tipo = '') => /tarjeta|credito|crédito|debito|débito/i.test(tipo)

// Checkout paso 2: método de pago (lista real del backend + validación de tarjeta).
function CheckoutPayment() {
  const navigate = useNavigate()
  const { shipping, setPayment } = useCheckout()
  const [methods, setMethods] = useState([])
  const [methodId, setMethodId] = useState(null)
  const [card, setCard] = useState(EMPTY_CARD)
  const [save, setSave] = useState(true)
  const [error, setError] = useState('')
  const { items, subtotal } = useCart()
  const summary = buildCheckoutSummary(items, subtotal)

  // No se puede pagar sin una dirección elegida en el paso anterior.
  useEffect(() => {
    if (!shipping) navigate('/checkout/envio', { replace: true })
  }, [shipping, navigate])

  useEffect(() => {
    let alive = true
    fetchPaymentMethods()
      .then((rows) => {
        if (!alive) return
        setMethods(rows)
        setMethodId(rows[0]?.id ?? null)
      })
      .catch(() => { if (alive) setMethods([]) })
    return () => { alive = false }
  }, [])

  const setField = (key, value) => { setCard((c) => ({ ...c, [key]: value })); if (error) setError('') }
  const selectedMethod = methods.find((m) => m.id === methodId)

  const submit = () => {
    if (!selectedMethod) { setError('Elegí un método de pago.'); return }
    if (isCardMethod(selectedMethod.tipo)) {
      const number = card.number.replace(/\s+/g, '')
      if (!/^\d{13,19}$/.test(number)) { setError('Ingresá un número de tarjeta válido (13 a 19 dígitos).'); return }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.exp.trim())) { setError('Ingresá el vencimiento en formato MM/AA.'); return }
      if (!/^\d{3,4}$/.test(card.cvv.trim())) { setError('El CVV debe tener 3 o 4 dígitos.'); return }
      if (!card.name.trim()) { setError('Ingresá el nombre que figura en la tarjeta.'); return }
      setPayment({
        idMetodoPago: selectedMethod.id,
        label: selectedMethod.tipo,
        brand: selectedMethod.tipo,
        last4: number.slice(-4),
        exp: card.exp.trim(),
        name: card.name.trim(),
      })
    } else {
      setPayment({ idMetodoPago: selectedMethod.id, label: selectedMethod.tipo })
    }
    navigate('/checkout/resumen')
  }

  return (
    <CheckoutLayout step={2}>
      <div className="checkout-grid">
        <div className="checkout-grid__main">
          <h1 className="checkout-h1">Método de Pago</h1>
          <p className="checkout-sub">Elige cómo te gustaría pagar tu dulce expedición.</p>

          <div className="payment-methods">
            {methods.map((m) => {
              const sel = methodId === m.id
              return (
                <div key={m.id} className={`payment-method${sel ? ' is-selected' : ''}`}>
                  <button className="payment-method__head" onClick={() => { setMethodId(m.id); if (error) setError('') }}>
                    <Icon name={isCardMethod(m.tipo) ? 'card' : 'bank'} size={22} strokeFill className="payment-method__icon" />
                    <span className="payment-method__label">{m.tipo}</span>
                    <span className={`radio-dot${sel ? ' is-on' : ''}`} />
                  </button>
                  {sel && isCardMethod(m.tipo) && (
                    <div className="card-form">
                      <TextInput label="Número de Tarjeta" icon="card" placeholder="0000 0000 0000 0000" value={card.number} onChange={(e) => setField('number', e.target.value)} inputMode="numeric" />
                      <div className="form-row">
                        <TextInput label="Vencimiento (MM/AA)" placeholder="MM/AA" value={card.exp} onChange={(e) => setField('exp', e.target.value)} />
                        <TextInput label="CVV" icon="question" placeholder="123" value={card.cvv} onChange={(e) => setField('cvv', e.target.value)} inputMode="numeric" />
                      </div>
                      <TextInput label="Nombre en la tarjeta" placeholder="Ej. Jane Doe" value={card.name} onChange={(e) => setField('name', e.target.value)} />
                    </div>
                  )}
                  {sel && !isCardMethod(m.tipo) && (
                    <div className="card-form"><p className="checkout-sub" style={{ margin: 0 }}>Confirmarás el pago con {m.tipo} al finalizar la compra.</p></div>
                  )}
                </div>
              )
            })}
            {methods.length === 0 && <p className="checkout-sub">No se pudieron cargar los métodos de pago.</p>}
          </div>

          {error && <p className="auth-error">{error}</p>}

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
        <Button size="lg" iconRight="arrowRight" onClick={submit}>Continuar al Resumen</Button>
      </div>
    </CheckoutLayout>
  )
}

export default CheckoutPayment

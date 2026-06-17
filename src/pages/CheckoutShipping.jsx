import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CheckoutLayout from '../components/layout/CheckoutLayout'
import CheckoutSummaryPanel from '../components/common/CheckoutSummaryPanel'
import { TextInput } from '../components/ui/Field'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { useCart, buildCheckoutSummary } from '../store/cart'
import { useCheckout } from '../store/checkout'
import { fetchAddresses, createAddress } from '../services/api'

const EMPTY_NEW = { nombre: '', calle: '', numero: '', cp: '', ciudad: '' }

// Checkout paso 1: dirección de envío (direcciones reales del backend + validación).
function CheckoutShipping() {
  const navigate = useNavigate()
  const { setShipping } = useCheckout()
  const [addresses, setAddresses] = useState([])
  const [selected, setSelected] = useState('') // id de dirección guardada o 'nueva'
  const [nueva, setNueva] = useState(EMPTY_NEW)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const { items, subtotal } = useCart()
  const checkoutSummary = buildCheckoutSummary(items, subtotal)

  useEffect(() => {
    let alive = true
    fetchAddresses()
      .then((rows) => {
        if (!alive) return
        const mapped = rows.map((a) => ({
          id: a.id,
          label: a.esPrincipal ? 'Principal' : 'Dirección',
          lines: [a.direccion, [a.ciudad, a.codigoPostal].filter(Boolean).join(' ')].filter(Boolean),
        }))
        setAddresses(mapped)
        setSelected(mapped[0]?.id ?? 'nueva')
      })
      .catch(() => { if (alive) { setAddresses([]); setSelected('nueva') } })
    return () => { alive = false }
  }, [])

  const setField = (key, value) => { setNueva((n) => ({ ...n, [key]: value })); if (error) setError('') }

  const submit = async () => {
    if (selected && selected !== 'nueva') {
      const addr = addresses.find((a) => a.id === selected)
      setShipping(addr)
      navigate('/checkout/pago')
      return
    }
    // Dirección nueva: todos los campos obligatorios; se crea en el backend.
    const { nombre, calle, numero, cp, ciudad } = nueva
    if (!nombre.trim() || !calle.trim() || !numero.trim() || !cp.trim() || !ciudad.trim()) {
      setError('Completá todos los datos de la nueva dirección o elegí una guardada.')
      return
    }
    setSaving(true)
    try {
      const creada = await createAddress({
        direccion: `${calle.trim()} ${numero.trim()}`,
        ciudad: ciudad.trim(),
        codigoPostal: cp.trim(),
        esPrincipal: addresses.length === 0,
      })
      setShipping({
        id: creada.id,
        label: nombre.trim(),
        lines: [creada.direccion, [creada.ciudad, creada.codigoPostal].filter(Boolean).join(' ')],
      })
      navigate('/checkout/pago')
    } catch (err) {
      setError(err.message || 'No se pudo guardar la dirección')
    } finally {
      setSaving(false)
    }
  }

  return (
    <CheckoutLayout step={1}>
      <div className="checkout-grid">
        <div className="checkout-grid__main">
          <h1 className="checkout-h1">Dirección de Envío</h1>
          <p className="checkout-sub">¿A dónde enviaremos tu dulce paquete?</p>

          {addresses.length > 0 && <h2 className="checkout-h2">Direcciones Guardadas</h2>}
          <div className="address-grid">
            {addresses.map((a) => (
              <button
                key={a.id}
                className={`address-card${selected === a.id ? ' is-selected' : ''}`}
                onClick={() => { setSelected(a.id); if (error) setError('') }}
              >
                <Icon name="pin" size={22} strokeFill className="address-card__icon" />
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
            <h2 className="checkout-h2">
              <label className="checkbox" style={{ display: 'inline-flex' }}>
                <input type="radio" name="addr" checked={selected === 'nueva'} onChange={() => { setSelected('nueva'); if (error) setError('') }} />
                <span style={{ marginLeft: 8 }}>Nueva Dirección</span>
              </label>
            </h2>
            <TextInput label="Nombre Completo" placeholder="Ej. Juan Pérez" value={nueva.nombre} onChange={(e) => setField('nombre', e.target.value)} />
            <TextInput label="Calle" placeholder="Nombre de la calle" value={nueva.calle} onChange={(e) => setField('calle', e.target.value)} />
            <div className="form-row">
              <TextInput label="Número Exterior / Interior" placeholder="Ej. 123 Int. 4" value={nueva.numero} onChange={(e) => setField('numero', e.target.value)} />
              <TextInput label="Código Postal" placeholder="Ej. 12345" value={nueva.cp} onChange={(e) => setField('cp', e.target.value)} />
            </div>
            <TextInput label="Ciudad" placeholder="Tu ciudad" value={nueva.ciudad} onChange={(e) => setField('ciudad', e.target.value)} />
          </div>

          {error && <p className="auth-error">{error}</p>}
        </div>

        <CheckoutSummaryPanel summary={checkoutSummary} />
      </div>

      <div className="checkout-footer">
        <Button size="lg" iconRight="arrowRight" onClick={submit} disabled={saving}>{saving ? 'Guardando...' : 'Continuar al Pago'}</Button>
      </div>
    </CheckoutLayout>
  )
}

export default CheckoutShipping

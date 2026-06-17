import { useEffect, useRef, useState } from 'react'
import PublicStoreLayout from '../components/layout/PublicStoreLayout'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { formatPrice } from '../components/ui/Misc'
import { useCart, buildCheckoutSummary } from '../store/cart'
import { useCheckout } from '../store/checkout'

// Confirmación de compra: muestra lo realmente comprado y vacía el carrito.
function CheckoutConfirmation() {
  const { items, subtotal, clear } = useCart()
  const { reset } = useCheckout()
  // Snapshot del pedido en el primer render (antes de vaciar el carrito).
  const [order] = useState(() => buildCheckoutSummary(items, subtotal))
  const [orderNum] = useState(() => Math.floor(10000 + Math.random() * 89999))

  // Vacía el carrito y limpia el checkout una sola vez al confirmar.
  const cleared = useRef(false)
  useEffect(() => {
    if (cleared.current) return
    cleared.current = true
    clear()
    reset()
  }, [clear, reset])

  return (
    <PublicStoreLayout>
      <div className="confirmation">
        <div className="confirmation__art">🎉🍬🐻</div>
        <h1 className="confirmation__title">¡Pedido #{orderNum} Confirmado!</h1>
        <p className="confirmation__sub">
          Tu safari de dulces está siendo preparado con mucho cuidado. Te enviaremos un correo cuando inicie su viaje.
        </p>

        <div className="confirmation__cards">
          <div className="confirm-card confirm-card--eta">
            <span className="confirm-card__label"><Icon name="truck" size={18} strokeFill /> Estimado de Entrega</span>
            <div className="confirm-card__date">Jueves, 24 de Oct.</div>
            <div className="confirm-card__note">Envío Safari Express</div>
          </div>
          <div className="confirm-card confirm-card--summary">
            <span className="confirm-card__label confirm-card__label--brand"><Icon name="bag" size={18} strokeFill /> Resumen de lo comprado</span>
            <ul className="confirm-card__items">
              {order.items.map((it) => (
                <li key={it.id}>
                  <span>{it.name} <em>x{it.qty}</em></span>
                  <span>{formatPrice(it.price)}</span>
                </li>
              ))}
              {order.items.length === 0 && <li><span>Sin artículos</span></li>}
            </ul>
            <div className="confirm-card__total">
              <span>Total Pagado</span>
              <span className="confirm-card__total-value">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="confirmation__actions">
          <Button to="/compras" iconLeft="truck">Rastrear Pedido</Button>
          <Button to="/" variant="outline" iconLeft="home">Volver al Inicio</Button>
        </div>
      </div>
    </PublicStoreLayout>
  )
}

export default CheckoutConfirmation

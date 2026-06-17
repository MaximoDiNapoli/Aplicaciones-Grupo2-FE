import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PublicStoreLayout from '../components/layout/PublicStoreLayout'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { formatPrice } from '../components/ui/Misc'
import { useCheckout } from '../store/checkout'

// Confirmación de compra: muestra la orden realmente creada en el backend.
function CheckoutConfirmation() {
  const navigate = useNavigate()
  const { lastOrder } = useCheckout()

  // Si se entra sin una orden recién creada, volvemos al historial de compras.
  useEffect(() => {
    if (!lastOrder) navigate('/compras', { replace: true })
  }, [lastOrder, navigate])

  if (!lastOrder) return null

  const itemsList = lastOrder.items || []

  return (
    <PublicStoreLayout>
      <div className="confirmation">
        <div className="confirmation__art">🎉🍬🐻</div>
        <h1 className="confirmation__title">¡Pedido #{lastOrder.id} Confirmado!</h1>
        <p className="confirmation__sub">
          Tu safari de dulces está siendo preparado con mucho cuidado. Te enviaremos un correo cuando inicie su viaje.
        </p>

        <div className="confirmation__cards">
          <div className="confirm-card confirm-card--eta">
            <span className="confirm-card__label"><Icon name="truck" size={18} strokeFill /> Estado del Pedido</span>
            <div className="confirm-card__date">Registrado</div>
            <div className="confirm-card__note">Seguí su estado desde Mis Compras</div>
          </div>
          <div className="confirm-card confirm-card--summary">
            <span className="confirm-card__label confirm-card__label--brand"><Icon name="bag" size={18} strokeFill /> Resumen de lo comprado</span>
            <ul className="confirm-card__items">
              {itemsList.map((it) => (
                <li key={it.id}>
                  <span>{it.name} <em>x{it.qty}</em></span>
                  <span>{formatPrice(it.price)}</span>
                </li>
              ))}
              {itemsList.length === 0 && <li><span>Sin artículos</span></li>}
            </ul>
            <div className="confirm-card__total">
              <span>Total Pagado</span>
              <span className="confirm-card__total-value">{formatPrice(lastOrder.total)}</span>
            </div>
          </div>
        </div>

        <div className="confirmation__actions">
          <Button to={`/compras/${lastOrder.id}`} iconLeft="truck">Ver Detalle del Pedido</Button>
          <Button to="/" variant="outline" iconLeft="home">Volver al Inicio</Button>
        </div>
      </div>
    </PublicStoreLayout>
  )
}

export default CheckoutConfirmation

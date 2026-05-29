import PublicStoreLayout from '../components/layout/PublicStoreLayout'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { useCart } from '../store/cart'

const purchased = [
  { id: 1, name: 'Caja Colección Osos de Chocolate', qty: 1, price: 45.0 },
  { id: 2, name: 'Leones de Goma Edición Especial', qty: 2, price: 24.0 },
]

// Confirmación de compra.
function CheckoutConfirmation() {
  const { clear } = useCart()
  const total = 69.0
  return (
    <PublicStoreLayout>
      <div className="confirmation">
        <div className="confirmation__art">🎉🍬🐻</div>
        <h1 className="confirmation__title">¡Pedido #12345 Confirmado!</h1>
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
              {purchased.map((it) => (
                <li key={it.id}>
                  <span>{it.name} <em>x{it.qty}</em></span>
                  <span>${it.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="confirm-card__total">
              <span>Total Pagado</span>
              <span className="confirm-card__total-value">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="confirmation__actions">
          <Button to="/compras" iconLeft="truck">Rastrear Pedido</Button>
          <Button to="/" variant="outline" iconLeft="home" onClick={clear}>Volver al Inicio</Button>
        </div>
      </div>
    </PublicStoreLayout>
  )
}

export default CheckoutConfirmation

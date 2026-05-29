import { Link } from 'react-router-dom'
import Brand from './Brand'
import Icon from '../ui/Icon'
import { useCart } from '../../store/cart'

// Header publico: logo + accesos a carrito y cuenta.
function PublicHeader() {
  const { count } = useCart()
  return (
    <header className="public-header">
      <div className="public-header__inner">
        <Brand />
        <div className="public-header__actions">
          <Link to="/carrito" className="icon-btn" aria-label="Carrito">
            <Icon name="cart" size={24} strokeFill />
            {count > 0 && <span className="icon-btn__badge">{count}</span>}
          </Link>
          <Link to="/perfil" className="icon-btn" aria-label="Cuenta">
            <Icon name="userCircle" size={24} strokeFill />
          </Link>
        </div>
      </div>
    </header>
  )
}

export default PublicHeader

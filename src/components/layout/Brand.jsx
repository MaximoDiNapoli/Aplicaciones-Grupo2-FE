import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'

// Logo de marca. withIcon muestra la patita; size controla la escala.
function Brand({ withIcon = false, size = 'md', to = '/' }) {
  return (
    <Link to={to} className={`brand brand--${size}`}>
      {withIcon && <Icon name="paw" size={size === 'lg' ? 30 : 22} className="brand__paw" />}
      <span className="brand__name">Sugar Safari</span>
    </Link>
  )
}

export default Brand

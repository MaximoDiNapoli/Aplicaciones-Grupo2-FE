import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'

const navItems = [
  { id: 'tienda', label: 'Ver Todo', icon: 'store', to: '/catalogo' },
  { id: 'osos', label: 'Osos de Chocolate', icon: 'paw', to: '/catalogo' },
  { id: 'leones', label: 'Leones de Goma', icon: 'sparkles', to: '/catalogo' },
  { id: 'mariposas', label: 'Mariposas de Azúcar', icon: 'butterfly', to: '/catalogo' },
  { id: 'cuenta', label: 'Mi Cuenta Safari', icon: 'userCircle', to: '/perfil' },
]

// Sidebar de cuenta de usuario (perfil, mis compras).
function AccountSidebar({ activeItem = 'cuenta', user }) {
  return (
    <aside className="account-sidebar">
      <div className="account-sidebar__head">
        <div className="account-sidebar__avatar">
          {user?.avatar ? <img src={user.avatar} alt="" /> : <Icon name="userCircle" size={40} strokeFill />}
        </div>
        <div className="account-sidebar__name">{user?.name || 'Bienvenida Exploradora'}</div>
        <div className="account-sidebar__role">Miembro Sugar Safari</div>
      </div>
      <nav className="account-sidebar__nav">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.to}
            className={`account-sidebar__item${item.id === activeItem ? ' is-active' : ''}`}
          >
            <Icon name={item.icon} size={20} strokeFill={item.icon !== 'paw' && item.icon !== 'sparkles'} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default AccountSidebar

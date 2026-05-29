import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'

// Layout de panel (vendedor / admin). Misma paleta de usuario en ambos:
// - variant "seller": sidebar claro (crema) con acentos magenta.
// - variant "admin": sidebar oscuro (charcoal #2E3132, ya en la paleta) con acentos magenta.
function DashboardLayout({ variant = 'seller', subtitle, nav = [], active, footer, children }) {
  return (
    <div className={`dash dash--${variant}`}>
      <aside className="dash-sidebar">
        <div>
          <Link to={variant === 'admin' ? '/admin' : '/vendedor'} className="dash-brand">
            <span className="dash-brand__logo"><Icon name="paw" size={20} /></span>
            <span className="dash-brand__text">
              <span className="dash-brand__name">Sugar Safari</span>
              <span className="dash-brand__sub">{subtitle}</span>
            </span>
          </Link>
          <nav className="dash-nav">
            {nav.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                className={`dash-nav__item${item.id === active ? ' is-active' : ''}`}
              >
                <Icon name={item.icon} size={20} strokeFill />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="dash-sidebar__foot">{footer}</div>
      </aside>
      <main className="dash-main">
        <div className="dash-main__inner">{children}</div>
      </main>
    </div>
  )
}

export default DashboardLayout

const IconGrid = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="4" y="4" width="7" height="7" rx="1.5" />
    <rect x="13" y="4" width="7" height="7" rx="1.5" />
    <rect x="4" y="13" width="7" height="7" rx="1.5" />
    <rect x="13" y="13" width="7" height="7" rx="1.5" />
  </svg>
)

const IconBox = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="4" y="6" width="16" height="12" rx="2" />
    <path d="M4 10h16" />
  </svg>
)

const IconStack = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="5" y="5" width="14" height="5" rx="1.5" />
    <rect x="5" y="12" width="14" height="7" rx="1.5" />
  </svg>
)

const IconGear = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M16.9 16.9l2.1 2.1M2 12h3M19 12h3M4.9 19.1l2.1-2.1M16.9 7.1l2.1-2.1" />
  </svg>
)

const IconTag = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 7a3 3 0 0 1 3-3h6l7 7-7 7-9-9V7z" />
    <circle cx="9.5" cy="8.5" r="1.2" />
  </svg>
)

const IconStore = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 9h16l-1.5 10H5.5L4 9z" />
    <path d="M3 9l2-4h14l2 4" />
  </svg>
)

const IconClipboard = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="6" y="6" width="12" height="14" rx="2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
  </svg>
)

const IconChart = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 19h16" />
    <rect x="6" y="11" width="3" height="6" rx="1" />
    <rect x="11" y="8" width="3" height="9" rx="1" />
    <rect x="16" y="5" width="3" height="12" rx="1" />
  </svg>
)

const adminItems = [
  { id: 'principal', label: 'Principal', icon: IconGrid, active: true },
  { id: 'catalogo', label: 'Catalogo', icon: IconBox },
  { id: 'operaciones', label: 'Operaciones', icon: IconStack },
  { id: 'configuracion', label: 'Configuracion', icon: IconGear },
  { id: 'categorias', label: 'Categorias', icon: IconTag },
]

const sellerItems = [
  { id: 'panel', label: 'Panel de Control', icon: IconGrid, active: true },
  { id: 'inventario', label: 'Inventario', icon: IconStore },
  { id: 'ventas', label: 'Ventas', icon: IconChart },
]

function Sidebar({ variant = 'admin' }) {
  const isAdmin = variant === 'admin'
  const items = isAdmin ? adminItems : sellerItems
  const title = isAdmin ? 'Admin Dashboard' : 'Administracion'

  return (
    <aside className={`sidebar sidebar--${variant}`}>
      <div>
        <div className="sidebar__brand">
          <div className={`sidebar__logo sidebar__logo--${variant}`} />
          <div>
            <div className="sidebar__title">Sugar Safari</div>
            <div className="sidebar__subtitle">{title}</div>
          </div>
        </div>
        <nav className="sidebar__nav">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar__item${item.active ? ' sidebar__item--active' : ''}`}
              >
                <span className="sidebar__icon">
                  <Icon />
                </span>
                <span className="sidebar__label">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
      <div className="sidebar__bottom">
        {isAdmin ? (
          <div className="sidebar__actions">
            <button type="button" className="sidebar__action">
              Mi Perfil
            </button>
            <button type="button" className="sidebar__action">
              Cerrar Sesion
            </button>
          </div>
        ) : (
          <div className="sidebar__user">
            <div className="sidebar__avatar" />
            <div>
              <div className="sidebar__name">Seller Sugar</div>
              <div className="sidebar__email">seller@sugarsafari.com</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar

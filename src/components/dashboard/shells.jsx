/* eslint-disable react-refresh/only-export-components */
import DashboardLayout from '../layout/DashboardLayout'
import Icon from '../ui/Icon'

// Navegación y footers de cada panel, con la paleta de usuario.
const sellerNav = [
  { id: 'panel', label: 'Panel de Control', icon: 'grid', to: '/vendedor' },
  { id: 'inventario', label: 'Inventario', icon: 'inventory', to: '/vendedor/inventario' },
  { id: 'ventas', label: 'Ventas', icon: 'receipt', to: '/vendedor/ventas' },
]

const adminNav = [
  { id: 'principal', label: 'Principal', icon: 'grid', to: '/admin' },
  { id: 'catalogo', label: 'Catálogo', icon: 'inventory', to: '/admin/catalogo' },
  { id: 'operaciones', label: 'Operaciones', icon: 'receipt', to: '/admin/ventas' },
  { id: 'usuarios', label: 'Configuración', icon: 'users', to: '/admin/usuarios' },
  { id: 'categorias', label: 'Categorías', icon: 'sitemap', to: '/admin/categorias' },
]

function SellerFooter() {
  return (
    <div className="dash-user">
      <span className="dash-user__avatar"><Icon name="userCircle" size={28} strokeFill /></span>
      <div className="dash-user__meta">
        <div className="dash-user__name">Seller Sugar</div>
        <div className="dash-user__email">seller@sugarsafari.com</div>
      </div>
    </div>
  )
}

function AdminFooter() {
  return (
    <div className="dash-links">
      <a className="dash-links__item"><Icon name="userCircle" size={20} strokeFill /> Mi Perfil</a>
      <a className="dash-links__item"><Icon name="logout" size={20} strokeFill /> Cerrar Sesión</a>
    </div>
  )
}

export function SellerLayout({ active, children }) {
  return (
    <DashboardLayout variant="seller" subtitle="Administración" nav={sellerNav} active={active} footer={<SellerFooter />}>
      {children}
    </DashboardLayout>
  )
}

export function AdminLayout({ active, children }) {
  return (
    <DashboardLayout variant="admin" subtitle="Admin Dashboard" nav={adminNav} active={active} footer={<AdminFooter />}>
      {children}
    </DashboardLayout>
  )
}

// Encabezado de página con título, subtítulo y acciones a la derecha.
export function PageTitle({ title, subtitle, actions, brand = false }) {
  return (
    <div className="dash-pagetitle">
      <div>
        <h1 className={`dash-pagetitle__title${brand ? ' is-brand' : ''}`}>{title}</h1>
        {subtitle && <p className="dash-pagetitle__sub">{subtitle}</p>}
      </div>
      {actions && <div className="dash-pagetitle__actions">{actions}</div>}
    </div>
  )
}

// KPI. tone colorea el icono; alert agrega borde superior magenta.
export function StatCard({ label, value, icon, delta, deltaTone = 'mint', note, tone = 'mint', alert = false }) {
  return (
    <div className={`stat-kpi${alert ? ' stat-kpi--alert' : ''}`}>
      <div className="stat-kpi__head">
        <span className="stat-kpi__label">{label}</span>
        <span className={`stat-kpi__icon stat-kpi__icon--${alert ? 'alert' : tone}`}>
          <Icon name={icon} size={20} strokeFill />
        </span>
      </div>
      <div className="stat-kpi__value">
        {value}
        {delta && <span className={`stat-kpi__delta stat-kpi__delta--${deltaTone}`}><Icon name="trendUp" size={13} strokeFill /> {delta}</span>}
        {note && <span className="stat-kpi__note">{note}</span>}
      </div>
    </div>
  )
}

// Avatar de iniciales.
export function Avatar({ name, tone = 'mint' }) {
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  return <span className={`avatar-ini avatar-ini--${tone}`}>{initials}</span>
}

// Pill de estado para tablas de panel.
export function Pill({ children, tone = 'neutral' }) {
  return <span className={`pill pill--${tone}`}>{children}</span>
}

// Mapea un estado de dominio a su tono visual (verde/naranja/neutral/magenta).
const TONES = {
  completada: 'mint', completado: 'mint', entregado: 'mint', activo: 'mint', pagado: 'mint', publicado: 'mint',
  pendiente: 'orange', procesando: 'orange', enviado: 'pink', verificado: 'pink', procesado: 'orange',
  cancelada: 'neutral', cancelado: 'neutral', inactivo: 'neutral',
  suspendido: 'brand', rechazado: 'brand',
}
export const pillTone = (status) => TONES[status] || 'neutral'

// Texto capitalizado para pills.
export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

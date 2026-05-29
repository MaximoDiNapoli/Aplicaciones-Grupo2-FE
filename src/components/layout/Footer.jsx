import { Link } from 'react-router-dom'

const links = [
  { label: 'Fondo de Protección Animal', to: '/catalogo' },
  { label: 'Envíos Safari', to: '/catalogo' },
  { label: 'Tiendas Boutique', to: '/catalogo' },
  { label: 'Contacta al Zoológico', to: '/catalogo' },
]

// Footer publico con marca, copy y links de exploración.
function Footer() {
  return (
    <footer className="public-footer">
      <div className="public-footer__inner">
        <div className="public-footer__brand">
          <div className="public-footer__title">Sugar Safari</div>
          <p className="public-footer__copy">
            © 2026 Sugar Safari Dulces Artesanales. Hecho con dulzura y cariño.
          </p>
        </div>
        <div className="public-footer__links">
          <div className="public-footer__label">Explorar</div>
          <ul>
            {links.map((l) => (
              <li key={l.label}><Link to={l.to}>{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer

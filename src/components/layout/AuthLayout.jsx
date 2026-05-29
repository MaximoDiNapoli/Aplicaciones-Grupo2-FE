import Brand from './Brand'

// Layout de autenticacion: panel hero a la izquierda + card de formulario.
// hero: { title, subtitle, image, withBrand }
function AuthLayout({ hero, children }) {
  return (
    <div className="auth-layout">
      <div className="auth-layout__card">
        <aside
          className="auth-hero"
          style={hero?.image ? { backgroundImage: hero.image.includes('gradient') ? hero.image : `url(${hero.image})` } : undefined}
        >
          <div className="auth-hero__overlay">
            {hero?.withBrand && <Brand withIcon size="lg" />}
            {hero?.title && <h2 className="auth-hero__title">{hero.title}</h2>}
            {hero?.subtitle && <p className="auth-hero__subtitle">{hero.subtitle}</p>}
          </div>
        </aside>
        <section className="auth-panel">{children}</section>
      </div>
    </div>
  )
}

export default AuthLayout

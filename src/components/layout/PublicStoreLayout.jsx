import PublicHeader from './PublicHeader'
import Footer from './Footer'

// Layout base de paginas publicas: header + contenido + footer.
function PublicStoreLayout({ children, contained = true }) {
  return (
    <div className="page">
      <PublicHeader />
      <main className="page__main">
        {contained ? <div className="container">{children}</div> : children}
      </main>
      <Footer />
    </div>
  )
}

export default PublicStoreLayout

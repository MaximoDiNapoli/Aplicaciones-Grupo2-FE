import './App.css'
import Footer from './components/Footer'
import PublicHeader from './components/PublicHeader'
import Sidebar from './components/Sidebar'

function App() {
  return (
    <div className="preview">
      <section className="preview-section">
        <p className="preview-label">Header y footer (vista usuario)</p>
        <div className="public-preview">
          <PublicHeader />
          <div className="public-preview__body">
            <div className="public-preview__hero">
              <div className="public-preview__hero-text">
                <h1 className="public-preview__title">
                  Welcome to the Sweetest Safari
                </h1>
                <p className="public-preview__copy">
                  Discover our artisanal collection of wildlife-inspired
                  chocolates and marshmallows. Crafted with magic, just for you.
                </p>
                <button className="public-preview__cta" type="button">
                  Shop the Wild
                </button>
              </div>
            </div>
            <div className="public-preview__chips">
              <div className="chip">Chocolate Bears</div>
              <div className="chip">Sugar Butterflies</div>
              <div className="chip">Crispy Crickets</div>
              <div className="chip">Gummy Lions</div>
            </div>
          </div>
          <Footer />
        </div>
      </section>
      <section className="preview-section">
        <p className="preview-label">Sidebars reutilizables</p>
        <div className="sidebar-preview">
          <Sidebar variant="admin" />
          <Sidebar variant="seller" />
        </div>
      </section>
    </div>
  )
}

export default App

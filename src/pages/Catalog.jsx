import PublicHeader from '../components/layout/PublicHeader'
import Footer from '../components/layout/Footer'
import AccountSidebar from '../components/layout/AccountSidebar'
import ProductGrid from '../components/product/ProductGrid'
import { Checkbox, Select } from '../components/ui/Field'
import { products } from '../data/mock'

const catFilters = ['Ositos', 'Mariposas', 'Insectos', 'Leones']

// Catálogo: sidebar de cuenta + panel de filtros + grilla + paginación.
function Catalog() {
  return (
    <div className="page">
      <PublicHeader />
      <div className="catalog">
        <AccountSidebar activeItem="tienda" />
        <aside className="filter-panel">
          <h3 className="filter-panel__title">Filtros</h3>
          <div className="filter-panel__group">
            <span className="filter-panel__label">CATEGORÍA</span>
            {catFilters.map((c) => (
              <Checkbox key={c} label={c} checked={false} onChange={() => {}} />
            ))}
          </div>
          <div className="filter-panel__group">
            <span className="filter-panel__label">RANGO DE PRECIO</span>
            <div className="filter-panel__range">
              <input className="filter-panel__price" placeholder="$0" />
              <span>—</span>
              <input className="filter-panel__price" placeholder="$50+" />
            </div>
          </div>
        </aside>
        <main className="catalog__content">
          <div className="catalog__toolbar">
            <span className="catalog__count">Mostrando {products.length} dulces artesanales</span>
            <Select
              className="catalog__sort"
              options={['Relevancia', 'Precio: menor a mayor', 'Precio: mayor a menor', 'Más nuevos']}
              defaultValue="Relevancia"
            />
          </div>
          <ProductGrid products={products} columns={3} compact />
          <div className="pagination">
            <button className="pagination__item is-active">1</button>
            <button className="pagination__item">2</button>
            <button className="pagination__item">3</button>
            <button className="pagination__item pagination__item--next" aria-label="Siguiente">›</button>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default Catalog

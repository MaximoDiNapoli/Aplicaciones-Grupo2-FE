import PublicHeader from '../components/layout/PublicHeader'
import Footer from '../components/layout/Footer'
import AccountSidebar from '../components/layout/AccountSidebar'
import ProductGrid from '../components/product/ProductGrid'
import { Checkbox, Select } from '../components/ui/Field'
import Pagination, { usePager } from '../components/ui/Pagination'
import { products } from '../data/mock'

const catFilters = ['Ositos', 'Mariposas', 'Insectos', 'Leones']

// Catálogo: sidebar de cuenta + panel de filtros + grilla + paginación.
function Catalog() {
  const { page, setPage, total, totalPages, slice } = usePager(products, 6)
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
            <span className="catalog__count">Mostrando {total} dulces artesanales</span>
            <Select
              className="catalog__sort"
              options={['Relevancia', 'Precio: menor a mayor', 'Precio: mayor a menor', 'Más nuevos']}
              defaultValue="Relevancia"
            />
          </div>
          <ProductGrid products={slice} columns={3} compact />
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default Catalog

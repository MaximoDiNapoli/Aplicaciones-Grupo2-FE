import { useEffect, useMemo, useState } from 'react'
import PublicHeader from '../components/layout/PublicHeader'
import Footer from '../components/layout/Footer'
import AccountSidebar from '../components/layout/AccountSidebar'
import ProductGrid from '../components/product/ProductGrid'
import { Checkbox, Select } from '../components/ui/Field'
import Pagination, { usePager } from '../components/ui/Pagination'
import { fetchCategories, fetchProducts } from '../services/api'

// Catálogo: filtros por categoría, rango de precio y orden + grilla + paginación.
function Catalog() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cats, setCats] = useState([])
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')
  const [sort, setSort] = useState('Relevancia')

  useEffect(() => {
    let alive = true

    Promise.all([fetchCategories(), fetchProducts()])
      .then(([nextCategories, nextProducts]) => {
        if (!alive) return
        setCategories(nextCategories)
        setProducts(nextProducts)
        setError('')
      })
      .catch((err) => {
        if (!alive) return
        setError(err.message || 'No se pudo cargar el catálogo')
      })
      .finally(() => {
        if (alive) setLoading(false)
      })

    return () => { alive = false }
  }, [])

  const toggleCat = (id) =>
    setCats((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))

  const filtered = useMemo(() => {
    let next = products.filter((p) => {
      if (cats.length && !cats.includes(p.category)) return false
      if (min !== '' && p.price < Number(min)) return false
      if (max !== '' && p.price > Number(max)) return false
      return true
    })
    if (sort === 'Precio: menor a mayor') next = [...next].sort((a, b) => a.price - b.price)
    else if (sort === 'Precio: mayor a menor') next = [...next].sort((a, b) => b.price - a.price)
    else if (sort === 'Más nuevos') next = [...next].reverse()
    return next
  }, [cats, max, min, products, sort])

  const { page, setPage, total, totalPages, slice } = usePager(
    filtered,
    6,
    `${cats.join(',')}|${min}|${max}|${sort}`,
  )

  return (
    <div className="page">
      <PublicHeader />
      <div className="catalog">
        <AccountSidebar activeItem="tienda" />
        <aside className="filter-panel">
          <h3 className="filter-panel__title">Filtros</h3>
          <div className="filter-panel__group">
            <span className="filter-panel__label">CATEGORÍA</span>
            {loading && <p className="catalog__empty">Cargando filtros...</p>}
            {!loading && categories.map((c) => (
              <Checkbox key={c.id} label={c.name} checked={cats.includes(c.slug)} onChange={() => toggleCat(c.slug)} />
            ))}
          </div>
          <div className="filter-panel__group">
            <span className="filter-panel__label">RANGO DE PRECIO</span>
            <div className="filter-panel__range">
              <input className="filter-panel__price" type="number" min="0" placeholder="$0" value={min} onChange={(e) => setMin(e.target.value)} />
              <span>—</span>
              <input className="filter-panel__price" type="number" min="0" placeholder="$50+" value={max} onChange={(e) => setMax(e.target.value)} />
            </div>
          </div>
        </aside>
        <main className="catalog__content">
          <div className="catalog__toolbar">
            <span className="catalog__count">{loading ? 'Cargando productos desde el backend...' : `Mostrando ${total} productos`}</span>
            <Select
              className="catalog__sort"
              options={['Relevancia', 'Precio: menor a mayor', 'Precio: mayor a menor', 'Más nuevos']}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            />
          </div>
          {error ? (
            <p className="catalog__empty">{error}</p>
          ) : total === 0 ? (
            <p className="catalog__empty">No encontramos dulces con esos filtros. Probá ajustar la categoría o el precio.</p>
          ) : (
            <>
              <ProductGrid products={slice} columns={3} compact />
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </>
          )}
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default Catalog

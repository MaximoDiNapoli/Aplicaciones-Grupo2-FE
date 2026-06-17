import { useEffect, useState } from 'react'
import PublicStoreLayout from '../components/layout/PublicStoreLayout'
import CategoryCard from '../components/product/CategoryCard'
import ProductGrid from '../components/product/ProductGrid'
import SectionHeader from '../components/common/SectionHeader'
import Button from '../components/ui/Button'
import { fetchCategories, fetchProducts } from '../services/api'

// Inicio - hero + habitats (categorías) + descubrimientos destacados.
function Home() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  const featured = products.slice(0, 3)
  return (
    <PublicStoreLayout>
      <section className="hero">
        <div className="hero__text">
          <h1 className="hero__title">Bienvenida al Safari más Dulce</h1>
          <p className="hero__copy">
            Descubre nuestra colección artesanal de chocolates y malvaviscos
            inspirados en la vida salvaje. Elaborados con magia, solo para ti.
          </p>
          <Button to="/catalogo" size="lg">Explora lo Salvaje</Button>
        </div>
        <div className="hero__art" />
      </section>

      <section className="home-section">
        <h2 className="home-section__center-title">Explora los Hábitats</h2>
        {error && <p className="catalog__empty">{error}</p>}
        {!error && loading ? (
          <p className="catalog__empty">Cargando categorías y productos desde el backend...</p>
        ) : (
          <div className="category-grid">
            {categories.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        )}
      </section>

      <section className="home-section">
        <SectionHeader title="Descubrimientos Destacados" actionLabel="Ver Todo" to="/catalogo" />
        {loading && featured.length === 0 ? (
          <p className="catalog__empty">Cargando productos destacados...</p>
        ) : (
          <ProductGrid products={featured} columns={3} />
        )}
      </section>
    </PublicStoreLayout>
  )
}

export default Home

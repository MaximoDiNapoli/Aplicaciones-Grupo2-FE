import PublicStoreLayout from '../components/layout/PublicStoreLayout'
import CategoryCard from '../components/product/CategoryCard'
import ProductGrid from '../components/product/ProductGrid'
import SectionHeader from '../components/common/SectionHeader'
import Button from '../components/ui/Button'
import { categories, products } from '../data/mock'

// Inicio - hero + habitats (categorías) + descubrimientos destacados.
function Home() {
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
        <div className="category-grid">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      <section className="home-section">
        <SectionHeader title="Descubrimientos Destacados" actionLabel="Ver Todo" to="/catalogo" />
        <ProductGrid products={featured} columns={3} />
      </section>
    </PublicStoreLayout>
  )
}

export default Home

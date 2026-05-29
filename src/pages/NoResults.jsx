import PublicStoreLayout from '../components/layout/PublicStoreLayout'
import EmptyState from '../components/common/EmptyState'
import SectionHeader from '../components/common/SectionHeader'
import ProductGrid from '../components/product/ProductGrid'
import { products } from '../data/mock'

// Sin Resultados de búsqueda + recomendaciones.
function NoResults() {
  const recommended = products.slice(2, 6)
  return (
    <PublicStoreLayout>
      <EmptyState
        illustration={['#ff619b', '#c0265e']}
        emoji="🔍"
        title="¡Ups! Safari sin presas"
        message="No encontramos rastros de «Golosinas de dragón» en nuestra selva dulce."
        actions={[{ children: 'Volver a la tienda', to: '/catalogo', iconLeft: 'arrowLeft' }]}
      />
      <section className="home-section">
        <SectionHeader title="También te puede gustar" actionLabel="Ver todo" to="/catalogo" />
        <ProductGrid products={recommended} columns={4} compact />
      </section>
    </PublicStoreLayout>
  )
}

export default NoResults

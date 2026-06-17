import { useEffect, useState } from 'react'
import PublicStoreLayout from '../components/layout/PublicStoreLayout'
import EmptyState from '../components/common/EmptyState'
import SectionHeader from '../components/common/SectionHeader'
import ProductGrid from '../components/product/ProductGrid'
import { fetchProducts } from '../services/api'

// Sin Resultados de búsqueda + recomendaciones (reales del backend).
function NoResults() {
  const [recommended, setRecommended] = useState([])

  useEffect(() => {
    let alive = true
    fetchProducts()
      .then((products) => { if (alive) setRecommended(products.slice(2, 6)) })
      .catch(() => { if (alive) setRecommended([]) })
    return () => { alive = false }
  }, [])

  return (
    <PublicStoreLayout>
      <EmptyState
        illustration={['#ff619b', '#c0265e']}
        emoji="🔍"
        title="¡Ups! Safari sin presas"
        message="No encontramos rastros de «Golosinas de dragón» en nuestra selva dulce."
        actions={[{ children: 'Volver a la tienda', to: '/catalogo', iconLeft: 'arrowLeft' }]}
      />
      {recommended.length > 0 && (
        <section className="home-section">
          <SectionHeader title="También te puede gustar" actionLabel="Ver todo" to="/catalogo" />
          <ProductGrid products={recommended} columns={4} compact />
        </section>
      )}
    </PublicStoreLayout>
  )
}

export default NoResults

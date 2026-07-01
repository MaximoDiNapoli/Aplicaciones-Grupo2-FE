import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PublicStoreLayout from '../components/layout/PublicStoreLayout'
import EmptyState from '../components/common/EmptyState'
import SectionHeader from '../components/common/SectionHeader'
import ProductGrid from '../components/product/ProductGrid'
import { selectProducts } from '../features/products/productsSlice'
import { loadProducts } from '../features/products/productsThunks'

// Sin Resultados de búsqueda + recomendaciones (reales del backend, slice `products`).
function NoResults() {
  const dispatch = useDispatch()
  const products = useSelector(selectProducts)

  // Reutiliza el catálogo ya cargado en el store; solo pide al backend si está vacío.
  useEffect(() => {
    if (!products.length) dispatch(loadProducts())
  }, [dispatch, products.length])

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

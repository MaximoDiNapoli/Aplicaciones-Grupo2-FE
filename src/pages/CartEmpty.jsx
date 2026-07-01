import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PublicStoreLayout from '../components/layout/PublicStoreLayout'
import EmptyState from '../components/common/EmptyState'
import SectionHeader from '../components/common/SectionHeader'
import ProductGrid from '../components/product/ProductGrid'
import { selectProducts } from '../features/products/productsSlice'
import { loadProducts } from '../features/products/productsThunks'

// Carrito vacío: estado vacío + golosinas más buscadas (reales del backend, slice `products`).
function CartEmpty() {
  const dispatch = useDispatch()
  const products = useSelector(selectProducts)

  // Reutiliza el catálogo ya cargado en el store; solo pide al backend si está vacío.
  useEffect(() => {
    if (!products.length) dispatch(loadProducts())
  }, [dispatch, products.length])

  const popular = products.slice(0, 3)

  return (
    <PublicStoreLayout>
      <EmptyState
        illustration={['#b07a4a', '#6b4423']}
        emoji="🐻"
        title="Tu safari de dulces está vacío"
        message="Parece que aún no has atrapado ninguna de nuestras delicias artesanales. ¡Explora la jungla de sabores y llena tu fauna!"
        actions={[{ children: 'Explorar Golosinas', to: '/catalogo', iconLeft: 'store' }]}
      />
      {popular.length > 0 && (
        <section className="home-section">
          <SectionHeader title="Golosinas más buscadas" icon={<span className="section-header__heart">♡ </span>} />
          <ProductGrid products={popular} columns={3} />
        </section>
      )}
    </PublicStoreLayout>
  )
}

export default CartEmpty

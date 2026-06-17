import { useEffect, useState } from 'react'
import PublicStoreLayout from '../components/layout/PublicStoreLayout'
import EmptyState from '../components/common/EmptyState'
import SectionHeader from '../components/common/SectionHeader'
import ProductGrid from '../components/product/ProductGrid'
import { fetchProducts } from '../services/api'

// Carrito vacío: estado vacío + golosinas más buscadas (reales del backend).
function CartEmpty() {
  const [popular, setPopular] = useState([])

  useEffect(() => {
    let alive = true
    fetchProducts()
      .then((products) => { if (alive) setPopular(products.slice(0, 3)) })
      .catch(() => { if (alive) setPopular([]) })
    return () => { alive = false }
  }, [])

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

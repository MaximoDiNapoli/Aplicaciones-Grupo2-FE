import ProductCard from './ProductCard'

// Grilla de productos. columns: 2 | 3 | 4
function ProductGrid({ products = [], columns = 3, compact = false }) {
  return (
    <div className={`product-grid product-grid--${columns}`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} compact={compact} />
      ))}
    </div>
  )
}

export default ProductGrid

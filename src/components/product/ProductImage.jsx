// Placeholder de imagen de producto basado en gradiente (offline-safe).
// g: [colorA, colorB]; ratio controla la forma.
function ProductImage({ g = ['#ffb15a', '#ff8c42'], radius = 'var(--radius)', className = '', style }) {
  return (
    <div
      className={`product-image ${className}`.trim()}
      style={{
        background: `radial-gradient(120% 120% at 30% 25%, ${g[0]} 0%, ${g[1]} 100%)`,
        borderRadius: radius,
        ...style,
      }}
      aria-hidden="true"
    >
      <span className="product-image__shine" />
    </div>
  )
}

export default ProductImage

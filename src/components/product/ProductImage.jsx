import { useState } from 'react'

// Imagen de producto: si `src` está disponible muestra la foto real del backend;
// si no hay foto o falla la carga (404), cae al placeholder de gradiente (offline-safe).
// g: [colorA, colorB]; ratio controla la forma.
function ProductImage({ g = ['#ffb15a', '#ff8c42'], radius = 'var(--radius)', className = '', style, src, alt = '' }) {
  // Guarda el src que falló; al cambiar `src` se vuelve a intentar sin usar un efecto.
  const [failedSrc, setFailedSrc] = useState(null)
  const showImage = Boolean(src) && failedSrc !== src

  return (
    <div
      className={`product-image ${className}`.trim()}
      style={{
        background: `radial-gradient(120% 120% at 30% 25%, ${g[0]} 0%, ${g[1]} 100%)`,
        borderRadius: radius,
        ...style,
      }}
      aria-hidden={showImage ? undefined : 'true'}
    >
      {showImage && (
        <img
          className="product-image__img"
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailedSrc(src)}
        />
      )}
      <span className="product-image__shine" />
    </div>
  )
}

export default ProductImage

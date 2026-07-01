import { normalizeProduct } from '../../services/api'

// ---- Reglas de precios (única fuente de verdad para carrito y checkout) ----
export const PRICING = {
  freeShippingFrom: 50, // envío gratis a partir de este subtotal
  flatShipping: 5, // costo de envío cuando no aplica el gratis
  taxRate: 0.08, // impuestos estimados (8%)
  memberDiscountFrom: 100, // subtotal mínimo para el descuento de miembro
  memberDiscount: 30, // monto fijo del descuento de miembro
}

// Costo de envío para un subtotal dado.
export const shippingFor = (subtotal) =>
  subtotal === 0 || subtotal >= PRICING.freeShippingFrom ? 0 : PRICING.flatShipping

// ¿El usuario es comprador logueado? -> su carrito se persiste en el backend.
export const isComprador = (user) => String(user?.rol || '').toUpperCase().includes('COMPRADOR')

// Normaliza un producto (catálogo o detalle) al formato de ítem del carrito local.
export const toLocalItem = (product, qty) => ({
  id: product.id,
  itemId: null,
  name: product.name,
  variant: product.variant || product.tagline || '',
  price: product.price,
  qty,
  g: product.g,
  imageUrl: product.imageUrl,
})

// Mapea un DetalleCarrito del backend al formato de ítem del carrito.
export const toBackendItem = (detalle) => {
  const np = normalizeProduct(detalle.producto || {})
  return {
    id: np.id ?? detalle.producto?.id,
    itemId: detalle.id,
    name: np.name,
    variant: np.tagline || '',
    price: Number(detalle.precioUnitario ?? np.price ?? 0),
    qty: detalle.cantidad,
    g: np.g,
    imageUrl: np.imageUrl,
  }
}

// Arma el resumen del checkout a partir del carrito real (sin impuestos: el envío
// y el descuento de miembro se muestran en los pasos del checkout).
export function buildCheckoutSummary(items, subtotal) {
  const shipping = shippingFor(subtotal)
  const discount = subtotal >= PRICING.memberDiscountFrom ? PRICING.memberDiscount : 0
  return {
    items: items.map((it) => ({
      id: it.id,
      name: it.name,
      variant: it.variant,
      qty: it.qty,
      price: it.price * it.qty,
      unitPrice: it.price,
      g: it.g,
      imageUrl: it.imageUrl,
    })),
    count: items.reduce((n, it) => n + it.qty, 0),
    subtotal,
    shipping,
    discount,
    total: subtotal + shipping - discount,
  }
}

import ProductImage from '../product/ProductImage'
import { QuantityStepper, formatPrice } from '../ui/Misc'
import Icon from '../ui/Icon'

// Fila de item del carrito: imagen, nombre/variante, precio unit, cantidad, subtotal, quitar.
function CartItemRow({ item, onQtyChange, onRemove }) {
  return (
    <div className="cart-row">
      <ProductImage g={item.g} src={item.imageUrl} alt={item.name} className="cart-row__img" />
      <div className="cart-row__info">
        <div className="cart-row__name">{item.name}</div>
        {item.variant && <div className="cart-row__variant">{item.variant}</div>}
      </div>
      <div className="cart-row__unit">{formatPrice(item.price)}</div>
      <QuantityStepper value={item.qty} onChange={(q) => onQtyChange?.(item.id, q)} />
      <div className="cart-row__total">{formatPrice(item.price * item.qty)}</div>
      <button type="button" className="cart-row__remove" aria-label="Quitar" onClick={() => onRemove?.(item.id)}>
        <Icon name="close" size={18} strokeFill />
      </button>
    </div>
  )
}

export default CartItemRow

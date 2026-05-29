import PublicStoreLayout from '../components/layout/PublicStoreLayout'
import CartItemRow from '../components/common/CartItemRow'
import OrderSummaryCard from '../components/common/OrderSummaryCard'
import Icon from '../components/ui/Icon'
import { formatPrice } from '../components/ui/Misc'
import CartEmpty from './CartEmpty'
import { useCart } from '../store/cart'

const FREE_SHIPPING = 50

// Carrito: banner envío gratis + items + resumen. Si está vacío muestra CartEmpty.
function Cart() {
  const { items, subtotal, setQty, remove } = useCart()
  if (items.length === 0) return <CartEmpty />

  const shipping = subtotal >= FREE_SHIPPING ? 0 : 5
  const taxes = +(subtotal * 0.08).toFixed(2)
  const missing = Math.max(0, FREE_SHIPPING - subtotal)

  return (
    <PublicStoreLayout>
      <h1 className="cart__title">Tu Carrito de Safari</h1>
      <div className="cart">
        <div className="cart__main">
          {missing > 0 && (
            <div className="info-banner">
              <Icon name="truck" size={20} strokeFill />
              ¡Faltan {formatPrice(missing)} para envío gratis!
            </div>
          )}
          <div className="cart__items">
            {items.map((it) => (
              <div className="cart__item-card" key={it.id}>
                <CartItemRow item={it} onQtyChange={setQty} onRemove={remove} />
              </div>
            ))}
          </div>
        </div>
        <OrderSummaryCard
          subtotal={subtotal}
          shipping={shipping}
          taxes={taxes}
          ctaLabel="Proceder al Pago"
          ctaTo="/checkout/envio"
        />
      </div>
    </PublicStoreLayout>
  )
}

export default Cart

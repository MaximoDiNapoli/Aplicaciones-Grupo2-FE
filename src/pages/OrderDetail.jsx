import { Link } from 'react-router-dom'
import PublicHeader from '../components/layout/PublicHeader'
import Footer from '../components/layout/Footer'
import OrderStatusStepper from '../components/common/OrderStatusStepper'
import ProductImage from '../components/product/ProductImage'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { formatPrice } from '../components/ui/Misc'
import { orderDetail as o } from '../data/mock'

// Detalle de Compra: estado, items, totales, dirección y método de pago.
function OrderDetail() {
  return (
    <div className="page">
      <PublicHeader />
      <div className="order-detail-bar">
        <Link to="/compras" className="back-link"><Icon name="arrowLeft" size={18} strokeFill /> Volver a Mi Cuenta Safari</Link>
      </div>
      <main className="order-detail">
        <div className="order-detail__header">
          <div>
            <h1 className="order-detail__id">Orden #{o.id}</h1>
            <p className="order-detail__date">Realizada el {o.date}</p>
          </div>
          <Button iconLeft="download">Descargar Factura</Button>
        </div>

        <section className="card order-status">
          <h2 className="order-status__title"><Icon name="truck" size={20} strokeFill /> Estado: Enviado</h2>
          <OrderStatusStepper steps={o.statusSteps} current={o.currentStep} />
          <div className="status-banner">
            <Icon name="info" size={20} strokeFill className="status-banner__icon" />
            <div>
              <strong>Entrega estimada: {o.eta}</strong>
              <p>Tu dulce safari está en camino con Express Couriers. Seguimiento: {o.tracking}.</p>
            </div>
          </div>
        </section>

        <section className="card order-items">
          <h2 className="order-items__title">Selección de Dulces</h2>
          {o.items.map((it) => (
            <div className="order-item" key={it.id}>
              <ProductImage g={it.g} className="order-item__img" />
              <div className="order-item__info">
                <div className="order-item__name">{it.name}</div>
                <div className="order-item__variant">{it.variant}</div>
              </div>
              <div className="order-item__right">
                <div className="order-item__qty">Cant: {it.qty}</div>
                <div className="order-item__price">{formatPrice(it.price)}</div>
              </div>
            </div>
          ))}
          <div className="order-totals">
            <div><span>Subtotal</span><span>{formatPrice(o.totals.subtotal)}</span></div>
            <div><span>Envío (Express)</span><span>{formatPrice(o.totals.shipping)}</span></div>
            <div><span>Impuestos</span><span>{formatPrice(o.totals.taxes)}</span></div>
            <div className="order-totals__total"><span>Total</span><span>{formatPrice(o.totals.total)}</span></div>
          </div>
        </section>

        <div className="order-detail__cards">
          <section className="card info-card">
            <h3 className="info-card__title"><Icon name="pin" size={18} strokeFill /> Dirección de envío</h3>
            <div className="info-card__name">{o.address.name}</div>
            {o.address.lines.map((l) => <div key={l} className="info-card__line">{l}</div>)}
          </section>
          <section className="card info-card">
            <h3 className="info-card__title"><Icon name="card" size={18} strokeFill /> Método de pago</h3>
            <div className="info-card__pay">
              <span className="card-chip">{o.payment.brand}</span>
              <div>
                <div className="info-card__name">Visa terminada en •••• {o.payment.last4}</div>
                <div className="info-card__line">{o.payment.note}</div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default OrderDetail

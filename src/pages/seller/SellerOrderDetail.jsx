import { Link } from 'react-router-dom'
import { SellerLayout, Pill, pillTone, cap } from '../../components/dashboard/shells'
import OrderStatusStepper from '../../components/common/OrderStatusStepper'
import ProductImage from '../../components/product/ProductImage'
import Button from '../../components/ui/Button'
import Icon from '../../components/ui/Icon'
import { formatPrice } from '../../components/ui/Misc'
import { sellerOrderDetail as o } from '../../data/mock'

// Detalle de Orden (vendedor): estado + cliente/envío/pago + artículos.
function SellerOrderDetail() {
  return (
    <SellerLayout active="ventas">
      <div className="dash-pagetitle dash-pagetitle--form">
        <div>
          <nav className="crumbs"><Link to="/vendedor/ventas"><Icon name="arrowLeft" size={13} strokeFill /> Volver a Ventas</Link></nav>
          <h1 className="dash-pagetitle__title">Orden #{o.id} <Pill tone={pillTone(o.status)}>{cap(o.status)}</Pill></h1>
          <p className="dash-pagetitle__sub">Realizado el {o.date}</p>
        </div>
        <div className="dash-pagetitle__actions">
          <Button variant="outline" iconLeft="printer">Imprimir</Button>
          <Button iconLeft="refresh">Cambiar estado</Button>
        </div>
      </div>

      <section className="form-card">
        <OrderStatusStepper steps={o.steps} current={o.currentStep} />
      </section>

      <div className="sod-cards">
        <section className="form-card">
          <h2 className="form-card__title"><Icon name="user" size={18} strokeFill /> Cliente</h2>
          <div className="adm-strong">{o.customer.name}</div>
          <div className="adm-muted">{o.customer.email}</div>
          <div className="adm-muted">{o.customer.phone}</div>
          <Button variant="outline" block iconLeft="mail" className="sod-contact">Contactar cliente</Button>
        </section>
        <section className="form-card">
          <h2 className="form-card__title"><Icon name="pin" size={18} strokeFill /> Dirección de Envío</h2>
          {o.address.map((l) => <div key={l} className="adm-muted sod-addr">{l}</div>)}
          <div className="sod-notes"><strong>Notas:</strong> {o.notes}</div>
        </section>
        <section className="form-card">
          <h2 className="form-card__title"><Icon name="card" size={18} strokeFill /> Método de Pago</h2>
          <div className="info-card__pay"><span className="card-chip">{o.payment.brand}</span> <span>Visa terminada en {o.payment.last4}</span></div>
          <div className="adm-muted sod-addr">{o.payment.note}</div>
        </section>
      </div>

      <section className="form-card">
        <div className="panel__head"><h2 className="form-card__title">Artículos del Vendedor</h2><span className="adm-muted">{o.items.length} items</span></div>
        <div className="adm-table">
          <div className="adm-table__head" style={{ gridTemplateColumns: '2fr 0.8fr 1fr 1fr' }}>
            <span>Producto</span><span className="ta-right">Cantidad</span><span className="ta-right">Precio</span><span className="ta-right">Subtotal</span>
          </div>
          {o.items.map((it) => (
            <div className="adm-table__row" key={it.id} style={{ gridTemplateColumns: '2fr 0.8fr 1fr 1fr' }}>
              <span className="adm-cell-user"><ProductImage g={it.g} className="adm-thumb" /> <span className="adm-strong">{it.name}</span></span>
              <span className="ta-right">{it.qty}</span>
              <span className="ta-right adm-muted">{formatPrice(it.price)}</span>
              <span className="ta-right adm-strong">{formatPrice(it.price * it.qty)}</span>
            </div>
          ))}
        </div>
        <div className="sod-totals">
          <div><span>Subtotal Vendedor</span><span>{formatPrice(o.subtotal)}</span></div>
          <div className="sod-totals__grand"><span>Total a cobrar</span><span>{formatPrice(o.total)}</span></div>
        </div>
      </section>
    </SellerLayout>
  )
}

export default SellerOrderDetail

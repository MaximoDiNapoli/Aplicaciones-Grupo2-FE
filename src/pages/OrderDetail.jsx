import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PublicHeader from '../components/layout/PublicHeader'
import Footer from '../components/layout/Footer'
import OrderStatusStepper from '../components/common/OrderStatusStepper'
import ProductImage from '../components/product/ProductImage'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { formatPrice } from '../components/ui/Misc'
import { useToast } from '../store/toast'
import { fetchOrderById, fetchOrderItems, fetchProducts } from '../services/api'

// Detalle de Compra: estado, items, totales, dirección y método de pago.
function OrderDetail() {
  const notify = useToast()
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [items, setItems] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true

    Promise.all([fetchOrderById(id), fetchOrderItems(id), fetchProducts().catch(() => [])])
      .then(([nextOrder, nextItems, nextProducts]) => {
        if (!alive) return
        setOrder(nextOrder)
        setItems(nextItems)
        setProducts(nextProducts)
        setError('')
      })
      .catch((err) => {
        if (!alive) return
        setError(err.message || 'No se pudo cargar el detalle')
      })
      .finally(() => {
        if (alive) setLoading(false)
      })

    return () => { alive = false }
  }, [id])

  const productById = useMemo(() => Object.fromEntries(products.map((product) => [product.id, product])), [products])
  const steps = useMemo(() => {
    const current = String(order?.estado?.nombre || 'procesando').toLowerCase()
    const labels = ['pendiente', 'procesando', 'enviado', 'entregado']
    return labels.map((label) => ({ id: label, label: label.charAt(0).toUpperCase() + label.slice(1), icon: label === 'procesando' ? 'refresh' : label === 'enviado' ? 'truck' : label === 'entregado' ? 'home' : 'checkCircle' }))
      .map((step, index) => ({ ...step, active: labels.indexOf(current) >= index }))
  }, [order])

  if (loading) {
    return <div className="page"><PublicHeader /><p className="catalog__empty">Cargando detalle de compra...</p><Footer /></div>
  }

  if (error || !order) {
    return <div className="page"><PublicHeader /><p className="catalog__empty">{error || 'No encontramos esta compra.'}</p><Footer /></div>
  }

  const status = String(order.estado?.nombre || 'procesando').toLowerCase()
  const detailItems = items.map((it) => {
    const product = productById[it.idProducto]
    return {
      id: it.id,
      name: product?.name || `Producto #${it.idProducto}`,
      variant: product?.categoryName || 'Detalle de compra',
      qty: it.cantidad,
      price: Number(it.precioUnitario || 0),
      g: product?.g || ['#ff8c42', '#ff619b'],
    }
  })
  const totals = {
    subtotal: detailItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    shipping: 0,
    taxes: 0,
    total: Number(order.total || 0),
  }
  return (
    <div className="page">
      <PublicHeader />
      <div className="order-detail-bar">
        <Link to="/compras" className="back-link"><Icon name="arrowLeft" size={18} strokeFill /> Volver a Mi Cuenta Safari</Link>
      </div>
      <main className="order-detail">
        <div className="order-detail__header">
          <div>
            <h1 className="order-detail__id">Orden #{order.id}</h1>
            <p className="order-detail__date">Realizada el {order.fechaCompra ? new Date(order.fechaCompra).toLocaleString('es-AR') : 'Sin fecha'}</p>
          </div>
          <Button iconLeft="download" onClick={() => notify(`Descargando factura de la orden #${order.id}…`)}>Descargar Factura</Button>
        </div>

        <section className="card order-status">
          <h2 className="order-status__title"><Icon name="truck" size={20} strokeFill /> Estado: {status}</h2>
          <OrderStatusStepper steps={steps} current={Math.max(0, steps.findIndex((step) => step.id === status))} />
          <div className="status-banner">
            <Icon name="info" size={20} strokeFill className="status-banner__icon" />
            <div>
              <strong>Entrega estimada: pendiente de cálculo</strong>
              <p>Tu compra fue procesada por el backend y ya puede seguirse desde esta vista.</p>
            </div>
          </div>
        </section>

        <section className="card order-items">
          <h2 className="order-items__title">Selección de Dulces</h2>
          {detailItems.map((it) => (
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
            <div><span>Subtotal</span><span>{formatPrice(totals.subtotal)}</span></div>
            <div><span>Envío (Express)</span><span>{formatPrice(totals.shipping)}</span></div>
            <div><span>Impuestos</span><span>{formatPrice(totals.taxes)}</span></div>
            <div className="order-totals__total"><span>Total</span><span>{formatPrice(totals.total)}</span></div>
          </div>
        </section>

        <div className="order-detail__cards">
          <section className="card info-card">
            <h3 className="info-card__title"><Icon name="pin" size={18} strokeFill /> Dirección de envío</h3>
            <div className="info-card__name">{order.direccionEnvio?.direccion || 'Dirección no disponible'}</div>
            <div className="info-card__line">{order.direccionEnvio?.ciudad || 'Ciudad no disponible'}</div>
          </section>
          <section className="card info-card">
            <h3 className="info-card__title"><Icon name="card" size={18} strokeFill /> Método de pago</h3>
            <div className="info-card__pay">
              <span className="card-chip">{order.metodoPago?.tipo || order.metodoPago?.nombre || 'Pago'}</span>
              <div>
                <div className="info-card__name">Método registrado en backend</div>
                <div className="info-card__line">Estado de compra: {status}</div>
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

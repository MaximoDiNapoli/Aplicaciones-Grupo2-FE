import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SellerLayout, Pill, pillTone, cap } from '../../components/dashboard/shells'
import { Select } from '../../components/ui/Field'
import ProductImage from '../../components/product/ProductImage'
import Button from '../../components/ui/Button'
import Icon from '../../components/ui/Icon'
import { formatPrice } from '../../components/ui/Misc'
import { useToast } from '../../store/toast'
import { fetchOrderById, fetchOrderItems, fetchProducts, fetchEstados, updateOrderStatus } from '../../services/api'

// Detalle de Orden (vendedor): datos reales + cambio de estado contra el backend.
function SellerOrderDetail() {
  const { id } = useParams()
  const notify = useToast()
  const [order, setOrder] = useState(null)
  const [items, setItems] = useState([])
  const [products, setProducts] = useState([])
  const [estados, setEstados] = useState([])
  const [estadoId, setEstadoId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let alive = true

    Promise.all([
      fetchOrderById(id),
      fetchOrderItems(id).catch(() => []),
      fetchProducts().catch(() => []),
      fetchEstados().catch(() => []),
    ])
      .then(([nextOrder, nextItems, nextProducts, nextEstados]) => {
        if (!alive) return
        setOrder(nextOrder)
        setItems(nextItems)
        setProducts(nextProducts)
        setEstados(nextEstados)
        setEstadoId(nextOrder.idEstado ? String(nextOrder.idEstado) : '')
        setError('')
      })
      .catch((err) => {
        if (!alive) return
        setError(err.message || 'No se pudo cargar la orden')
      })
      .finally(() => {
        if (alive) setLoading(false)
      })

    return () => { alive = false }
  }, [id, reloadKey])

  const productById = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products])

  const changeStatus = async () => {
    if (!estadoId || Number(estadoId) === order.idEstado) return
    setSaving(true)
    try {
      await updateOrderStatus(id, Number(estadoId))
      notify('Estado de la orden actualizado')
      setReloadKey((k) => k + 1)
    } catch (err) {
      notify(err.message || 'No se pudo actualizar el estado')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <SellerLayout active="ventas"><p className="adm-table__empty">Cargando orden...</p></SellerLayout>
  }
  if (error || !order) {
    return <SellerLayout active="ventas"><p className="adm-table__empty">{error || 'Orden no encontrada.'}</p></SellerLayout>
  }

  const status = String(order.estado?.nombre || 'pendiente').toLowerCase()
  const detailItems = items.map((it) => {
    const product = productById[it.idProducto]
    return {
      id: it.id,
      name: product?.name || `Producto #${it.idProducto}`,
      qty: it.cantidad,
      price: Number(it.precioUnitario || 0),
      subtotal: Number(it.subtotal || it.precioUnitario * it.cantidad || 0),
      g: product?.g || ['#ff8c42', '#ff619b'],
    }
  })
  const subtotal = detailItems.reduce((sum, it) => sum + it.subtotal, 0)

  return (
    <SellerLayout active="ventas">
      <div className="dash-pagetitle dash-pagetitle--form">
        <div>
          <nav className="crumbs"><Link to="/vendedor/ventas"><Icon name="arrowLeft" size={13} strokeFill /> Volver a Ventas</Link></nav>
          <h1 className="dash-pagetitle__title">Orden #{order.id} <Pill tone={pillTone(status)}>{cap(status)}</Pill></h1>
          <p className="dash-pagetitle__sub">Realizada el {order.fechaCompra ? new Date(order.fechaCompra).toLocaleString('es-AR') : 'Sin fecha'}</p>
        </div>
        <div className="dash-pagetitle__actions">
          <Button variant="outline" iconLeft="printer" onClick={() => window.print()}>Imprimir</Button>
        </div>
      </div>

      <section className="form-card" style={{ marginBottom: 20 }}>
        <h2 className="form-card__title">Cambiar estado</h2>
        <div className="dash-pagetitle__actions" style={{ alignItems: 'flex-end', gap: 12 }}>
          <Select
            label="Estado"
            value={estadoId}
            onChange={(e) => setEstadoId(e.target.value)}
            options={estados.map((es) => ({ value: String(es.id), label: es.nombre }))}
          />
          <Button iconLeft="refresh" onClick={changeStatus} disabled={saving || Number(estadoId) === order.idEstado}>
            {saving ? 'Guardando...' : 'Actualizar estado'}
          </Button>
        </div>
      </section>

      <div className="sod-cards">
        <section className="form-card">
          <h2 className="form-card__title"><Icon name="user" size={18} strokeFill /> Cliente</h2>
          <div className="adm-strong">Usuario #{order.idUsuario}</div>
        </section>
        <section className="form-card">
          <h2 className="form-card__title"><Icon name="pin" size={18} strokeFill /> Dirección de Envío</h2>
          <div className="adm-muted sod-addr">{order.direccionEnvio?.direccion || 'No disponible'}</div>
          <div className="adm-muted sod-addr">{order.direccionEnvio?.ciudad || ''}</div>
        </section>
        <section className="form-card">
          <h2 className="form-card__title"><Icon name="card" size={18} strokeFill /> Método de Pago</h2>
          <div className="info-card__pay"><span className="card-chip">{order.metodoPago?.tipo || 'Pago'}</span></div>
        </section>
      </div>

      <section className="form-card">
        <div className="panel__head"><h2 className="form-card__title">Artículos</h2><span className="adm-muted">{detailItems.length} items</span></div>
        <div className="adm-table">
          <div className="adm-table__head" style={{ gridTemplateColumns: '2fr 0.8fr 1fr 1fr' }}>
            <span>Producto</span><span className="ta-right">Cantidad</span><span className="ta-right">Precio</span><span className="ta-right">Subtotal</span>
          </div>
          {detailItems.map((it) => (
            <div className="adm-table__row" key={it.id} style={{ gridTemplateColumns: '2fr 0.8fr 1fr 1fr' }}>
              <span className="adm-cell-user"><ProductImage g={it.g} className="adm-thumb" /> <span className="adm-strong">{it.name}</span></span>
              <span className="ta-right">{it.qty}</span>
              <span className="ta-right adm-muted">{formatPrice(it.price)}</span>
              <span className="ta-right adm-strong">{formatPrice(it.subtotal)}</span>
            </div>
          ))}
          {detailItems.length === 0 && <div className="adm-table__empty">Sin artículos.</div>}
        </div>
        <div className="sod-totals">
          <div><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="sod-totals__grand"><span>Total</span><span>{formatPrice(Number(order.total || 0))}</span></div>
        </div>
      </section>
    </SellerLayout>
  )
}

export default SellerOrderDetail

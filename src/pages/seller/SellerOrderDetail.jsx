import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { SellerLayout, Pill, pillTone, cap } from '../../components/dashboard/shells'
import { Select } from '../../components/ui/Field'
import ProductImage from '../../components/product/ProductImage'
import Button from '../../components/ui/Button'
import Icon from '../../components/ui/Icon'
import { formatPrice } from '../../components/ui/Misc'
import { notify } from '../../features/ui/toastSlice'
import {
  selectCurrentOrder,
  selectOrderItems,
  selectOrdersError,
} from '../../features/orders/ordersSlice'
import { loadOrderById, loadOrderItems, updateOrderStatusThunk } from '../../features/orders/ordersThunks'
import { selectProducts } from '../../features/products/productsSlice'
import { loadProducts } from '../../features/products/productsThunks'
import { fetchEstados } from '../../services/api'

// Detalle de Orden (vendedor): datos reales + cambio de estado (slices orders+products).
// `estados` se carga por API directa (no tiene slice propio en esta entrega).
function SellerOrderDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const current = useSelector(selectCurrentOrder)
  const items = useSelector(selectOrderItems)
  const products = useSelector(selectProducts)
  const error = useSelector(selectOrdersError)
  const [estados, setEstados] = useState([])
  const [estadoId, setEstadoId] = useState('')
  const [saving, setSaving] = useState(false)
  const [estadoSyncId, setEstadoSyncId] = useState(null)

  useEffect(() => {
    dispatch(loadOrderById(id))
    dispatch(loadOrderItems(id))
    dispatch(loadProducts())
    fetchEstados().then(setEstados).catch(() => setEstados([]))
  }, [dispatch, id])

  // Guarda de id: el detalle del store debe corresponder a la ruta actual.
  const order = current && String(current.id) === String(id) ? current : null

  // Sincroniza el estado seleccionado cuando llega/cambia la orden (ajuste durante el render).
  if (order && order.id !== estadoSyncId) {
    setEstadoSyncId(order.id)
    setEstadoId(order.idEstado ? String(order.idEstado) : '')
  }

  const productById = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products])

  const changeStatus = async () => {
    if (!estadoId || Number(estadoId) === order.idEstado) return
    setSaving(true)
    const action = await dispatch(updateOrderStatusThunk({ id, idEstado: Number(estadoId) }))
    setSaving(false)
    if (action.error) {
      dispatch(notify(action.payload || 'No se pudo actualizar el estado'))
      return
    }
    dispatch(notify('Estado de la orden actualizado'))
    dispatch(loadOrderById(id)) // refresca el detalle con el nuevo estado
  }

  if (!order) {
    return <SellerLayout active="ventas"><p className="adm-table__empty">{error ? error : 'Cargando orden...'}</p></SellerLayout>
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

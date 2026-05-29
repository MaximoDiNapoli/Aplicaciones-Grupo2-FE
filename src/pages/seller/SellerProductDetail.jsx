import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SellerLayout, Pill, pillTone, cap } from '../../components/dashboard/shells'
import ProductImage from '../../components/product/ProductImage'
import Button from '../../components/ui/Button'
import Icon from '../../components/ui/Icon'
import { formatPrice } from '../../components/ui/Misc'
import { useToast } from '../../store/toast'
import { sellerProductDetail as p } from '../../data/mock'

// Detalle de Producto (vendedor): galería + estructura de precio, inventario y rendimiento.
function SellerProductDetail() {
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const notify = useToast()
  const remove = () => { notify('Producto eliminado'); navigate('/vendedor/inventario') }
  return (
    <SellerLayout active="inventario">
      <div className="dash-pagetitle dash-pagetitle--form">
        <div>
          <nav className="crumbs"><Link to="/vendedor/inventario"><Icon name="arrowLeft" size={13} strokeFill /> Volver al inventario</Link></nav>
          <h1 className="dash-pagetitle__title">{p.name} <Pill tone={pillTone(p.status)}>{cap(p.status)}</Pill></h1>
        </div>
        <div className="dash-pagetitle__actions">
          <Button variant="outline" iconLeft="trash" onClick={remove}>Eliminar</Button>
          <Button variant="outline" iconLeft="box" onClick={() => notify('Producto duplicado')}>Duplicar</Button>
          <Button iconLeft="pencil" onClick={() => navigate('/vendedor/inventario/nuevo')}>Editar</Button>
        </div>
      </div>

      <div className="spd-grid">
        <div className="spd-main">
          <ProductImage g={p.gallery[active]} className="spd-main__img" />
          <div className="spd-thumbs">
            {p.gallery.map((g, i) => (
              <button key={i} className={`spd-thumb${i === active ? ' is-active' : ''}`} onClick={() => setActive(i)}>
                <ProductImage g={g} radius="8px" />
              </button>
            ))}
          </div>
          <section className="form-card spd-desc">
            <h2 className="form-card__title">Descripción</h2>
            <p className="spd-desc__text">{p.description}</p>
            <h3 className="spd-desc__sub">Ingredientes Destacados</h3>
            <ul className="spd-desc__list">{p.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
          </section>
        </div>

        <aside className="spd-side">
          <section className="form-card">
            <h2 className="form-card__title">Estructura de Precio</h2>
            <div className="spd-line"><span>Precio Base</span><span className="adm-muted" style={{ textDecoration: 'line-through' }}>{formatPrice(p.basePrice)}</span></div>
            <div className="spd-line"><span>Descuento Mayoreo</span><Pill tone="brand">{p.discount}%</Pill></div>
            <div className="spd-line spd-line--final"><span>Precio Final</span><span className="spd-final">{formatPrice(p.finalPrice)}</span></div>
          </section>
          <section className="form-card">
            <h2 className="form-card__title">Detalles del Inventario</h2>
            <div className="spd-line"><span className="adm-muted">CATEGORÍA</span><span>{p.category}</span></div>
            <div className="spd-line"><span className="adm-muted">FECHA CREACIÓN</span><span>{p.created}</span></div>
            <div className="spd-line"><span className="adm-muted">ÚLTIMA ACTUALIZACIÓN</span><span>{p.updated}</span></div>
          </section>
          <section className="form-card">
            <h2 className="form-card__title">Rendimiento</h2>
            <div className="spd-perf"><span className="adm-muted">Ventas (Mes)</span><span className="spd-perf__value">{p.soldMonth.toLocaleString('es-MX')}</span></div>
          </section>
        </aside>
      </div>
    </SellerLayout>
  )
}

export default SellerProductDetail

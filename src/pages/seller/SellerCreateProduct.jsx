import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SellerLayout } from '../../components/dashboard/shells'
import { TextInput, Select } from '../../components/ui/Field'
import Button from '../../components/ui/Button'
import Icon from '../../components/ui/Icon'
import { useToast } from '../../store/toast'
import { categories } from '../../data/mock'

// Crear Producto (pantalla separada del listado). Form + uploader + preview de precio.
function SellerCreateProduct() {
  const navigate = useNavigate()
  const notify = useToast()
  const [discount, setDiscount] = useState(false)
  const save = () => { notify('Producto guardado'); navigate('/vendedor/inventario') }

  return (
    <SellerLayout active="inventario">
      <div className="dash-pagetitle dash-pagetitle--form">
        <div>
          <nav className="crumbs"><Link to="/vendedor/inventario">Inventario</Link> <Icon name="arrowRight" size={13} strokeFill /> <span>Crear Producto</span></nav>
          <h1 className="dash-pagetitle__title">Agregar Nuevo Producto</h1>
        </div>
        <div className="dash-pagetitle__actions">
          <Button variant="outline" to="/vendedor/inventario">Cancelar</Button>
          <Button iconLeft="check" onClick={save}>Guardar Producto</Button>
        </div>
      </div>

      <div className="create-grid">
        <div className="create-grid__main">
          <section className="form-card">
            <h2 className="form-card__title">Información Básica</h2>
            <TextInput label="Nombre del Producto *" placeholder="Ej. Gomitas de Osito Ácidas" />
            <Select label="Categoría" options={['Selecciona una categoría...', ...categories.map((c) => c.name)]} />
            <label className="field">
              <span className="field__label">Descripción</span>
              <textarea className="textarea" rows={4} placeholder="Describe el producto detalladamente..." />
            </label>
          </section>

          <section className="form-card">
            <h2 className="form-card__title">Precios e Inventario</h2>
            <TextInput label="Precio Base ($) *" icon="dollar" placeholder="0.00" />
            <div className="discount-toggle">
              <span>Aplicar Descuento</span>
              <button className={`toggle${discount ? ' is-on' : ''}`} onClick={() => setDiscount((v) => !v)} aria-label="Aplicar descuento">
                <span className="toggle__knob" />
              </button>
            </div>
            <div className={`discount-fields${discount ? '' : ' is-disabled'}`}>
              <TextInput label="Descuento (%)" placeholder="0" />
              <TextInput label="Inicio" placeholder="mm/dd/yyyy" />
              <TextInput label="Fin" placeholder="mm/dd/yyyy" />
            </div>
          </section>
        </div>

        <aside className="create-grid__side">
          <section className="form-card">
            <h2 className="form-card__title">Imágenes del Producto</h2>
            <button type="button" className="uploader" onClick={() => notify('Selector de archivos (demo)')}>
              <Icon name="upload" size={34} strokeFill className="uploader__icon" />
              <p><strong>Haz clic para subir</strong> o arrastra y suelta</p>
              <span className="uploader__hint">SVG, PNG, JPG (Máx. 5MB)</span>
            </button>
            <div className="uploader__thumbs">
              <div className="uploader__thumb"><Icon name="image" size={22} strokeFill /></div>
              <button type="button" className="uploader__thumb uploader__thumb--add" onClick={() => notify('Selector de archivos (demo)')}><Icon name="plus" size={20} strokeFill /></button>
            </div>
          </section>

          <section className="price-preview">
            <span className="price-preview__label">VISTA PREVIA DEL PRECIO</span>
            <div className="price-preview__line"><span>Precio Base</span><span>$0.00</span></div>
            <div className="price-preview__line"><span>Descuento (0%)</span><span>-$0.00</span></div>
            <div className="price-preview__final"><span>Precio Final</span><span>$0.00</span></div>
            <div className="price-preview__ok"><Icon name="checkCircle" size={14} strokeFill /> Cálculo válido</div>
          </section>
        </aside>
      </div>
    </SellerLayout>
  )
}

export default SellerCreateProduct

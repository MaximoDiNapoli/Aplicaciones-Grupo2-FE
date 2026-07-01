import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { SellerLayout } from '../../components/dashboard/shells'
import { TextInput, Select } from '../../components/ui/Field'
import Button from '../../components/ui/Button'
import Icon from '../../components/ui/Icon'
import { formatPrice } from '../../components/ui/Misc'
import { notify } from '../../features/ui/toastSlice'
import { selectCategories, selectCategoriesLoading } from '../../features/categories/categoriesSlice'
import { loadCategories } from '../../features/categories/categoriesThunks'
import { selectCurrentProduct } from '../../features/products/productsSlice'
import { createProductThunk, loadProductById, updateProductThunk } from '../../features/products/productsThunks'

function buildInitialForm(product) {
  const hasDiscount = Boolean(product?.oldPrice && product.oldPrice > product.price)
  return {
    nombre: product?.name || '',
    categoriaId: product?.categoryId ?? '',
    descripcion: product?.description || '',
    precio: product ? String(hasDiscount ? product.oldPrice : product.price ?? '') : '',
    stock: product ? String(product.stock ?? '') : '',
    discount: hasDiscount,
    descuento: hasDiscount && product?.oldPrice ? String(Math.round((1 - product.price / product.oldPrice) * 100)) : '',
    descuentoInicio: '',
    descuentoFin: '',
    image: null,
  }
}

const MAX_IMAGE_MB = 10 // debe coincidir con spring.servlet.multipart.max-file-size del backend

function ProductForm({ initialProduct, isEditMode }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const categories = useSelector(selectCategories)
  const categoryOptions = [{ value: '', label: 'Selecciona una categoría...' }, ...categories.map((c) => ({ value: c.id, label: c.name }))]
  const [nombre, setNombre] = useState(() => buildInitialForm(initialProduct).nombre)
  const [categoriaId, setCategoriaId] = useState(() => buildInitialForm(initialProduct).categoriaId)
  const [descripcion, setDescripcion] = useState(() => buildInitialForm(initialProduct).descripcion)
  const [precio, setPrecio] = useState(() => buildInitialForm(initialProduct).precio)
  const [stock, setStock] = useState(() => buildInitialForm(initialProduct).stock)
  const [discount, setDiscount] = useState(() => buildInitialForm(initialProduct).discount)
  const [descuento, setDescuento] = useState(() => buildInitialForm(initialProduct).descuento)
  const [descuentoInicio, setDescuentoInicio] = useState(() => buildInitialForm(initialProduct).descuentoInicio)
  const [descuentoFin, setDescuentoFin] = useState(() => buildInitialForm(initialProduct).descuentoFin)
  const [image, setImage] = useState(() => buildInitialForm(initialProduct).image)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  // Valida el tamaño en el cliente para dar un mensaje claro y evitar el error de red
  // cuando el archivo excede el límite del servidor.
  const onPickImage = (file) => {
    if (file && file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setError(`La imagen supera el máximo de ${MAX_IMAGE_MB} MB. Elegí una más liviana.`)
      setImage(null)
      return
    }
    if (error) setError('')
    setImage(file)
  }

  const precioNum = Number(precio) || 0
  const descuentoNum = discount ? Number(descuento) || 0 : 0
  const precioFinal = useMemo(
    () => Math.max(0, precioNum - (precioNum * descuentoNum) / 100),
    [precioNum, descuentoNum],
  )

  const save = async () => {
    const nombreVal = nombre.trim()
    if (!nombreVal) { setError('El nombre del producto es obligatorio.'); return }
    if (precio === '' || precioNum <= 0) { setError('Ingresá un precio mayor a 0.'); return }
    if (stock === '' || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
      setError('Ingresá un stock válido (entero, 0 o más).'); return
    }
    if (discount) {
      if (descuento === '' || descuentoNum <= 0 || descuentoNum > 100) {
        setError('El descuento debe estar entre 1 y 100.'); return
      }
      if (descuentoInicio && descuentoFin && descuentoInicio > descuentoFin) {
        setError('La fecha de inicio del descuento no puede ser posterior a la de fin.'); return
      }
    }
    setError('')
    setSaving(true)
    const productPayload = {
      nombre: nombreVal,
      categoriaId,
      descripcion: descripcion.trim(),
      precio: precioNum,
      stock: Number(stock),
      descuentoPorcentaje: discount ? descuentoNum : '',
      descuentoInicio: discount && descuentoInicio ? `${descuentoInicio}:00` : '',
      descuentoFin: discount && descuentoFin ? `${descuentoFin}:00` : '',
      image,
    }
    const action = await dispatch(isEditMode
      ? updateProductThunk({ id: initialProduct.id, payload: productPayload })
      : createProductThunk(productPayload))
    setSaving(false)
    if (action.error) {
      setError(action.payload || (isEditMode ? 'No se pudo actualizar el producto' : 'No se pudo crear el producto'))
      return
    }
    dispatch(notify(isEditMode ? 'Producto actualizado correctamente' : 'Producto creado correctamente'))
    navigate(isEditMode ? `/vendedor/inventario/${action.payload.id}` : '/vendedor/inventario')
  }

  return (
    <SellerLayout active="inventario">
      <div className="dash-pagetitle dash-pagetitle--form">
        <div>
          <nav className="crumbs"><Link to="/vendedor/inventario">Inventario</Link> <Icon name="arrowRight" size={13} strokeFill /> <span>{isEditMode ? 'Editar Producto' : 'Crear Producto'}</span></nav>
          <h1 className="dash-pagetitle__title">{isEditMode ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h1>
        </div>
        <div className="dash-pagetitle__actions">
          <Button variant="outline" to="/vendedor/inventario">Cancelar</Button>
          <Button iconLeft="check" onClick={save} disabled={saving}>{saving ? 'Guardando...' : isEditMode ? 'Guardar Cambios' : 'Guardar Producto'}</Button>
        </div>
      </div>

      {error && <p className="auth-error" style={{ marginBottom: 16 }}>{error}</p>}

      <div className="create-grid">
        <div className="create-grid__main">
          <section className="form-card">
            <h2 className="form-card__title">Información Básica</h2>
            <TextInput
              label="Nombre del Producto *"
              placeholder="Ej. Gomitas de Osito Ácidas"
              value={nombre}
              onChange={(e) => { setNombre(e.target.value); if (error) setError('') }}
            />
            <Select
              label="Categoría"
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              options={categoryOptions}
            />
            <label className="field">
              <span className="field__label">Descripción</span>
              <textarea className="textarea" rows={4} placeholder="Describe el producto detalladamente..." value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            </label>
          </section>

          <section className="form-card">
            <h2 className="form-card__title">Precios e Inventario</h2>
            <TextInput label="Precio Base ($) *" icon="dollar" type="number" min="0" step="0.01" placeholder="0.00" value={precio} onChange={(e) => { setPrecio(e.target.value); if (error) setError('') }} />
            <TextInput label="Stock *" type="number" min="0" step="1" placeholder="0" value={stock} onChange={(e) => { setStock(e.target.value); if (error) setError('') }} />
            <div className="discount-toggle">
              <span>Aplicar Descuento</span>
              <button type="button" className={`toggle${discount ? ' is-on' : ''}`} onClick={() => setDiscount((v) => !v)} aria-label="Aplicar descuento">
                <span className="toggle__knob" />
              </button>
            </div>
            <div className={`discount-fields${discount ? '' : ' is-disabled'}`}>
              <TextInput label="Descuento (%)" type="number" min="0" max="100" placeholder="0" value={descuento} onChange={(e) => setDescuento(e.target.value)} disabled={!discount} />
              <TextInput label="Inicio" type="datetime-local" value={descuentoInicio} onChange={(e) => setDescuentoInicio(e.target.value)} disabled={!discount} />
              <TextInput label="Fin" type="datetime-local" value={descuentoFin} onChange={(e) => setDescuentoFin(e.target.value)} disabled={!discount} />
            </div>
          </section>
        </div>

        <aside className="create-grid__side">
          <section className="form-card">
            <h2 className="form-card__title">Imagen del Producto</h2>
            <label className="uploader" style={{ cursor: 'pointer' }}>
              <Icon name="upload" size={34} strokeFill className="uploader__icon" />
              <p><strong>Haz clic para subir</strong> o arrastra y suelta</p>
              <span className="uploader__hint">{image ? image.name : 'PNG, JPG (Máx. 10MB)'}</span>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => onPickImage(e.target.files?.[0] || null)} />
            </label>
            {image && (
              <button type="button" className="uploader__hint" style={{ marginTop: 8, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setImage(null)}>
                Quitar imagen
              </button>
            )}
          </section>

          <section className="price-preview">
            <span className="price-preview__label">VISTA PREVIA DEL PRECIO</span>
            <div className="price-preview__line"><span>Precio Base</span><span>{formatPrice(precioNum)}</span></div>
            <div className="price-preview__line"><span>Descuento ({descuentoNum}%)</span><span>-{formatPrice((precioNum * descuentoNum) / 100)}</span></div>
            <div className="price-preview__final"><span>Precio Final</span><span>{formatPrice(precioFinal)}</span></div>
            <div className="price-preview__ok"><Icon name="checkCircle" size={14} strokeFill /> Cálculo válido</div>
          </section>
        </aside>
      </div>
    </SellerLayout>
  )
}

function SellerCreateProduct() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const categoriesLoading = useSelector(selectCategoriesLoading)
  const current = useSelector(selectCurrentProduct)
  const isEditMode = Boolean(id)
  const readyForEdit = !isEditMode || (current && String(current.id) === String(id) && !categoriesLoading)

  useEffect(() => {
    dispatch(loadCategories())
  }, [dispatch])

  useEffect(() => {
    if (isEditMode) dispatch(loadProductById(id))
  }, [dispatch, id, isEditMode])

  if (isEditMode && !readyForEdit) {
    return (
      <SellerLayout active="inventario">
        <p className="adm-table__empty">Cargando producto...</p>
      </SellerLayout>
    )
  }

  return <ProductForm key={isEditMode ? current?.id || id : 'new'} initialProduct={isEditMode ? current : null} isEditMode={isEditMode} />
}

export default SellerCreateProduct

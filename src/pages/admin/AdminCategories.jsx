import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AdminLayout, PageTitle } from '../../components/dashboard/shells'
import { TextInput } from '../../components/ui/Field'
import Button from '../../components/ui/Button'
import Icon from '../../components/ui/Icon'
import Pagination, { usePager } from '../../components/ui/Pagination'
import { notify } from '../../features/ui/toastSlice'
import {
  selectCategories,
  selectCategoriesError,
  selectCategoriesLoading,
} from '../../features/categories/categoriesSlice'
import {
  createCategoryThunk,
  deleteCategoryThunk,
  loadCategories,
  updateCategoryThunk,
} from '../../features/categories/categoriesThunks'
import { selectProducts } from '../../features/products/productsSlice'
import { loadProducts } from '../../features/products/productsThunks'

// Gestión de Categorías (admin): alta/edición/baja contra el backend real.
// El listado, loading y error provienen del store de Redux (slice `categories`);
// el componente sólo conserva el estado de UI del formulario.
function AdminCategories() {
  const dispatch = useDispatch()
  const categories = useSelector(selectCategories)
  const loading = useSelector(selectCategoriesLoading)
  const error = useSelector(selectCategoriesError)
  const products = useSelector(selectProducts)

  // form = null (cerrado) | { id?, name, desc } (alta o edición)
  const [form, setForm] = useState(null)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    dispatch(loadCategories())
    dispatch(loadProducts())
  }, [dispatch])

  // Cuenta de productos por categoría, derivada del estado global de productos.
  const cats = useMemo(() => {
    const counts = products.reduce((acc, product) => {
      const key = product.categoryName || product.category || product.categoriaId
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
    return categories.map((category) => ({ ...category, count: counts[category.name] || 0 }))
  }, [categories, products])

  const openCreate = () => { setFormError(''); setForm({ name: '', desc: '' }) }
  const openEdit = (c) => { setFormError(''); setForm({ id: c.id, name: c.name, desc: c.desc || '' }) }
  const closeForm = () => { setForm(null); setFormError('') }

  const saveForm = async () => {
    const name = form.name.trim()
    if (!name) { setFormError('El nombre de la categoría es obligatorio.'); return }
    setSaving(true)
    const payload = { nombre: name, descripcion: form.desc.trim() }
    const action = form.id
      ? await dispatch(updateCategoryThunk({ id: form.id, payload }))
      : await dispatch(createCategoryThunk(payload))
    setSaving(false)
    if (action.error) {
      setFormError(action.payload || 'No se pudo guardar la categoría')
      return
    }
    dispatch(notify(form.id ? `Categoría "${name}" actualizada` : `Categoría "${name}" creada`))
    closeForm()
    dispatch(loadCategories()) // refresca el listado normalizado tras la mutación
  }

  const removeCat = async (id, name) => {
    const action = await dispatch(deleteCategoryThunk(id))
    if (action.error) {
      dispatch(notify(action.payload || 'No se pudo eliminar la categoría'))
      return
    }
    dispatch(notify(`Categoría "${name}" eliminada`))
  }

  const { page, setPage, total, totalPages, slice, from, to } = usePager(cats, 5, String(cats.length))

  return (
    <AdminLayout active="categorias">
      <PageTitle
        title="Gestión de Categorías"
        subtitle="Administra las agrupaciones de productos en el catálogo."
        actions={<Button iconLeft="plus" onClick={openCreate}>Nueva Categoría</Button>}
      />

      {form && (
        <section className="form-card" style={{ marginBottom: 20 }}>
          <h2 className="form-card__title">{form.id ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
          <TextInput
            label="Nombre *"
            placeholder="Ej. Edición Pascua"
            value={form.name}
            onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); if (formError) setFormError('') }}
          />
          <label className="field">
            <span className="field__label">Descripción</span>
            <textarea className="textarea" rows={3} placeholder="Descripción opcional..." value={form.desc} onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))} />
          </label>
          {formError && <p className="auth-error">{formError}</p>}
          <div className="dash-pagetitle__actions" style={{ marginTop: 12 }}>
            <Button variant="outline" onClick={closeForm} disabled={saving}>Cancelar</Button>
            <Button iconLeft="check" onClick={saveForm} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</Button>
          </div>
        </section>
      )}

      <div className="adm-table">
        <div className="adm-table__head" style={{ gridTemplateColumns: '0.6fr 1.4fr 3fr 1fr 1fr' }}>
          <span>ID</span><span>Nombre</span><span>Descripción</span><span className="ta-right"># Productos</span><span className="ta-right">Acciones</span>
        </div>
        {loading && <div className="adm-table__empty">Cargando categorías...</div>}
        {error && <div className="adm-table__empty">{error}</div>}
        {!loading && !error && slice.map((c) => (
          <div className="adm-table__row" key={c.id} style={{ gridTemplateColumns: '0.6fr 1.4fr 3fr 1fr 1fr' }}>
            <span className="adm-muted">{c.id}</span>
            <span className="adm-strong">{c.name}</span>
            <span className="adm-muted">{c.desc}</span>
            <span className="ta-right"><span className="count-chip">{c.count}</span></span>
            <span className="adm-actions ta-right">
              <button className="icon-action" aria-label="Ver" onClick={() => dispatch(notify(`${c.count} productos en "${c.name}"`))}><Icon name="eye" size={18} strokeFill /></button>
              <button className="icon-action" aria-label="Editar" onClick={() => openEdit(c)}><Icon name="pencil" size={17} strokeFill /></button>
              <button className="icon-action" aria-label="Eliminar" onClick={() => removeCat(c.id, c.name)}><Icon name="trash" size={17} strokeFill /></button>
            </span>
          </div>
        ))}
        {!loading && !error && total === 0 && <div className="adm-table__empty">No hay categorías.</div>}
        <div className="adm-table__foot">
          <span className="adm-muted">Mostrando {from} a {to} de {total} categorías</span>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminCategories

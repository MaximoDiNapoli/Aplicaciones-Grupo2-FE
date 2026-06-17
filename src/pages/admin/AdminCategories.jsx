import { useEffect, useMemo, useState } from 'react'
import { AdminLayout, PageTitle } from '../../components/dashboard/shells'
import { TextInput } from '../../components/ui/Field'
import Button from '../../components/ui/Button'
import Icon from '../../components/ui/Icon'
import Pagination, { usePager } from '../../components/ui/Pagination'
import { useToast } from '../../store/toast'
import { createCategory, deleteCategory, fetchCategories, fetchProducts, updateCategory } from '../../services/api'

// Gestión de Categorías (admin): alta/edición/baja contra el backend real.
function AdminCategories() {
  const notify = useToast()
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  // form = null (cerrado) | { id?, name, desc } (alta o edición)
  const [form, setForm] = useState(null)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let alive = true

    Promise.all([fetchCategories(), fetchProducts().catch(() => [])])
      .then(([categories, products]) => {
        if (!alive) return
        const counts = products.reduce((acc, product) => {
          const key = product.categoryName || product.category || product.categoriaId
          acc[key] = (acc[key] || 0) + 1
          return acc
        }, {})
        setCats(categories.map((category) => ({ ...category, count: counts[category.name] || 0 })))
        setError('')
      })
      .catch((err) => {
        if (!alive) return
        setError(err.message || 'No se pudieron cargar las categorías')
      })
      .finally(() => {
        if (alive) setLoading(false)
      })

    return () => { alive = false }
  }, [reloadKey])

  const openCreate = () => { setFormError(''); setForm({ name: '', desc: '' }) }
  const openEdit = (c) => { setFormError(''); setForm({ id: c.id, name: c.name, desc: c.desc || '' }) }
  const closeForm = () => { setForm(null); setFormError('') }

  const saveForm = async () => {
    const name = form.name.trim()
    if (!name) { setFormError('El nombre de la categoría es obligatorio.'); return }
    setSaving(true)
    try {
      const payload = { nombre: name, descripcion: form.desc.trim() }
      if (form.id) {
        await updateCategory(form.id, payload)
        notify(`Categoría "${name}" actualizada`)
      } else {
        await createCategory(payload)
        notify(`Categoría "${name}" creada`)
      }
      closeForm()
      setReloadKey((k) => k + 1)
    } catch (err) {
      setFormError(err.message || 'No se pudo guardar la categoría')
    } finally {
      setSaving(false)
    }
  }

  const removeCat = async (id, name) => {
    try {
      await deleteCategory(id)
      setCats((list) => list.filter((c) => c.id !== id))
      notify(`Categoría "${name}" eliminada`)
    } catch (err) {
      notify(err.message || 'No se pudo eliminar la categoría')
    }
  }

  const pagedCats = useMemo(() => cats, [cats])
  const { page, setPage, total, totalPages, slice, from, to } = usePager(pagedCats, 5, String(cats.length))

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
              <button className="icon-action" aria-label="Ver" onClick={() => notify(`${c.count} productos en "${c.name}"`)}><Icon name="eye" size={18} strokeFill /></button>
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

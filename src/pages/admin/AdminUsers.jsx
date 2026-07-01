import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AdminLayout, PageTitle, Avatar, Pill, pillTone, cap } from '../../components/dashboard/shells'
import { TextInput, Select } from '../../components/ui/Field'
import Button from '../../components/ui/Button'
import Icon from '../../components/ui/Icon'
import Pagination, { usePager } from '../../components/ui/Pagination'
import { notify } from '../../features/ui/toastSlice'
import {
  selectUsers,
  selectUsersError,
  selectUsersLoading,
} from '../../features/users/usersSlice'
import {
  createUserThunk,
  deleteUserThunk,
  loadUsers,
  updateUserThunk,
} from '../../features/users/usersThunks'
import { selectMetodosPago, selectMetodosPagoLoading } from '../../features/metodosPago/metodosPagoSlice'
import { createMetodoPagoThunk, deleteMetodoPagoThunk, loadMetodosPago } from '../../features/metodosPago/metodosPagoThunks'

const ROLES = ['COMPRADOR', 'VENDEDOR', 'ADMINISTRADOR']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Gestión de Usuarios + panel de Métodos de Pago (datos reales: /api/metodos-pago).
// El listado/loading/error provienen del store de Redux (slices `users` y `metodosPago`).
function AdminUsers() {
  const dispatch = useDispatch()
  const rawUsers = useSelector(selectUsers)
  const loading = useSelector(selectUsersLoading)
  const error = useSelector(selectUsersError)
  const metodosPago = useSelector(selectMetodosPago)
  const metodosLoading = useSelector(selectMetodosPagoLoading)

  const [q, setQ] = useState('')
  const [role, setRole] = useState('Todos los Roles')
  const [metodoForm, setMetodoForm] = useState({ tipo: '', descripcion: '' })
  const [savingMetodo, setSavingMetodo] = useState(false)
  // form = null | { id?, nombre, email, telefono, rol, password }
  const [form, setForm] = useState(null)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    dispatch(loadUsers())
    dispatch(loadMetodosPago())
  }, [dispatch])

  const addMetodo = async (e) => {
    e.preventDefault()
    const tipo = metodoForm.tipo.trim()
    if (!tipo) { dispatch(notify('El tipo del método de pago es obligatorio.')); return }
    setSavingMetodo(true)
    const action = await dispatch(createMetodoPagoThunk({ tipo, descripcion: metodoForm.descripcion.trim() }))
    setSavingMetodo(false)
    if (action.error) { dispatch(notify(action.payload || 'No se pudo crear el método de pago')); return }
    dispatch(notify(`Método de pago "${tipo}" creado`))
    setMetodoForm({ tipo: '', descripcion: '' })
  }

  const removeMetodo = async (id, tipo) => {
    const action = await dispatch(deleteMetodoPagoThunk(id))
    if (action.error) { dispatch(notify(action.payload || 'No se pudo eliminar el método de pago')); return }
    dispatch(notify(`Método de pago "${tipo}" eliminado`))
  }

  // Adapta los usuarios del backend al formato de la tabla.
  const users = useMemo(() => rawUsers.map((user) => ({
    id: user.id,
    name: user.nombre,
    email: user.email,
    telefono: user.telefono || '',
    role: user.rol || 'COMPRADOR',
    activity: user.createdAt ? `Registrado ${new Date(user.createdAt).toLocaleDateString('es-AR')}` : 'Sin actividad',
    status: 'Activo',
  })), [rawUsers])

  const openCreate = () => { setFormError(''); setForm({ nombre: '', email: '', telefono: '', rol: 'COMPRADOR', password: '' }) }
  const openEdit = (u) => { setFormError(''); setForm({ id: u.id, nombre: u.name, email: u.email, telefono: u.telefono, rol: u.role, password: '' }) }
  const closeForm = () => { setForm(null); setFormError('') }
  const setField = (key, value) => { setForm((f) => ({ ...f, [key]: value })); if (formError) setFormError('') }

  const saveForm = async () => {
    const nombre = form.nombre.trim()
    const email = form.email.trim()
    if (!nombre || !email) { setFormError('Nombre y email son obligatorios.'); return }
    if (!EMAIL_RE.test(email)) { setFormError('Ingresá un email válido.'); return }
    if (!form.id && form.password.length < 6) { setFormError('La contraseña debe tener al menos 6 caracteres.'); return }
    setSaving(true)
    const payload = { nombre, email, telefono: form.telefono.trim(), rol: form.rol }
    const action = form.id
      ? await dispatch(updateUserThunk({ id: form.id, payload }))
      : await dispatch(createUserThunk({ ...payload, password: form.password }))
    setSaving(false)
    if (action.error) {
      setFormError(action.payload || 'No se pudo guardar el usuario')
      return
    }
    dispatch(notify(form.id ? `Usuario "${nombre}" actualizado` : `Usuario "${nombre}" creado`))
    closeForm()
    // Sin recarga: el slice `users` ya aplica el usuario devuelto por el thunk (create/update).
  }

  const removeUser = async (id, name) => {
    const action = await dispatch(deleteUserThunk(id))
    if (action.error) {
      dispatch(notify(action.payload || 'No se pudo eliminar el usuario'))
      return
    }
    dispatch(notify(`Usuario ${name} eliminado`))
  }

  const filtered = users.filter((u) => {
    const text = `${u.name} ${u.email} ${u.id}`.toLowerCase()
    if (q && !text.includes(q.toLowerCase())) return false
    if (role !== 'Todos los Roles' && u.role !== role) return false
    return true
  })
  const { page, setPage, total, totalPages, slice, from, to } = usePager(filtered, 4, `${q}|${role}`)

  return (
    <AdminLayout active="usuarios">
      <PageTitle
        title="Gestión de Usuarios"
        subtitle="Administra clientes y vendedores de la plataforma."
        actions={<Button iconLeft="plus" onClick={openCreate}>Nuevo Usuario</Button>}
      />

      {form && (
        <section className="form-card" style={{ marginBottom: 20 }}>
          <h2 className="form-card__title">{form.id ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
          <div className="filter-fields">
            <TextInput label="Nombre *" value={form.nombre} onChange={(e) => setField('nombre', e.target.value)} />
            <TextInput label="Email *" type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} />
            <TextInput label="Teléfono" value={form.telefono} onChange={(e) => setField('telefono', e.target.value)} />
            <Select label="Rol" value={form.rol} onChange={(e) => setField('rol', e.target.value)} options={ROLES} />
            {!form.id && <TextInput label="Contraseña *" type="password" value={form.password} onChange={(e) => setField('password', e.target.value)} />}
          </div>
          {formError && <p className="auth-error">{formError}</p>}
          <div className="dash-pagetitle__actions" style={{ marginTop: 12 }}>
            <Button variant="outline" onClick={closeForm} disabled={saving}>Cancelar</Button>
            <Button iconLeft="check" onClick={saveForm} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</Button>
          </div>
        </section>
      )}

      <div className="filter-fields">
        <label className="field"><span className="field__label">Buscar</span>
          <span className="field__control field__control--icon"><Icon name="search" size={18} strokeFill className="field__icon" /><input className="field__input" placeholder="Nombre, email o ID" value={q} onChange={(e) => setQ(e.target.value)} /></span>
        </label>
        <label className="field"><span className="field__label">Rol</span>
          <span className="field__control field__control--select"><select className="field__input" value={role} onChange={(e) => setRole(e.target.value)}><option>Todos los Roles</option>{ROLES.map((r) => <option key={r}>{r}</option>)}</select></span>
        </label>
      </div>

      <div className="adm-table">
        <div className="adm-table__head" style={{ gridTemplateColumns: '0.8fr 2fr 1fr 1.2fr 1fr 0.9fr' }}>
          <span>ID</span><span>Usuario</span><span>Rol</span><span>Actividad</span><span>Estado</span><span className="ta-right">Acciones</span>
        </div>
        {loading && <div className="adm-table__empty">Cargando usuarios...</div>}
        {error && <div className="adm-table__empty">{error}</div>}
        {!loading && !error && slice.map((u, i) => (
          <div className="adm-table__row" key={u.id} style={{ gridTemplateColumns: '0.8fr 2fr 1fr 1.2fr 1fr 0.9fr' }}>
            <span className="adm-muted">{u.id}</span>
            <span className="adm-cell-user">
              <Avatar name={u.name} tone={['pink', 'orange', 'mint'][i % 3]} />
              <span><span className="adm-strong">{u.name}</span><br /><span className="adm-muted">{u.email}</span></span>
            </span>
            <span><Pill tone={u.role === 'VENDEDOR' ? 'pink' : u.role === 'ADMINISTRADOR' ? 'brand' : 'neutral'}>{cap(u.role)}</Pill></span>
            <span>{u.activity}</span>
            <span><span className={`dot-status dot-status--${pillTone(u.status)}`} />{cap(u.status)}</span>
            <span className="adm-actions ta-right">
              <button className="icon-action" aria-label="Editar" onClick={() => openEdit(u)}><Icon name="pencil" size={17} strokeFill /></button>
              <button className="icon-action" aria-label="Eliminar" onClick={() => removeUser(u.id, u.name)}><Icon name="trash" size={17} strokeFill /></button>
            </span>
          </div>
        ))}
        {!loading && !error && total === 0 && <div className="adm-table__empty">No hay usuarios que coincidan con los filtros.</div>}
        <div className="adm-table__foot">
          <span className="adm-muted">Mostrando {from} a {to} de {total} usuarios</span>
          <Pagination variant="mini" page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>

      <div className="dash-pagetitle" style={{ marginTop: 36 }}>
        <div>
          <h2 className="dash-pagetitle__title" style={{ fontSize: 26 }}>Métodos de Pago</h2>
          <p className="dash-pagetitle__sub">Gestiona los métodos de pago disponibles (datos reales del backend).</p>
        </div>
      </div>

      <form className="filter-fields" onSubmit={addMetodo} style={{ alignItems: 'flex-end' }}>
        <TextInput label="Tipo *" placeholder="Ej. Tarjeta de crédito" value={metodoForm.tipo} onChange={(e) => setMetodoForm((f) => ({ ...f, tipo: e.target.value }))} />
        <TextInput label="Descripción" placeholder="Opcional" value={metodoForm.descripcion} onChange={(e) => setMetodoForm((f) => ({ ...f, descripcion: e.target.value }))} />
        <Button type="submit" iconLeft="plus" disabled={savingMetodo}>{savingMetodo ? 'Agregando...' : 'Agregar método'}</Button>
      </form>

      <div className="adm-table" style={{ marginTop: 12 }}>
        <div className="adm-table__head" style={{ gridTemplateColumns: '0.6fr 1.6fr 3fr 0.8fr' }}>
          <span>ID</span><span>Tipo</span><span>Descripción</span><span className="ta-right">Acciones</span>
        </div>
        {metodosLoading && <div className="adm-table__empty">Cargando métodos de pago...</div>}
        {!metodosLoading && metodosPago.map((m) => (
          <div className="adm-table__row" key={m.id} style={{ gridTemplateColumns: '0.6fr 1.6fr 3fr 0.8fr' }}>
            <span className="adm-muted">{m.id}</span>
            <span className="adm-cell-user"><Icon name="card" size={18} strokeFill /> <span className="adm-strong">{m.tipo}</span></span>
            <span className="adm-muted">{m.descripcion || '—'}</span>
            <span className="adm-actions ta-right">
              <button className="icon-action" aria-label="Eliminar" onClick={() => removeMetodo(m.id, m.tipo)}><Icon name="trash" size={17} strokeFill /></button>
            </span>
          </div>
        ))}
        {!metodosLoading && metodosPago.length === 0 && <div className="adm-table__empty">No hay métodos de pago cargados.</div>}
      </div>
    </AdminLayout>
  )
}

export default AdminUsers

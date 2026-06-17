import { useEffect, useState } from 'react'
import { AdminLayout, PageTitle, Avatar, Pill, pillTone, cap } from '../../components/dashboard/shells'
import Button from '../../components/ui/Button'
import Icon from '../../components/ui/Icon'
import Pagination, { usePager } from '../../components/ui/Pagination'
import { useToast } from '../../store/toast'
import { adminPaymentProviders } from '../../data/mock'
import { deleteUser, fetchUsers } from '../../services/api'

// Gestión de Usuarios + panel de Métodos de Pago (pasarelas).
function AdminUsers() {
  const notify = useToast()
  const [q, setQ] = useState('')
  const [role, setRole] = useState('Todos los Roles')
  const [status, setStatus] = useState('Todos los Estados')
  const [users, setUsers] = useState([])
  const [providers, setProviders] = useState(adminPaymentProviders)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true

    fetchUsers()
      .then((nextUsers) => {
        if (!alive) return
        setUsers(nextUsers.map((user) => ({
          id: user.id,
          name: user.nombre,
          email: user.email,
          role: user.rol || 'COMPRADOR',
          activity: user.createdAt ? `Registrado ${new Date(user.createdAt).toLocaleDateString('es-AR')}` : 'Sin actividad',
          status: 'Activo',
        })))
        setError('')
      })
      .catch((err) => {
        if (!alive) return
        setError(err.message || 'No se pudieron cargar los usuarios')
      })
      .finally(() => {
        if (alive) setLoading(false)
      })

    return () => { alive = false }
  }, [])

  const removeUser = async (id, name) => {
    try {
      await deleteUser(id)
      setUsers((list) => list.filter((u) => u.id !== id))
      notify(`Usuario ${name} eliminado`)
    } catch (err) {
      notify(err.message || 'No se pudo eliminar el usuario')
    }
  }
  const toggleProvider = (id) =>
    setProviders((list) => list.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)))

  const filtered = users.filter((u) => {
    const text = `${u.name} ${u.email} ${u.id}`.toLowerCase()
    if (q && !text.includes(q.toLowerCase())) return false
    if (role !== 'Todos los Roles' && u.role !== role) return false
    if (status !== 'Todos los Estados' && u.status !== status.toLowerCase()) return false
    return true
  })
  const { page, setPage, total, totalPages, slice, from, to } = usePager(filtered, 4, `${q}|${role}|${status}`)

  return (
    <AdminLayout active="usuarios">
      <PageTitle
        title="Gestión de Usuarios"
        subtitle="Administra clientes y vendedores de la plataforma."
        actions={<Button iconLeft="plus" onClick={() => notify('Formulario de nuevo usuario (demo)')}>Nuevo Usuario</Button>}
      />

      <div className="filter-fields">
        <label className="field"><span className="field__label">Buscar</span>
          <span className="field__control field__control--icon"><Icon name="search" size={18} strokeFill className="field__icon" /><input className="field__input" placeholder="Nombre, email o ID" value={q} onChange={(e) => setQ(e.target.value)} /></span>
        </label>
        <label className="field"><span className="field__label">Rol</span>
          <span className="field__control field__control--select"><select className="field__input" value={role} onChange={(e) => setRole(e.target.value)}><option>Todos los Roles</option><option>Cliente</option><option>Vendedor</option></select></span>
        </label>
        <label className="field"><span className="field__label">Estado</span>
          <span className="field__control field__control--select"><select className="field__input" value={status} onChange={(e) => setStatus(e.target.value)}><option>Todos los Estados</option><option>Activo</option><option>Suspendido</option></select></span>
        </label>
        <label className="field"><span className="field__label">Fecha de Registro</span>
          <span className="field__control"><input className="field__input" type="date" /></span>
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
            <span><Pill tone={u.role === 'Vendedor' ? 'pink' : 'neutral'}>{u.role}</Pill></span>
            <span>{u.activity}</span>
            <span><span className={`dot-status dot-status--${pillTone(u.status)}`} />{cap(u.status)}</span>
            <span className="adm-actions ta-right">
              <button className="icon-action" aria-label="Editar" onClick={() => notify(`Editar a ${u.name} (demo)`)}><Icon name="pencil" size={17} strokeFill /></button>
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
          <p className="dash-pagetitle__sub">Gestiona las pasarelas activas, comisiones y credenciales de API para la tienda.</p>
        </div>
        <Button iconLeft="plus" onClick={() => notify('Añadir nueva pasarela (demo)')}>Añadir Pasarela</Button>
      </div>
      <div className="provider-grid">
        {providers.map((p) => (
          <section className={`provider-card${p.enabled ? '' : ' is-off'}`} key={p.id}>
            <div className="provider-card__head">
              <span className="provider-card__name"><Icon name="card" size={20} strokeFill /> {p.name}</span>
              <button
                type="button"
                className={`toggle${p.enabled ? ' is-on' : ''}`}
                aria-pressed={p.enabled}
                aria-label={`${p.enabled ? 'Desactivar' : 'Activar'} ${p.name}`}
                onClick={() => toggleProvider(p.id)}
              >
                <span className="toggle__knob" />
              </button>
            </div>
            <div className="provider-card__state"><span className="adm-muted">Estado</span><Pill tone={p.enabled ? 'pink' : 'neutral'}>{p.enabled ? 'Activo' : 'Inactivo'}</Pill></div>
            <Button variant="outline" block iconLeft="lock" onClick={() => notify(`Editar credenciales de ${p.name} (demo)`)}>Editar Credenciales</Button>
          </section>
        ))}
      </div>
    </AdminLayout>
  )
}

export default AdminUsers

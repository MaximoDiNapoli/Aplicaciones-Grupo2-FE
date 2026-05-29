import { AdminLayout, PageTitle, Avatar, Pill, pillTone, cap } from '../../components/dashboard/shells'
import Button from '../../components/ui/Button'
import Icon from '../../components/ui/Icon'
import Pagination, { usePager } from '../../components/ui/Pagination'
import { adminUsers, adminPaymentProviders } from '../../data/mock'

// Gestión de Usuarios + panel de Métodos de Pago (pasarelas).
function AdminUsers() {
  const { page, setPage, total, totalPages, slice, from, to } = usePager(adminUsers, 4)
  return (
    <AdminLayout active="usuarios">
      <PageTitle
        title="Gestión de Usuarios"
        subtitle="Administra clientes y vendedores de la plataforma."
        actions={<Button iconLeft="plus">Nuevo Usuario</Button>}
      />

      <div className="filter-fields">
        <label className="field"><span className="field__label">Buscar</span>
          <span className="field__control field__control--icon"><Icon name="search" size={18} strokeFill className="field__icon" /><input className="field__input" placeholder="Nombre, email o ID" /></span>
        </label>
        <label className="field"><span className="field__label">Rol</span>
          <span className="field__control field__control--select"><select className="field__input"><option>Todos los Roles</option><option>Cliente</option><option>Vendedor</option></select></span>
        </label>
        <label className="field"><span className="field__label">Estado</span>
          <span className="field__control field__control--select"><select className="field__input"><option>Todos los Estados</option><option>Activo</option><option>Suspendido</option></select></span>
        </label>
        <label className="field"><span className="field__label">Fecha de Registro</span>
          <span className="field__control"><input className="field__input" placeholder="mm/dd/yyyy" /></span>
        </label>
      </div>

      <div className="adm-table">
        <div className="adm-table__head" style={{ gridTemplateColumns: '0.8fr 2fr 1fr 1.2fr 1fr 0.9fr' }}>
          <span>ID</span><span>Usuario</span><span>Rol</span><span>Actividad</span><span>Estado</span><span className="ta-right">Acciones</span>
        </div>
        {slice.map((u, i) => (
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
              <button className="icon-action"><Icon name="pencil" size={17} strokeFill /></button>
              <button className="icon-action"><Icon name="trash" size={17} strokeFill /></button>
            </span>
          </div>
        ))}
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
        <Button iconLeft="plus">Añadir Pasarela</Button>
      </div>
      <div className="provider-grid">
        {adminPaymentProviders.map((p) => (
          <section className={`provider-card${p.enabled ? '' : ' is-off'}`} key={p.id}>
            <div className="provider-card__head">
              <span className="provider-card__name"><Icon name="card" size={20} strokeFill /> {p.name}</span>
              <span className={`toggle${p.enabled ? ' is-on' : ''}`}><span className="toggle__knob" /></span>
            </div>
            {p.enabled && <div className="provider-card__state"><span className="adm-muted">Estado</span><Pill tone="pink">Activo</Pill></div>}
            <Button variant="outline" block iconLeft="lock">Editar Credenciales</Button>
          </section>
        ))}
      </div>
    </AdminLayout>
  )
}

export default AdminUsers

import { AdminLayout, PageTitle } from '../../components/dashboard/shells'
import Button from '../../components/ui/Button'
import Icon from '../../components/ui/Icon'
import { adminCategories } from '../../data/mock'

// Gestión de Categorías (admin maestro): tabla con acciones ver/editar/eliminar.
function AdminCategories() {
  return (
    <AdminLayout active="categorias">
      <PageTitle
        title="Gestión de Categorías"
        subtitle="Administra las agrupaciones de productos en el catálogo."
        actions={<Button iconLeft="plus">Nueva Categoría</Button>}
      />

      <div className="adm-table">
        <div className="adm-table__head" style={{ gridTemplateColumns: '0.6fr 1.4fr 3fr 1fr 1fr' }}>
          <span>ID</span><span>Nombre</span><span>Descripción</span><span className="ta-right"># Productos</span><span className="ta-right">Acciones</span>
        </div>
        {adminCategories.map((c) => (
          <div className="adm-table__row" key={c.id} style={{ gridTemplateColumns: '0.6fr 1.4fr 3fr 1fr 1fr' }}>
            <span className="adm-muted">{c.id}</span>
            <span className="adm-strong">{c.name}</span>
            <span className="adm-muted">{c.desc}</span>
            <span className="ta-right"><span className="count-chip">{c.count}</span></span>
            <span className="adm-actions ta-right">
              <button className="icon-action"><Icon name="eye" size={18} strokeFill /></button>
              <button className="icon-action"><Icon name="pencil" size={17} strokeFill /></button>
              <button className="icon-action"><Icon name="trash" size={17} strokeFill /></button>
            </span>
          </div>
        ))}
        <div className="adm-table__foot">
          <span className="adm-muted">Mostrando 5 de 24 categorías</span>
          <div className="pagination">
            <button className="pagination__item">‹</button>
            <button className="pagination__item is-active">1</button>
            <button className="pagination__item">2</button>
            <button className="pagination__item">3</button>
            <button className="pagination__item">›</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminCategories

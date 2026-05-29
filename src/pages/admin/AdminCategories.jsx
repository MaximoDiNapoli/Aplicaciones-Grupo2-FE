import { useState } from 'react'
import { AdminLayout, PageTitle } from '../../components/dashboard/shells'
import Button from '../../components/ui/Button'
import Icon from '../../components/ui/Icon'
import Pagination, { usePager } from '../../components/ui/Pagination'
import { useToast } from '../../store/toast'
import { adminCategories } from '../../data/mock'

// Gestión de Categorías (admin maestro): tabla con acciones ver/editar/eliminar.
function AdminCategories() {
  const notify = useToast()
  const [cats, setCats] = useState(adminCategories)
  const removeCat = (id, name) => { setCats((list) => list.filter((c) => c.id !== id)); notify(`Categoría "${name}" eliminada`) }
  const { page, setPage, total, totalPages, slice, from, to } = usePager(cats, 5, String(cats.length))

  return (
    <AdminLayout active="categorias">
      <PageTitle
        title="Gestión de Categorías"
        subtitle="Administra las agrupaciones de productos en el catálogo."
        actions={<Button iconLeft="plus" onClick={() => notify('Formulario de nueva categoría (demo)')}>Nueva Categoría</Button>}
      />

      <div className="adm-table">
        <div className="adm-table__head" style={{ gridTemplateColumns: '0.6fr 1.4fr 3fr 1fr 1fr' }}>
          <span>ID</span><span>Nombre</span><span>Descripción</span><span className="ta-right"># Productos</span><span className="ta-right">Acciones</span>
        </div>
        {slice.map((c) => (
          <div className="adm-table__row" key={c.id} style={{ gridTemplateColumns: '0.6fr 1.4fr 3fr 1fr 1fr' }}>
            <span className="adm-muted">{c.id}</span>
            <span className="adm-strong">{c.name}</span>
            <span className="adm-muted">{c.desc}</span>
            <span className="ta-right"><span className="count-chip">{c.count}</span></span>
            <span className="adm-actions ta-right">
              <button className="icon-action" aria-label="Ver" onClick={() => notify(`${c.count} productos en "${c.name}"`)}><Icon name="eye" size={18} strokeFill /></button>
              <button className="icon-action" aria-label="Editar" onClick={() => notify(`Editar "${c.name}" (demo)`)}><Icon name="pencil" size={17} strokeFill /></button>
              <button className="icon-action" aria-label="Eliminar" onClick={() => removeCat(c.id, c.name)}><Icon name="trash" size={17} strokeFill /></button>
            </span>
          </div>
        ))}
        {total === 0 && <div className="adm-table__empty">No hay categorías.</div>}
        <div className="adm-table__foot">
          <span className="adm-muted">Mostrando {from} a {to} de {total} categorías</span>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminCategories

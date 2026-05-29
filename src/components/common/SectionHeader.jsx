import { Link } from 'react-router-dom'

// Encabezado de sección con link "ver más" opcional.
function SectionHeader({ title, actionLabel, to, icon }) {
  return (
    <div className="section-header">
      <h2 className="section-header__title">{icon}{title}</h2>
      {actionLabel && (
        <Link to={to || '#'} className="section-header__action">{actionLabel}</Link>
      )}
    </div>
  )
}

export default SectionHeader

import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'

// Tarjeta de categoría (habitat) para el home.
function CategoryCard({ category }) {
  return (
    <Link to="/catalogo" className="category-card">
      <span className="category-card__icon">
        <Icon name={category.icon} size={22} strokeFill={category.icon === 'butterfly' || category.icon === 'store'} />
      </span>
      <span className="category-card__name">{category.name}</span>
    </Link>
  )
}

export default CategoryCard

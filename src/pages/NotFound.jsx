import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CenteredStateLayout from '../components/layout/CenteredStateLayout'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'

// Página 404.
function NotFound() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const search = (e) => {
    e.preventDefault()
    navigate(q.trim() ? '/sin-resultados' : '/catalogo')
  }
  return (
    <CenteredStateLayout>
      <div className="notfound-card">
        <div className="notfound-card__art" style={{ background: 'radial-gradient(120% 120% at 40% 25%, #ffd6e4, #ff8c42)' }}>
          <span className="notfound-card__emoji">🐻🍭</span>
        </div>
        <h1 className="notfound-card__title">¡Ups! Este sendero de dulces no existe</h1>
        <p className="notfound-card__copy">
          Parece que nuestro explorador animal ha estado leyendo el mapa al revés.
          No te preocupes, puedes buscar otra delicia o volver al inicio de nuestra dulce selva.
        </p>
        <form className="notfound-card__search" onSubmit={search}>
          <Icon name="search" size={18} strokeFill className="notfound-card__search-icon" />
          <input placeholder="Buscar gomitas, chocolates..." value={q} onChange={(e) => setQ(e.target.value)} />
          <button type="submit">Buscar</button>
        </form>
        <div className="notfound-card__actions">
          <Button to="/" iconLeft="home">Volver al Inicio</Button>
          <Button to="/catalogo" variant="outline" iconLeft="store">Explorar Tienda</Button>
        </div>
      </div>
    </CenteredStateLayout>
  )
}

export default NotFound

import { useState } from 'react'
import AccountLayout from '../components/layout/AccountLayout'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { useToast } from '../store/toast'
import { profile } from '../data/mock'

// Perfil de Usuario: tarjeta de perfil editable + stats.
function Profile() {
  const notify = useToast()
  const [editing, setEditing] = useState(false)
  const [email, setEmail] = useState(profile.email)
  const [phone, setPhone] = useState(profile.phone)

  const toggleEdit = () => {
    if (editing) notify('Perfil actualizado')
    setEditing((v) => !v)
  }

  return (
    <AccountLayout activeItem="cuenta">
      <h1 className="account__title account__title--brand">Perfil de Usuario</h1>
      <p className="account__sub">Gestiona tu información y descubre tus estadísticas de Safari.</p>

      <section className="profile-card">
        <div className="profile-card__avatar">
          <Icon name="userCircle" size={64} strokeFill />
          <button type="button" className="profile-card__cam" aria-label="Cambiar foto" onClick={() => notify('Selector de foto (demo)')}>
            <Icon name="camera" size={16} strokeFill />
          </button>
        </div>
        <div className="profile-card__body">
          <h2 className="profile-card__name">{profile.name}</h2>
          <div className="profile-card__field">
            <Icon name="mail" size={18} strokeFill />
            {editing
              ? <input className="profile-card__input" value={email} onChange={(e) => setEmail(e.target.value)} />
              : email}
          </div>
          <div className="profile-card__field">
            <Icon name="phone" size={18} strokeFill />
            {editing
              ? <input className="profile-card__input" value={phone} onChange={(e) => setPhone(e.target.value)} />
              : phone}
          </div>
        </div>
        <div className="profile-card__action">
          <Button iconLeft={editing ? 'check' : 'pencil'} onClick={toggleEdit}>
            {editing ? 'Guardar' : 'Editar Perfil'}
          </Button>
          <Button to="/login" variant="outline" iconLeft="logout">Cerrar Sesión</Button>
        </div>
      </section>

      <div className="stats-grid">
        {profile.stats.map((s) => (
          <div className="stat-card" key={s.id}>
            <span className={`stat-card__icon stat-card__icon--${s.tone}`}>
              <Icon name={s.icon} size={24} strokeFill />
            </span>
            <div className="stat-card__value">{s.value}</div>
            <div className="stat-card__label">{s.label}</div>
          </div>
        ))}
      </div>
    </AccountLayout>
  )
}

export default Profile

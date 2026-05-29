import AccountLayout from '../components/layout/AccountLayout'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { profile } from '../data/mock'

// Perfil de Usuario: tarjeta de perfil + stats.
function Profile() {
  return (
    <AccountLayout activeItem="cuenta">
      <h1 className="account__title account__title--brand">Perfil de Usuario</h1>
      <p className="account__sub">Gestiona tu información y descubre tus estadísticas de Safari.</p>

      <section className="profile-card">
        <div className="profile-card__avatar">
          <Icon name="userCircle" size={64} strokeFill />
          <span className="profile-card__cam"><Icon name="camera" size={16} strokeFill /></span>
        </div>
        <div className="profile-card__body">
          <h2 className="profile-card__name">{profile.name}</h2>
          <div className="profile-card__field"><Icon name="mail" size={18} strokeFill /> {profile.email}</div>
          <div className="profile-card__field"><Icon name="phone" size={18} strokeFill /> {profile.phone}</div>
        </div>
        <div className="profile-card__action">
          <Button iconLeft="pencil">Editar Perfil</Button>
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

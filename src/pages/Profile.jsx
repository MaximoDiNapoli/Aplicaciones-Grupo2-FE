import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import AccountLayout from '../components/layout/AccountLayout'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { notify } from '../features/ui/toastSlice'
import { selectAuth, signOut } from '../features/auth/authSlice'
import { loadCurrentUser, saveProfile } from '../features/auth/authThunks'

function formatDate(value) {
  if (!value) return 'Fecha no disponible'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('es-AR', { year: 'numeric', month: 'long' })
}

// Perfil de Usuario: tarjeta de perfil editable + stats.
// El perfil (user), loading y error provienen del slice `auth`.
function Profile() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user: profile, token, loading, error } = useSelector(selectAuth)
  const logout = () => { dispatch(signOut()); navigate('/login') }
  const [editing, setEditing] = useState(false)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [syncedId, setSyncedId] = useState(null)

  // Refresca el perfil desde el backend al entrar (si hay sesión).
  useEffect(() => {
    if (token) dispatch(loadCurrentUser())
  }, [token, dispatch])

  // Sincroniza los campos editables cuando llega/cambia el perfil del store
  // (ajuste de estado durante el render, patrón recomendado por React).
  if (profile && profile.id !== syncedId) {
    setSyncedId(profile.id)
    setEmail(profile.email || '')
    setPhone(profile.telefono || '')
  }

  const stats = useMemo(() => {
    if (!profile) return []
    return [
      { id: 'member', value: formatDate(profile.createdAt), label: 'Miembro desde', icon: 'calendar', tone: 'mint' },
      { id: 'role', value: profile.rol || 'COMPRADOR', label: 'Rol', icon: 'users', tone: 'pink' },
      { id: 'user', value: `#${profile.id ?? '-'}`, label: 'Usuario', icon: 'bag', tone: 'orange' },
    ]
  }, [profile])

  const toggleEdit = async () => {
    if (editing) {
      const emailVal = email.trim()
      if (!emailVal) { dispatch(notify('El correo no puede quedar vacío.')); return }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) { dispatch(notify('Ingresá un correo electrónico válido.')); return }
      setSaving(true)
      // No enviamos "rol": el backend solo permite cambiarlo a un admin y el usuario
      // edita su propio perfil (enviarlo haría que un comprador reciba 403).
      const action = await dispatch(saveProfile({ nombre: profile?.nombre || '', email: emailVal, telefono: phone.trim() }))
      setSaving(false)
      if (action.error) {
        dispatch(notify(action.payload || 'No se pudo actualizar el perfil'))
        return
      }
      dispatch(notify('Perfil actualizado'))
    }
    setEditing((v) => !v)
  }

  if (loading && !profile) {
    return <AccountLayout activeItem="cuenta"><p className="catalog__empty">Cargando perfil...</p></AccountLayout>
  }

  if (!profile) {
    return <AccountLayout activeItem="cuenta"><p className="catalog__empty">Inicia sesión para ver tu perfil.</p></AccountLayout>
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
          <h2 className="profile-card__name">{profile.nombre}</h2>
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
          <Button iconLeft={editing ? 'check' : 'pencil'} onClick={toggleEdit} disabled={saving}>
            {editing ? (saving ? 'Guardando...' : 'Guardar') : 'Editar Perfil'}
          </Button>
          <Button variant="outline" iconLeft="logout" onClick={logout}>Cerrar Sesión</Button>
        </div>
      </section>

      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.id}>
            <span className={`stat-card__icon stat-card__icon--${s.tone}`}>
              <Icon name={s.icon} size={24} strokeFill />
            </span>
            <div className="stat-card__value">{s.value}</div>
            <div className="stat-card__label">{s.label}</div>
          </div>
        ))}
      </div>
      {error && <p className="auth-error" style={{ marginTop: 16 }}>{error}</p>}
    </AccountLayout>
  )
}

export default Profile

import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import AuthLayout from '../components/layout/AuthLayout'
import { TextInput, PasswordInput, Checkbox } from '../components/ui/Field'
import Button from '../components/ui/Button'
import { useAuth } from '../store/auth'
import { loginUser } from '../features/auth/authThunks'

function landingPath(rol = '') {
  const normalized = String(rol).trim().toUpperCase()
  if (normalized.includes('ADMIN')) return '/admin'
  if (normalized.includes('VENDEDOR')) return '/vendedor'
  return '/'
}

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { signInAsGuest } = useAuth()
  const [remember, setRemember] = useState(false)
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    const email = account.trim()
    if (!email || !password) {
      setError('Ingresá tu correo y contraseña.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ingresá un correo electrónico válido.')
      return
    }
    setLoading(true)
    // El thunk loginUser resuelve token + usuario y actualiza el slice `auth`.
    const action = await dispatch(loginUser({ email, password }))
    setLoading(false)
    if (action.error) {
      setError(action.payload || 'No fue posible iniciar sesión')
      return
    }
    navigate(landingPath(action.payload?.user?.rol))
  }
  const enterAsGuest = () => { signInAsGuest(); navigate('/') }
  return (
    <AuthLayout
      hero={{
        withBrand: true,
        title: 'Aventúrate en cada bocado',
        subtitle: 'Únete a nuestra manada de amantes del dulce.',
        image: 'linear-gradient(150deg, #ff8fb6, #c0265e)',
      }}
    >
      <h1 className="auth-title">¡Hola de nuevo!</h1>
      <p className="auth-subtitle">Ingresa tus datos para explorar la sabana de dulces.</p>
      <form className="auth-form" onSubmit={submit}>
        <TextInput
          label="Correo Electrónico"
          icon="mail"
          placeholder="usuario@ejemplo.com"
          value={account}
          onChange={(e) => { setAccount(e.target.value); if (error) setError('') }}
        />
        <PasswordInput
          label="Contraseña"
          placeholder="Tu contraseña"
          value={password}
          onChange={(e) => { setPassword(e.target.value); if (error) setError('') }}
        />
        {error && <p className="auth-error">{error}</p>}
        <Checkbox label="Recordarme" checked={remember} onChange={() => setRemember((v) => !v)} />
        <Button type="submit" block size="lg" iconRight="arrowRight" disabled={loading}>{loading ? 'Ingresando...' : 'Entrar al Safari'}</Button>
      </form>

      <div className="auth-divider"><span>o</span></div>
      <Button variant="outline" block size="lg" iconLeft="user" onClick={enterAsGuest}>
        Acceder sin cuenta
      </Button>
      <p className="auth-guest-note">Como invitado puedes explorar la tienda, pero necesitas una cuenta para comprar.</p>

      <p className="auth-switch">
        ¿Aún no tienes cuenta? <Link to="/registro" className="link">Crea una cuenta</Link>
      </p>
    </AuthLayout>
  )
}

export default Login

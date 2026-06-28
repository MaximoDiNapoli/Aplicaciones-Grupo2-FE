import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import AuthLayout from '../components/layout/AuthLayout'
import { TextInput, PasswordInput } from '../components/ui/Field'
import Button from '../components/ui/Button'
import { registerUser } from '../features/auth/authThunks'

function landingPath(rol = '') {
  const normalized = String(rol).trim().toUpperCase()
  if (normalized.includes('ADMIN')) return '/admin'
  if (normalized.includes('VENDEDOR')) return '/vendedor'
  return '/'
}

// Registro de cuenta.
function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    const nombreVal = nombre.trim()
    const emailVal = email.trim()
    if (!nombreVal || !emailVal || !password || !confirmPassword) {
      setError('Completá todos los campos obligatorios.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      setError('Ingresá un correo electrónico válido.')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    // El thunk registerUser crea la cuenta, resuelve la sesión y actualiza el slice `auth`.
    const action = await dispatch(registerUser({ nombre: nombreVal, email: emailVal, telefono: telefono.trim(), password, rol: 'COMPRADOR' }))
    setLoading(false)
    if (action.error) {
      setError(action.payload || 'No fue posible crear la cuenta')
      return
    }
    navigate(landingPath(action.payload?.user?.rol))
  }
  return (
    <AuthLayout hero={{ image: 'linear-gradient(135deg, #ff9ec0, #ff619b)' }}>
      <h1 className="auth-title">Crea tu cuenta</h1>
      <p className="auth-subtitle">Únete a la manada y disfruta de beneficios exclusivos.</p>
      <form className="auth-form" onSubmit={submit}>
        <TextInput label="Nombre completo" icon="user" placeholder="Ej. Ana María García" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <TextInput label="Correo electrónico" icon="mail" type="email" placeholder="ana@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextInput label="Teléfono" icon="phone" placeholder="+34 600 000 000" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        <PasswordInput label="Contraseña" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} />
        <PasswordInput label="Confirmar contraseña" placeholder="Repite tu contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        {error && <p className="auth-error">{error}</p>}
        <Button type="submit" block size="lg" disabled={loading}>{loading ? 'Registrando...' : 'Registrarme'}</Button>
      </form>
      <p className="auth-switch">
        ¿Ya tienes una cuenta? <Link to="/login" className="link">Inicia sesión</Link>
      </p>
    </AuthLayout>
  )
}

export default Register

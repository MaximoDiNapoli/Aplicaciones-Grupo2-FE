import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import AuthLayout from '../components/layout/AuthLayout'
import { TextInput, PasswordInput, Checkbox } from '../components/ui/Field'
import Button from '../components/ui/Button'
import { useAuth } from '../store/auth'

// Login unificado. NOTA: sin selección manual de rol (corrección de la profesora):
// el rol se obtiene de las credenciales (simula el rol del token), no de tabs en pantalla.
// Demo: el destino depende de lo que se escriba en "Correo":
//   contiene "admin"    -> panel de administrador
//   contiene "vendedor" -> panel de vendedor
//   en otro caso        -> tienda (usuario)
// Contraseña única de demostración para todas las cuentas.
const DEMO_PASSWORD = '123'

function Login() {
  const navigate = useNavigate()
  const { signIn, signInAsGuest } = useAuth()
  const [remember, setRemember] = useState(false)
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const submit = (e) => {
    e.preventDefault()
    if (password !== DEMO_PASSWORD) {
      setError('Contraseña incorrecta. La contraseña de demostración es 123.')
      return
    }
    setError('')
    const value = account.trim().toLowerCase()
    if (value.includes('admin')) { signIn('admin'); navigate('/admin') }
    else if (value.includes('vendedor')) { signIn('vendedor'); navigate('/vendedor') }
    else { signIn('cliente'); navigate('/') }
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
          placeholder="usuario, vendedor o admin"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
        />
        <PasswordInput
          label="Contraseña"
          placeholder="123"
          value={password}
          onChange={(e) => { setPassword(e.target.value); if (error) setError('') }}
        />
        {error && <p className="auth-error">{error}</p>}
        <Checkbox label="Recordarme" checked={remember} onChange={() => setRemember((v) => !v)} />
        <Button type="submit" block size="lg" iconRight="arrowRight">Entrar al Safari</Button>
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

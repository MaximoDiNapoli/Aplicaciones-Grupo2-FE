import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/layout/AuthLayout'
import { TextInput, PasswordInput } from '../components/ui/Field'
import Button from '../components/ui/Button'

// Registro de cuenta.
function Register() {
  const navigate = useNavigate()
  const submit = (e) => { e.preventDefault(); navigate('/') }
  return (
    <AuthLayout hero={{ image: 'linear-gradient(135deg, #ff9ec0, #ff619b)' }}>
      <h1 className="auth-title">Crea tu cuenta</h1>
      <p className="auth-subtitle">Únete a la manada y disfruta de beneficios exclusivos.</p>
      <form className="auth-form" onSubmit={submit}>
        <TextInput label="Nombre completo" icon="user" placeholder="Ej. Ana María García" />
        <TextInput label="Correo electrónico" icon="mail" type="email" placeholder="ana@ejemplo.com" />
        <TextInput label="Teléfono" icon="phone" placeholder="+34 600 000 000" />
        <PasswordInput label="Contraseña" placeholder="Mínimo 8 caracteres" />
        <PasswordInput label="Confirmar contraseña" placeholder="Repite tu contraseña" />
        <Button type="submit" block size="lg">Registrarme</Button>
      </form>
      <p className="auth-switch">
        ¿Ya tienes una cuenta? <Link to="/login" className="link">Inicia sesión</Link>
      </p>
    </AuthLayout>
  )
}

export default Register

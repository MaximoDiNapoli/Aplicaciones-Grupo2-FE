import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/layout/AuthLayout'
import { TextInput, PasswordInput, Checkbox } from '../components/ui/Field'
import Button from '../components/ui/Button'
import { useState } from 'react'

// Login unificado. NOTA: sin selección manual de rol (corrección de la profesora):
// el rol se obtiene de las credenciales (simula el rol del token), no de tabs en pantalla.
// Demo: el destino depende de lo que se escriba en "Correo":
//   contiene "admin"    -> panel de administrador
//   contiene "vendedor" -> panel de vendedor
//   en otro caso        -> tienda (usuario)
function Login() {
  const navigate = useNavigate()
  const [remember, setRemember] = useState(false)
  const [account, setAccount] = useState('')
  const submit = (e) => {
    e.preventDefault()
    const value = account.trim().toLowerCase()
    if (value.includes('admin')) navigate('/admin')
    else if (value.includes('vendedor')) navigate('/vendedor')
    else navigate('/')
  }
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
        <PasswordInput label="Contraseña" placeholder="••••••••" />
        <Checkbox label="Recordarme" checked={remember} onChange={() => setRemember((v) => !v)} />
        <Button type="submit" block size="lg" iconRight="arrowRight">Entrar al Safari</Button>
      </form>
      <p className="auth-switch">
        ¿Aún no tienes cuenta? <Link to="/registro" className="link">Crea una cuenta</Link>
      </p>
    </AuthLayout>
  )
}

export default Login

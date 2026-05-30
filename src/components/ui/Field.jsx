import { useState } from 'react'
import Icon from './Icon'

// Campo de texto con label e icono opcional. Base de TextInput.
export function TextInput({ label, icon, hint, className = '', ...rest }) {
  return (
    <label className={`field ${className}`.trim()}>
      {label && <span className="field__label">{label}</span>}
      <span className={`field__control${icon ? ' field__control--icon' : ''}`}>
        {icon && <Icon name={icon} size={18} strokeFill className="field__icon" />}
        <input className="field__input" {...rest} />
      </span>
      {hint && <span className="field__hint">{hint}</span>}
    </label>
  )
}

// Input de contraseña con toggle mostrar/ocultar.
export function PasswordInput({ label, icon = 'lock', className = '', ...rest }) {
  const [show, setShow] = useState(false)
  return (
    <label className={`field ${className}`.trim()}>
      {label && <span className="field__label">{label}</span>}
      <span className="field__control field__control--icon">
        {icon && <Icon name={icon} size={18} strokeFill className="field__icon" />}
        <input className="field__input" type={show ? 'text' : 'password'} {...rest} />
        <button
          type="button"
          className="field__toggle"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {show ? 'Ocultar' : 'Ver'}
        </button>
      </span>
    </label>
  )
}

// Selector desplegable. options acepta strings o { value, label }.
export function Select({ label, options = [], className = '', ...rest }) {
  return (
    <label className={`field ${className}`.trim()}>
      {label && <span className="field__label">{label}</span>}
      <span className="field__control field__control--select">
        <select className="field__input" {...rest}>
          {options.map((o) => (
            <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
          ))}
        </select>
      </span>
    </label>
  )
}

// Casilla de verificación con estilo de marca.
export function Checkbox({ label, checked, onChange, className = '' }) {
  return (
    <label className={`checkbox ${className}`.trim()}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="checkbox__box">
        <Icon name="check" size={14} />
      </span>
      <span className="checkbox__label">{label}</span>
    </label>
  )
}

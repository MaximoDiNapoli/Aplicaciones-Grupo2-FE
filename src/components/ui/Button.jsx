import { Link } from 'react-router-dom'
import Icon from './Icon'

// Boton reutilizable. Cubre ButtonPrimary/Secondary/Ghost y los alias PrimaryCTA/CheckoutCTA.
// variant: primary | secondary | ghost | outline
// to -> renderiza un <Link> interno; href -> <a>; en otro caso <button>.
function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  block = false,
  to,
  href,
  type = 'button',
  className = '',
  ...rest
}) {
  const cls = `btn btn--${variant} btn--${size}${block ? ' btn--block' : ''} ${className}`.trim()
  const content = (
    <>
      {iconLeft && <Icon name={iconLeft} size={size === 'lg' ? 20 : 18} strokeFill={iconLeft !== 'star'} />}
      <span>{children}</span>
      {iconRight && <Icon name={iconRight} size={size === 'lg' ? 20 : 18} strokeFill />}
    </>
  )

  if (to) return <Link to={to} className={cls} {...rest}>{content}</Link>
  if (href) return <a href={href} className={cls} {...rest}>{content}</a>
  return <button type={type} className={cls} {...rest}>{content}</button>
}

export default Button

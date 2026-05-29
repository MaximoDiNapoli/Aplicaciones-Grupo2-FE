import Icon from './Icon'

// Badge / Tag corto. tone: pink | mint | orange | neutral | brand
export function Badge({ children, tone = 'pink', className = '' }) {
  return <span className={`badge badge--${tone} ${className}`.trim()}>{children}</span>
}

// Tag de atributo de producto (outlined).
export function Tag({ children, icon }) {
  return (
    <span className="tag">
      {icon && <Icon name={icon} size={14} strokeFill />}
      {children}
    </span>
  )
}

// Chip de estado de orden con icono y color.
const STATUS = {
  entregado: { tone: 'mint', icon: 'checkCircle', label: 'Entregado' },
  enviado: { tone: 'orange', icon: 'truck', label: 'Enviado' },
  procesando: { tone: 'neutral', icon: 'box', label: 'Procesando' },
}

export function StatusChip({ status, label }) {
  const cfg = STATUS[status] || STATUS.procesando
  return (
    <span className={`status-chip status-chip--${cfg.tone}`}>
      <Icon name={cfg.icon} size={14} strokeFill />
      {label || cfg.label}
    </span>
  )
}

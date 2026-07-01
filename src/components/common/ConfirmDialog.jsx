import { useEffect, useState } from 'react'
import Button from '../ui/Button'
import Icon from '../ui/Icon'

// Modal de confirmación reutilizable para acciones destructivas (borrados).
// Uso: <ConfirmDialog open={...} title message confirmLabel onConfirm onClose />
// `onConfirm` puede ser async: mientras se resuelve, el botón muestra "Eliminando...".
function ConfirmDialog({
  open,
  title = '¿Estás seguro?',
  message,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onClose,
}) {
  const [busy, setBusy] = useState(false)

  // Cerrar con Escape (deshabilitado mientras se procesa el borrado).
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape' && !busy) onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, busy, onClose])

  if (!open) return null

  const handleConfirm = async () => {
    setBusy(true)
    try {
      await onConfirm?.()
    } finally {
      setBusy(false)
      onClose?.()
    }
  }

  return (
    <div className="modal-overlay" role="presentation" onClick={() => { if (!busy) onClose?.() }}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal__title" id="confirm-dialog-title">
          <span className="modal__icon"><Icon name="trash" size={18} strokeFill /></span>
          {title}
        </h2>
        {message && <p className="modal__message">{message}</p>}
        <div className="modal__actions">
          <Button variant="outline" onClick={() => onClose?.()} disabled={busy}>{cancelLabel}</Button>
          <Button variant="danger" iconLeft="trash" onClick={handleConfirm} disabled={busy}>
            {busy ? 'Eliminando...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog

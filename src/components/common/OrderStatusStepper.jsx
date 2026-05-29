import Icon from '../ui/Icon'

// Stepper horizontal de estado de orden (detalle de compra).
// steps: [{id,label,icon}], current: índice 0-based del paso alcanzado.
function OrderStatusStepper({ steps, current = 0 }) {
  return (
    <div className="order-stepper">
      {steps.map((step, idx) => {
        const reached = idx <= current
        return (
          <div className="order-stepper__node" key={step.id}>
            <span className={`order-stepper__dot${reached ? ' is-on' : ''}`}>
              <Icon name={step.icon} size={18} strokeFill />
            </span>
            <span className={`order-stepper__label${reached ? ' is-on' : ''}`}>{step.label}</span>
            {idx < steps.length - 1 && (
              <span className={`order-stepper__line${idx < current ? ' is-on' : ''}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default OrderStatusStepper

import Icon from '../ui/Icon'

const steps = [
  { id: 1, label: 'Envío' },
  { id: 2, label: 'Pago' },
  { id: 3, label: 'Resumen' },
]

// Indicador de pasos del checkout. active = paso actual (1-3).
function CheckoutStepper({ active = 1 }) {
  return (
    <div className="stepper">
      {steps.map((step, idx) => {
        const done = step.id < active
        const current = step.id === active
        const state = done ? 'done' : current ? 'current' : 'todo'
        return (
          <div className="stepper__node" key={step.id}>
            <div className="stepper__dotwrap">
              <span className={`stepper__dot stepper__dot--${state}`}>
                {done ? <Icon name="check" size={16} /> : step.id}
              </span>
              <span className="stepper__label">{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <span className={`stepper__line${step.id < active ? ' is-done' : ''}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default CheckoutStepper

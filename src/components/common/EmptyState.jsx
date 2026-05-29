import Button from '../ui/Button'

// Estado vacío reutilizable: ilustración (gradiente) + título + texto + CTAs.
// illustration: [colorA, colorB]; actions: array de props de Button.
function EmptyState({ illustration = ['#ff9ec0', '#ff619b'], emoji, title, message, actions = [], children }) {
  return (
    <div className="empty-state">
      <div
        className="empty-state__art"
        style={{ background: `radial-gradient(120% 120% at 35% 25%, ${illustration[0]}, ${illustration[1]})` }}
      >
        {emoji && <span className="empty-state__emoji">{emoji}</span>}
      </div>
      <h2 className="empty-state__title">{title}</h2>
      {message && <p className="empty-state__message">{message}</p>}
      {children}
      {actions.length > 0 && (
        <div className="empty-state__actions">
          {actions.map((a, i) => (
            <Button key={i} {...a} />
          ))}
        </div>
      )}
    </div>
  )
}

export default EmptyState

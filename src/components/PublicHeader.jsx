const CartIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M3 5h2l2.2 10.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.5L20.5 8H6.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="10" cy="19" r="1.6" fill="currentColor" />
    <circle cx="17" cy="19" r="1.6" fill="currentColor" />
  </svg>
)

const UserIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle
      cx="12"
      cy="8.5"
      r="3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M5 19c1.6-3 4.1-4.6 7-4.6s5.4 1.6 7 4.6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

function PublicHeader() {
  return (
    <header className="public-header">
      <div className="public-header__brand">Sugar Safari</div>
      <div className="public-header__actions">
        <button className="icon-btn" type="button" aria-label="Carrito">
          <CartIcon />
        </button>
        <button className="icon-btn" type="button" aria-label="Cuenta">
          <UserIcon />
        </button>
      </div>
    </header>
  )
}

export default PublicHeader

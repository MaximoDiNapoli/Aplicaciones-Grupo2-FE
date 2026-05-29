import Brand from './Brand'

// Layout centrado para estados (404). Header minimal + card centrada.
function CenteredStateLayout({ children }) {
  return (
    <div className="state-page">
      <header className="checkout-header">
        <Brand withIcon size="md" />
      </header>
      <main className="state-main">{children}</main>
    </div>
  )
}

export default CenteredStateLayout

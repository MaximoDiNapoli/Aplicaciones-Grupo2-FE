import Brand from './Brand'
import CheckoutStepper from './CheckoutStepper'

// Layout de checkout: header minimal centrado + stepper + contenido.
function CheckoutLayout({ step, children, brandSize = 'md' }) {
  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <Brand withIcon size={brandSize} />
      </header>
      <main className="checkout-main">
        <CheckoutStepper active={step} />
        {children}
      </main>
    </div>
  )
}

export default CheckoutLayout

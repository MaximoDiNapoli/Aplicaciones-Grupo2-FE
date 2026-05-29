import PublicHeader from './PublicHeader'
import Footer from './Footer'
import AccountSidebar from './AccountSidebar'

// Layout de cuenta: header + (sidebar + contenido) + footer.
function AccountLayout({ children, activeItem, user }) {
  return (
    <div className="page">
      <PublicHeader />
      <div className="account-layout">
        <AccountSidebar activeItem={activeItem} user={user} />
        <main className="account-layout__main">{children}</main>
      </div>
      <Footer />
    </div>
  )
}

export default AccountLayout

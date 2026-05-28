# Analisis de componentes por pagina

Este documento identifica los componentes necesarios para cada pantalla del Figma y los componentes compartidos entre ellas. La lista esta basada en las pantallas PNG dentro de `guia/paginasfigma`.

## Componentes comunes (cross-page)

### Layouts compartidos

- `PublicStoreLayout` (header superior + footer) para home, catalogo, detalle, carrito, checkout y paginas de estado.
- `AccountLayout` (sidebar usuario + header + footer) para perfil y mis compras.
- `AuthLayout` (hero visual + card de formulario) para login y registro.
- `CheckoutLayout` (stepper + contenido + panel resumen) para envio, pago y resumen.
- `SellerDashboardLayout` (sidebar lateral claro) para panel, inventario y ventas del vendedor.
- `AdminDashboardLayout` (sidebar lateral oscuro) para dashboard admin y gestion.
- `CenteredStateLayout` para 404 y estados vacios.

### UI atomicos

- `ButtonPrimary`, `ButtonSecondary`, `ButtonGhost`, `IconButton`.
- `TextInput`, `PasswordInput`, `NumberInput`, `Textarea`, `Select`, `DatePicker`.
- `Checkbox`, `Radio`, `ToggleSwitch`.
- `Badge`, `Tag`, `StatusChip`.
- `Divider`, `Card`, `CardHeader`, `CardBody`.
- `Avatar`, `Icon`, `Tooltip`, `Breadcrumbs`.

### UI de datos

- `Table`, `TableRow`, `TableActions`.
- `Pagination`.
- `StatCard` (KPI con valor y variacion).
- `ChartCard` (grafico de barras o linea).

### Domain components (compartidos en varias paginas)

- `ProductCard` (imagen, nombre, precio, CTA).
- `ProductGrid`.
- `CategoryCard`.
- `PriceDisplay` (precio normal + descuento).
- `RatingStars`.
- `QuantityStepper`.
- `OrderSummaryCard`.
- `CartItemRow`.
- `OrderStatusStepper`.
- `AddressCard`.
- `PaymentMethodCard`.
- `EmptyState` (ilustracion + texto + CTA).

## Componentes por pagina (usuario final)

### Inicio

- `PublicHeader` (logo + icono carrito + perfil)
- `HeroBanner` (titulo + copy + CTA + imagen)
- `CategoryCardGrid`
- `SectionHeader` (titulo + link "View All")
- `ProductCardGrid`
- `Footer`

### Catalogo

- `PublicHeader`
- `SidebarNav` (categorias + acceso cuenta)
- `FilterPanel` (checkbox categorias, slider precio)
- `SortSelect`
- `ProductCardGrid`
- `Pagination`
- `Footer`

### Detalle de Producto (usuario)

- `PublicHeader`
- `Breadcrumbs`
- `ProductImageGallery` (imagen principal + thumbnails)
- `StockBadge` / `AvailabilityChip`
- `RatingStars` + `ReviewCount`
- `PriceDisplay`
- `FeatureTags` (sin gluten, artesanal, etc)
- `QuantityStepper`
- `CTAStack` (comprar ahora, agregar al carrito)
- `ReviewCardGrid`
- `RelatedProducts` (card list)
- `Footer`

### Carrito

- `PublicHeader`
- `PageTitle`
- `InfoBanner` (envio gratis)
- `CartItemRow` (imagen, nombre, qty, precio, remove)
- `OrderSummaryCard` (subtotal, envio, impuestos, cupon)
- `CouponInput`
- `CheckoutCTA`
- `Footer`

### Carrito Vacio

- `PublicHeader`
- `EmptyState` (imagen + texto + CTA)
- `SectionHeader` (golosinas mas buscadas)
- `ProductCardGrid`
- `Footer`

### Checkout - Envio

- `CheckoutStepper`
- `AddressCard` (direcciones guardadas)
- `AddNewAddressForm`
- `OrderSummaryCard` (mini lista + total)
- `PrimaryCTA` (continuar)

### Checkout - Pago

- `CheckoutStepper`
- `PaymentMethodCard` (tarjeta, paypal, transferencia)
- `CardForm` (numero, vencimiento, cvv)
- `SavePaymentCheckbox`
- `OrderSummaryCard`
- `PrimaryCTA`

### Checkout - Resumen

- `CheckoutStepper`
- `SummaryPanel` (direccion + metodo pago + items)
- `EditableSection` (boton editar)
- `TotalsPanel` (subtotal, envio, descuento)
- `TermsCheckbox`
- `PrimaryCTA`

### Checkout - Confirmacion

- `ConfirmationHero` (ilustracion + titulo)
- `InfoCard` (estimado entrega)
- `PurchaseSummaryCard`
- `PrimaryCTA` (rastrear pedido)
- `SecondaryCTA` (volver al inicio)
- `Footer`

### Mis Compras

- `AccountSidebar`
- `PageTitle`
- `FilterTabs` (todos, enviado, entregado)
- `OrdersTable` (estado + link a detalle)
- `Footer`

### Detalle de Compra

- `BackLink`
- `OrderHeader` (numero + fecha)
- `OrderStatusStepper`
- `StatusInfoBanner` (estimado + tracking)
- `OrderItemsTable` (items + precios)
- `TotalsSummary`
- `InfoCard` (direccion, metodo pago)
- `DownloadInvoiceButton`
- `Footer`

### Perfil

- `AccountSidebar`
- `ProfileCard` (avatar + nombre + email + tel)
- `EditProfileButton`
- `StatsCardGrid` (miembro desde, compras, total)
- `Footer`

### Registro

- `AuthLayout`
- `AuthForm` (nombre, email, telefono, password, confirm)
- `PasswordVisibilityToggle`
- `PrimaryCTA`
- `AuthLink` (ya tienes cuenta)

### Login Unificado

- `AuthLayout`
- `RoleTabs` (cliente/vendedor/admin) *nota: revisar segun correcciones* 
- `AuthForm` (email, password)
- `RememberMeCheckbox`
- `PrimaryCTA`
- `AuthLink` (crear cuenta)

### Pagina 404

- `CenteredStateLayout`
- `EmptyState` (ilustracion + copy)
- `SearchInput`
- `PrimaryCTA` (volver al inicio)
- `SecondaryCTA` (explorar tienda)

### Sin Resultados

- `PublicHeader`
- `EmptyState` (mensaje + CTA volver)
- `ProductCardGrid` (recomendados)
- `Footer`

## Componentes por pagina (vendedor)

### Dashboard Vendedor

- `SellerSidebar`
- `PageTitle`
- `StatCardGrid` (productos, ordenes pendientes, ordenes totales)
- `OrdersTable` (ordenes recientes + accion)
- `PrimaryCTA` (ver todas)

### Mis Productos (Inventario)

- `SellerSidebar`
- `PageTitle`
- `SearchBar`
- `FilterSelects` (categoria, estado)
- `ProductTable` (foto, nombre, categoria, precio, rendimiento)
- `StatusChip`
- `Pagination`
- `FloatingCTA` (crear nuevo producto)

### Crear Producto

- `SellerSidebar`
- `Breadcrumbs`
- `ProductForm` (nombre, categoria, descripcion)
- `PriceInventoryForm`
- `DiscountToggle` + `DateRangeInputs`
- `ImageUploader` (drag & drop)
- `PricePreviewCard`
- `PrimaryCTA` (guardar)
- `SecondaryCTA` (cancelar)

### Detalle de Producto (Vendedor)

- `SellerSidebar`
- `ProductImageGallery`
- `PriceStructureCard`
- `InventoryDetailsCard`
- `PerformanceCard`
- `ActionButtons` (editar, duplicar, eliminar)
- `ProductDescription`

### Mis Ordenes (Ventas Vendedor)

- `SellerSidebar`
- `StatCardGrid` (ordenes + ingresos)
- `SearchBar`
- `FilterSelect` (estado)
- `DateRangePicker`
- `OrdersTable`
- `Pagination`

### Detalle de Orden (Vendedor)

- `SellerSidebar`
- `OrderHeader`
- `OrderStatusStepper`
- `CustomerCard`
- `ShippingAddressCard`
- `PaymentMethodCard`
- `OrderItemsTable`
- `TotalsSummary`
- `PrimaryCTA` (cambiar estado)
- `SecondaryCTA` (imprimir)

## Componentes por pagina (admin)

### Panel de Control (Admin HQ)

- `AdminSidebar`
- `PageTitle`
- `StatCardGrid` (ventas, usuarios, pendientes, conversion)
- `SalesTrendChart`
- `CategorySalesCard`
- `RecentActivityTable`

### Gestion de Usuarios

- `AdminSidebar`
- `PageTitle`
- `SearchBar`
- `FilterSelects` (rol, estado)
- `DatePicker` (fecha de registro)
- `UsersTable` (rol, actividad, estado, acciones)
- `PrimaryCTA` (nuevo usuario)
- `PaymentMethodsPanel` (stripe, paypal, mercado pago)
- `ProviderCard` (toggle + editar credenciales)

### Gestion Global de Ventas

- `AdminSidebar`
- `PageTitle`
- `FilterBar` (rango fechas, vendedor, metodo pago)
- `OrdersTable` (comision + estado pago)
- `Pagination`

### Catalogo Global de Productos

- `AdminSidebar`
- `PageTitle`
- `SearchBar`
- `FilterSelects` (categoria, estado, stock)
- `ProductsTable` (sku, vendedor, precio)
- `Pagination`

### Gestion de Categorias

- `AdminSidebar`
- `PageTitle`
- `CategoriesTable` (nombre, descripcion, # productos)
- `TableActions` (ver, editar, eliminar)
- `PrimaryCTA` (nueva categoria)
- `Pagination`

## Componentes repetidos clave (resumen rapido)

- `Header + Footer` en todas las paginas publicas.
- `Sidebar + Table + Pagination` en vistas de administrador y vendedor.
- `ProductCard` y `ProductGrid` en home, catalogo, sin resultados, carrito vacio y relacionados.
- `OrderSummaryCard` en carrito y checkout.
- `Stepper` en checkout y estados de orden.
- `EmptyState` en 404, sin resultados y carrito vacio.

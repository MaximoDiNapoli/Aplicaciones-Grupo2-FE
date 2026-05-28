# Detalle de componentes

Este documento detalla cada componente identificado a partir de las pantallas de Figma.

## Convenciones

- "Props clave" describe los datos minimos para renderizar.
- "Estados/variantes" cubre loading, empty, error, disabled, size, etc.
- "Usado en" lista las paginas o layouts donde aparece.

## Layouts

### PublicStoreLayout

- Proposito: layout base para paginas publicas con header, footer y contenedor.
- Props clave: children, showHeader, showFooter, maxWidth.
- Estados/variantes: sin variantes; soporte de fondo claro.
- Usado en: home, catalogo, detalle, carrito, checkout, estados.

### AccountLayout

- Proposito: layout de cuenta con sidebar y area principal.
- Props clave: children, activeItem, userSummary.
- Estados/variantes: sidebar colapsable en mobile.
- Usado en: perfil, mis compras.

### AuthLayout

- Proposito: layout centrado con hero visual y tarjeta de formulario.
- Props clave: children, heroImage, title.
- Estados/variantes: version login/registro.
- Usado en: login, registro.

### CheckoutLayout

- Proposito: layout de checkout con stepper y panel resumen.
- Props clave: step, children, summary.
- Estados/variantes: desktop two-column, mobile stack.
- Usado en: envio, pago, resumen.

### SellerDashboardLayout

- Proposito: layout de vendedor con sidebar claro y zona de trabajo.
- Props clave: children, activeItem.
- Estados/variantes: sidebar colapsable.
- Usado en: dashboard, productos, ordenes.

### AdminDashboardLayout

- Proposito: layout admin con sidebar oscuro y cabecera opcional.
- Props clave: children, activeItem.
- Estados/variantes: sidebar colapsable.
- Usado en: admin dashboard y gestion.

### CenteredStateLayout

- Proposito: layout centrado para estados vacios o error.
- Props clave: children, maxWidth.
- Estados/variantes: alineacion vertical.
- Usado en: 404, sin resultados.

## Navegacion y estructura

### PublicHeader

- Proposito: header publico con logo, busqueda y accesos.
- Props clave: cartCount, onCartClick, onAccountClick, onSearch.
- Estados/variantes: sticky, con o sin buscador.
- Usado en: paginas publicas.

### Footer

- Proposito: footer con links, redes y legal.
- Props clave: links, socialLinks, copyright.
- Estados/variantes: simple o extendido.
- Usado en: paginas publicas.

### SidebarNav

- Proposito: sidebar ligero con categorias y accesos de cuenta.
- Props clave: items, activeItem, onSelect.
- Estados/variantes: colapsado en mobile.
- Usado en: catalogo.

### AccountSidebar

- Proposito: menu de cuenta de usuario.
- Props clave: items, activeItem, userSummary.
- Estados/variantes: icon-only en mobile.
- Usado en: perfil, mis compras.

### SellerSidebar

- Proposito: menu lateral de vendedor.
- Props clave: items, activeItem.
- Estados/variantes: colapsable.
- Usado en: panel vendedor.

### AdminSidebar

- Proposito: menu lateral admin.
- Props clave: items, activeItem.
- Estados/variantes: colapsable.
- Usado en: panel admin.

### Breadcrumbs

- Proposito: mostrar jerarquia de navegacion.
- Props clave: items[{label, href}], onNavigate.
- Estados/variantes: con separador icono.
- Usado en: detalle producto, crear producto.

### PageTitle

- Proposito: titulo principal de pagina con subtitulo opcional.
- Props clave: title, subtitle, actions.
- Estados/variantes: con acciones a la derecha.
- Usado en: paneles y listados.

### SectionHeader

- Proposito: encabezado de seccion con link "ver mas".
- Props clave: title, actionLabel, onAction.
- Estados/variantes: alineado izquierda/derecha.
- Usado en: home, carrito vacio.

### HeroBanner

- Proposito: seccion hero con imagen, copy y CTA.
- Props clave: title, description, ctaLabel, onCta.
- Estados/variantes: fondo con imagen o color.
- Usado en: home.

### BackLink

- Proposito: link de retorno a pagina anterior.
- Props clave: label, onClick, href.
- Estados/variantes: con icono flecha.
- Usado en: detalle compra.

## UI base (botones y basicos)

### ButtonPrimary

- Proposito: accion principal.
- Props clave: label, onClick, disabled, loading, iconLeft.
- Estados/variantes: tamanios sm/md/lg.
- Usado en: CTAs principales.

### ButtonSecondary

- Proposito: accion secundaria.
- Props clave: label, onClick, disabled.
- Estados/variantes: contorno o relleno suave.
- Usado en: acciones de apoyo.

### ButtonGhost

- Proposito: accion terciaria sin fondo.
- Props clave: label, onClick.
- Estados/variantes: con icono.
- Usado en: links de accion.

### IconButton

- Proposito: boton solo icono.
- Props clave: icon, ariaLabel, onClick, size.
- Estados/variantes: redondo o cuadrado.
- Usado en: acciones rapidas.

### PrimaryCTA

- Proposito: alias visual de ButtonPrimary en flujos clave.
- Props clave: label, onClick, disabled.
- Estados/variantes: con icono direccional.
- Usado en: checkout, confirmaciones.

### SecondaryCTA

- Proposito: alias visual de ButtonSecondary.
- Props clave: label, onClick.
- Estados/variantes: outline.
- Usado en: confirmacion, 404.

### CheckoutCTA

- Proposito: CTA especifico del carrito.
- Props clave: label, onClick, disabled.
- Estados/variantes: full width en mobile.
- Usado en: carrito.

### FloatingCTA

- Proposito: boton flotante para crear recursos.
- Props clave: label, onClick, position.
- Estados/variantes: visible en scroll.
- Usado en: inventario vendedor.

### ActionButtons

- Proposito: grupo de acciones contextual (editar, duplicar, eliminar).
- Props clave: actions[{label, icon, onClick, tone}].
- Estados/variantes: horizontal o menu.
- Usado en: detalle producto vendedor.

### Badge

- Proposito: etiqueta corta informativa.
- Props clave: text, tone.
- Estados/variantes: success/warning/error.
- Usado en: estados rapidos.

### Tag

- Proposito: tag para atributos de producto.
- Props clave: label.
- Estados/variantes: outlined.
- Usado en: detalle producto.

### StatusChip

- Proposito: chip de estado con color.
- Props clave: status, label.
- Estados/variantes: success/warning/error.
- Usado en: tablas de ordenes.

### Divider

- Proposito: separador visual.
- Props clave: orientation, spacing.
- Estados/variantes: horizontal/vertical.
- Usado en: cards y secciones.

### Card

- Proposito: contenedor base con borde y sombra.
- Props clave: children, padding, tone.
- Estados/variantes: elevacion baja/alta.
- Usado en: todo.

### CardHeader

- Proposito: header estandar de card.
- Props clave: title, actions.
- Estados/variantes: con subtitulo.
- Usado en: cards de dashboard.

### CardBody

- Proposito: cuerpo de card.
- Props clave: children.
- Estados/variantes: densidad compacta.
- Usado en: cards.

### Avatar

- Proposito: imagen de usuario.
- Props clave: src, fallback, size.
- Estados/variantes: circular o cuadrado.
- Usado en: perfil y header.

### Icon

- Proposito: icono vectorial reutilizable.
- Props clave: name, size, color.
- Estados/variantes: filled/outline.
- Usado en: botones y tags.

### Tooltip

- Proposito: ayuda contextual al hover/focus.
- Props clave: content, placement.
- Estados/variantes: delay.
- Usado en: icon buttons.

## Formularios e inputs

### TextInput

- Proposito: input de texto.
- Props clave: label, value, onChange, placeholder, error.
- Estados/variantes: disabled, readOnly.
- Usado en: formularios varios.

### PasswordInput

- Proposito: input de password con toggle.
- Props clave: label, value, onChange, error.
- Estados/variantes: mostrar/ocultar.
- Usado en: login y registro.

### NumberInput

- Proposito: input numerico con validacion.
- Props clave: label, value, onChange, min, max.
- Estados/variantes: stepper opcional.
- Usado en: precios e inventario.

### Textarea

- Proposito: campo de texto largo.
- Props clave: label, value, onChange, rows.
- Estados/variantes: auto-resize.
- Usado en: descripcion producto.

### Select

- Proposito: selector desplegable.
- Props clave: label, value, options, onChange.
- Estados/variantes: searchable.
- Usado en: filtros y forms.

### DatePicker

- Proposito: selector de fecha.
- Props clave: label, value, onChange, minDate, maxDate.
- Estados/variantes: rango simple.
- Usado en: filtros de ordenes.

### Checkbox

- Proposito: opcion booleana.
- Props clave: label, checked, onChange.
- Estados/variantes: indeterminate.
- Usado en: terminos, opciones.

### Radio

- Proposito: seleccion unica.
- Props clave: name, value, checked, onChange.
- Estados/variantes: grupo.
- Usado en: metodo de pago.

### ToggleSwitch

- Proposito: toggle on/off.
- Props clave: checked, onChange, label.
- Estados/variantes: compact.
- Usado en: descuentos.

### SearchInput

- Proposito: input de busqueda simple.
- Props clave: value, onChange, placeholder.
- Estados/variantes: con icono.
- Usado en: 404.

### SearchBar

- Proposito: barra de busqueda con CTA o filtros.
- Props clave: value, onChange, onSubmit, placeholder.
- Estados/variantes: full width.
- Usado en: panel vendedor/admin.

### CouponInput

- Proposito: input de cupon con boton aplicar.
- Props clave: value, onChange, onApply.
- Estados/variantes: disabled si vacio.
- Usado en: carrito.

### AuthForm

- Proposito: contenedor de campos de autenticacion.
- Props clave: fields, onSubmit, errorMessage.
- Estados/variantes: login vs registro.
- Usado en: login y registro.

### PasswordVisibilityToggle

- Proposito: control para mostrar/ocultar password.
- Props clave: isVisible, onToggle.
- Estados/variantes: icono ojo.
- Usado en: PasswordInput.

### RememberMeCheckbox

- Proposito: opcion "recordarme".
- Props clave: checked, onChange.
- Estados/variantes: none.
- Usado en: login.

### AuthLink

- Proposito: link entre login y registro.
- Props clave: label, href.
- Estados/variantes: inline.
- Usado en: auth.

### RoleTabs

- Proposito: tabs de rol en auth (si aplica).
- Props clave: items, active, onChange.
- Estados/variantes: deshabilitado por definicion de rol via token.
- Usado en: login (si se mantiene).

### AddNewAddressForm

- Proposito: formulario de direccion.
- Props clave: values, onChange, onSubmit.
- Estados/variantes: guardada vs nueva.
- Usado en: checkout envio.

### CardForm

- Proposito: formulario de tarjeta.
- Props clave: cardNumber, expiry, cvv, onChange.
- Estados/variantes: validacion en vivo.
- Usado en: checkout pago.

### SavePaymentCheckbox

- Proposito: toggle para guardar metodo de pago.
- Props clave: checked, onChange.
- Estados/variantes: none.
- Usado en: checkout pago.

### TermsCheckbox

- Proposito: aceptar terminos.
- Props clave: checked, onChange, link.
- Estados/variantes: error si no acepta.
- Usado en: checkout resumen.

### ProductForm

- Proposito: formulario base de producto.
- Props clave: values, onChange, onSubmit.
- Estados/variantes: crear vs editar.
- Usado en: crear producto.

### PriceInventoryForm

- Proposito: seccion de precio y stock.
- Props clave: price, stock, sku, onChange.
- Estados/variantes: con descuento.
- Usado en: crear producto.

### DiscountToggle

- Proposito: activar descuento.
- Props clave: enabled, onChange.
- Estados/variantes: aplica rango de fechas.
- Usado en: crear producto.

### DateRangeInputs

- Proposito: rango de fechas (inicio/fin).
- Props clave: startDate, endDate, onChange.
- Estados/variantes: validar orden.
- Usado en: descuentos y filtros.

### ImageUploader

- Proposito: cargar imagenes con drag & drop.
- Props clave: files, onAdd, onRemove, maxFiles.
- Estados/variantes: progreso de carga.
- Usado en: crear producto.

## Filtros y navegacion de datos

### FilterPanel

- Proposito: panel lateral de filtros.
- Props clave: categories, priceRange, onChange.
- Estados/variantes: colapsable.
- Usado en: catalogo.

### SortSelect

- Proposito: ordenamiento de listados.
- Props clave: value, options, onChange.
- Estados/variantes: compact.
- Usado en: catalogo.

### FilterSelect

- Proposito: selector unico de filtro.
- Props clave: label, value, options, onChange.
- Estados/variantes: compact.
- Usado en: ordenes vendedor.

### FilterSelects

- Proposito: grupo de filtros.
- Props clave: filters[], onChange.
- Estados/variantes: responsive.
- Usado en: inventario, usuarios.

### FilterTabs

- Proposito: tabs por estado.
- Props clave: tabs, activeTab, onChange.
- Estados/variantes: scrollable.
- Usado en: mis compras.

### FilterBar

- Proposito: barra horizontal de filtros.
- Props clave: children, onApply, onClear.
- Estados/variantes: sticky.
- Usado en: gestion ventas admin.

### Pagination

- Proposito: paginacion de listas.
- Props clave: page, totalPages, onChange.
- Estados/variantes: compact.
- Usado en: tablas.

## Listados y tablas

### Table

- Proposito: tabla base.
- Props clave: columns, rows, rowKey.
- Estados/variantes: striped, hover.
- Usado en: listados.

### TableRow

- Proposito: fila estandar con celdas.
- Props clave: cells, actions.
- Estados/variantes: selectable.
- Usado en: Table.

### TableActions

- Proposito: acciones por fila (ver/editar/eliminar).
- Props clave: actions.
- Estados/variantes: menu o botones.
- Usado en: tablas admin.

### OrdersTable

- Proposito: listado de ordenes.
- Props clave: orders, onView, onStatusChange.
- Estados/variantes: con estado y fecha.
- Usado en: mis compras, vendedor, admin.

### OrderItemsTable

- Proposito: items de una orden.
- Props clave: items, totals.
- Estados/variantes: compact.
- Usado en: detalle orden.

### UsersTable

- Proposito: listado de usuarios.
- Props clave: users, onEdit, onBlock.
- Estados/variantes: con filtros.
- Usado en: gestion usuarios.

### ProductsTable

- Proposito: listado global de productos.
- Props clave: products, onView, onToggle.
- Estados/variantes: con estado/stock.
- Usado en: catalogo admin.

### CategoriesTable

- Proposito: listado de categorias.
- Props clave: categories, onEdit, onDelete.
- Estados/variantes: con contador.
- Usado en: gestion categorias.

### ProductTable

- Proposito: listado de productos del vendedor.
- Props clave: products, onEdit, onDuplicate.
- Estados/variantes: con metricas.
- Usado en: inventario vendedor.

### RecentActivityTable

- Proposito: actividad reciente en dashboard.
- Props clave: items.
- Estados/variantes: simple.
- Usado en: admin dashboard.

## Catalogo y producto

### ProductCard

- Proposito: tarjeta de producto con imagen y CTA.
- Props clave: product, onAddToCart.
- Estados/variantes: con descuento.
- Usado en: home, catalogo, relacionados.

### ProductGrid

- Proposito: grilla responsiva de productos.
- Props clave: children, columns.
- Estados/variantes: 2/3/4 columnas.
- Usado en: listados.

### ProductCardGrid

- Proposito: wrapper de ProductCard en grid.
- Props clave: products, onAddToCart.
- Estados/variantes: con skeletons.
- Usado en: home, catalogo.

### CategoryCard

- Proposito: tarjeta de categoria.
- Props clave: category, onClick.
- Estados/variantes: con imagen.
- Usado en: home.

### CategoryCardGrid

- Proposito: grilla de categorias.
- Props clave: categories, onSelect.
- Estados/variantes: responsive.
- Usado en: home.

### ProductImageGallery

- Proposito: galeria con imagen principal y miniaturas.
- Props clave: images, selectedIndex, onSelect.
- Estados/variantes: zoom opcional.
- Usado en: detalle producto.

### ProductDescription

- Proposito: descripcion larga del producto.
- Props clave: text, bullets.
- Estados/variantes: colapsable.
- Usado en: detalle producto vendedor.

### RelatedProducts

- Proposito: lista de productos relacionados.
- Props clave: products, onAddToCart.
- Estados/variantes: carrusel o grid.
- Usado en: detalle producto.

### ReviewCardGrid

- Proposito: grid de reviews.
- Props clave: reviews.
- Estados/variantes: con paginacion.
- Usado en: detalle producto.

### ReviewCount

- Proposito: conteo de reviews junto a rating.
- Props clave: count.
- Estados/variantes: simple.
- Usado en: detalle producto.

### RatingStars

- Proposito: estrellas de rating.
- Props clave: value, max, size.
- Estados/variantes: readonly o editable.
- Usado en: producto.

### FeatureTags

- Proposito: tags de atributos (sin gluten, etc).
- Props clave: tags[].
- Estados/variantes: compact.
- Usado en: detalle producto.

### StockBadge

- Proposito: badge de stock.
- Props clave: status, label.
- Estados/variantes: inStock/outOfStock.
- Usado en: detalle producto.

### AvailabilityChip

- Proposito: chip de disponibilidad.
- Props clave: status.
- Estados/variantes: success/warning.
- Usado en: detalle producto.

### PriceDisplay

- Proposito: precio con descuento y moneda.
- Props clave: price, oldPrice, currency.
- Estados/variantes: con descuento o sin.
- Usado en: cards y detalle.

### QuantityStepper

- Proposito: control de cantidad.
- Props clave: value, min, max, onChange.
- Estados/variantes: disabled si sin stock.
- Usado en: carrito y detalle.

### CTAStack

- Proposito: stack de botones primario/secundario.
- Props clave: primary, secondary, onPrimary, onSecondary.
- Estados/variantes: vertical en mobile.
- Usado en: detalle producto.

### CartItemRow

- Proposito: item del carrito con qty y acciones.
- Props clave: item, onRemove, onQtyChange.
- Estados/variantes: compact/normal.
- Usado en: carrito.

### PricePreviewCard

- Proposito: preview de precio en formulario.
- Props clave: price, discount, finalPrice.
- Estados/variantes: con promo.
- Usado en: crear producto.

### PriceStructureCard

- Proposito: estructura de precios de producto vendedor.
- Props clave: cost, price, margin.
- Estados/variantes: readonly.
- Usado en: detalle producto vendedor.

### InventoryDetailsCard

- Proposito: detalles de stock y SKU.
- Props clave: stock, sku, warehouse.
- Estados/variantes: alertas stock bajo.
- Usado en: detalle producto vendedor.

### PerformanceCard

- Proposito: metricas de performance de producto.
- Props clave: views, sales, conversion.
- Estados/variantes: comparativa.
- Usado en: detalle producto vendedor.

## Checkout y ordenes

### CheckoutStepper

- Proposito: indicador de pasos del checkout.
- Props clave: steps, activeStep.
- Estados/variantes: completo/incompleto.
- Usado en: checkout.

### OrderSummaryCard

- Proposito: resumen de compra con totales.
- Props clave: items, subtotal, shipping, taxes, total.
- Estados/variantes: con cupon.
- Usado en: carrito y checkout.

### SummaryPanel

- Proposito: panel resumen en checkout.
- Props clave: sections, onEdit.
- Estados/variantes: lectura.
- Usado en: checkout resumen.

### TotalsPanel

- Proposito: panel de totales en checkout.
- Props clave: subtotal, shipping, discount, total.
- Estados/variantes: destacado.
- Usado en: checkout resumen.

### TotalsSummary

- Proposito: resumen de totales en detalle de orden.
- Props clave: subtotal, shipping, taxes, total.
- Estados/variantes: compacto.
- Usado en: detalle compra/orden.

### PurchaseSummaryCard

- Proposito: tarjeta de resumen post compra.
- Props clave: orderId, total, eta.
- Estados/variantes: con CTA.
- Usado en: confirmacion.

### InfoCard

- Proposito: tarjeta informativa reutilizable.
- Props clave: title, content, icon.
- Estados/variantes: tono info/warn.
- Usado en: confirmacion, detalle compra.

### InfoBanner

- Proposito: banner horizontal de info.
- Props clave: message, tone.
- Estados/variantes: dismissible.
- Usado en: carrito.

### StatusInfoBanner

- Proposito: banner con tracking y estado.
- Props clave: status, trackingId, eta.
- Estados/variantes: success/inProgress.
- Usado en: detalle compra.

### OrderHeader

- Proposito: encabezado de orden con id y fecha.
- Props clave: orderId, date, status.
- Estados/variantes: con badge.
- Usado en: detalle orden/compra.

### OrderStatusStepper

- Proposito: stepper de estado de orden.
- Props clave: steps, current.
- Estados/variantes: en progreso/completado.
- Usado en: detalle orden.

### AddressCard

- Proposito: tarjeta de direccion.
- Props clave: name, address, phone, isDefault.
- Estados/variantes: seleccionable.
- Usado en: checkout envio.

### PaymentMethodCard

- Proposito: tarjeta de metodo de pago.
- Props clave: brand, last4, isSelected.
- Estados/variantes: seleccionable.
- Usado en: checkout y detalle orden.

### ShippingAddressCard

- Proposito: tarjeta de direccion de envio.
- Props clave: address, phone.
- Estados/variantes: readonly.
- Usado en: detalle orden vendedor.

### CustomerCard

- Proposito: tarjeta con datos del cliente.
- Props clave: name, email, phone.
- Estados/variantes: readonly.
- Usado en: detalle orden vendedor.

### ConfirmationHero

- Proposito: bloque hero de confirmacion.
- Props clave: title, message, illustration.
- Estados/variantes: centrado.
- Usado en: confirmacion.

### DownloadInvoiceButton

- Proposito: descarga de factura.
- Props clave: href, onClick.
- Estados/variantes: disabled si no hay factura.
- Usado en: detalle compra.

## Cuenta y perfil

### ProfileCard

- Proposito: card de perfil con avatar y datos.
- Props clave: user, onEdit.
- Estados/variantes: editable.
- Usado en: perfil.

### EditProfileButton

- Proposito: CTA de edicion de perfil.
- Props clave: onClick.
- Estados/variantes: icono opcional.
- Usado en: perfil.

### StatsCardGrid

- Proposito: grilla de stats de usuario.
- Props clave: stats[].
- Estados/variantes: responsive.
- Usado en: perfil.

## Admin y vendedor (kpis y paneles)

### StatCard

- Proposito: KPI con valor y variacion.
- Props clave: label, value, delta.
- Estados/variantes: positivo/negativo.
- Usado en: dashboards.

### StatCardGrid

- Proposito: grilla de KPIs.
- Props clave: stats[].
- Estados/variantes: responsive.
- Usado en: dashboard vendedor/admin.

### ChartCard

- Proposito: card conteniendo grafico.
- Props clave: title, data, type.
- Estados/variantes: loading.
- Usado en: dashboards.

### SalesTrendChart

- Proposito: grafico de tendencia de ventas.
- Props clave: data, range.
- Estados/variantes: por semana/mes.
- Usado en: admin dashboard.

### CategorySalesCard

- Proposito: resumen de ventas por categoria.
- Props clave: items[].
- Estados/variantes: ordenado desc.
- Usado en: admin dashboard.

### PaymentMethodsPanel

- Proposito: panel de metodos de pago configurados.
- Props clave: providers[], onEdit.
- Estados/variantes: activo/inactivo.
- Usado en: gestion usuarios.

### ProviderCard

- Proposito: card de proveedor de pago.
- Props clave: name, enabled, onToggle, onEdit.
- Estados/variantes: conectado/no conectado.
- Usado en: gestion usuarios.

## Estados vacios

### EmptyState

- Proposito: estado vacio con ilustracion y CTA.
- Props clave: title, message, ctaLabel, onCta.
- Estados/variantes: noResults, notFound, emptyCart.
- Usado en: 404, sin resultados, carrito vacio.

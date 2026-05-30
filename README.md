# Sugar Safari — Frontend (Grupo 2)

Tienda de dulces artesanales. Vite + React 19 + React Router 7. UI **solo desktop** y **100% en español**, construida pixel-perfect a partir de los PNG de Figma en `guia/paginasfigma`.

## Cómo correrlo

```bash
npm install      # si aún no instalaste dependencias (solo la primera vez)
npm run dev      # entorno de desarrollo
npm run build    # build de producción
npm run lint     # eslint
```

Tras `npm run dev`, Vite imprime la URL local en la consola:

```
  ➜  Local:   http://localhost:5173/
```

Abrí esa dirección en el navegador (Vite usa el **puerto 5173** por defecto; si está ocupado
elige el siguiente libre: 5174, 5175, …, así que mirá siempre la URL que aparece en la consola).
Para detener el servidor, presioná `Ctrl + C` en la terminal.

> El proyecto es **solo desktop**: mirá en una ventana ancha (≥ 1100 px).

## Flujo de demo (login por rol y cierre de sesión)

No hay backend: los datos son de demostración y la sesión se simula con la navegación.

1. Entrá a **`/login`**. El rol **no se elige con tabs** (corrección de la profesora): el destino
   se deduce de lo que escribas en el campo **Correo Electrónico** (simula el rol del token):

   | Escribí… | Te lleva a | Pantalla |
   | --- | --- | --- |
   | `usuario` (o cualquier correo) | `/` | Tienda (usuario final) |
   | `vendedor` | `/vendedor` | Panel de vendedor |
   | `admin` | `/admin` | Panel de administrador |

   La contraseña puede ser cualquier valor. Luego presioná **"Entrar al Safari"**.

2. **Acceder sin cuenta (invitado)**: el botón **"Acceder sin cuenta"** del login te deja
   explorar la tienda, pero **no podés comprar**: en el carrito el botón pasa a
   "Inicia sesión para comprar" y las rutas de checkout redirigen al login.

3. **Cerrar sesión** (los tres roles):
   - Usuario/Cliente → en **`/perfil`**, botón **"Cerrar Sesión"**.
   - Vendedor → ícono de salida junto al usuario, abajo del sidebar (`/vendedor`).
   - Administrador → **"Cerrar Sesión"** abajo del sidebar (`/admin`).

   Cualquiera de ellos limpia la sesión y vuelve a `/login`.

## Vistas implementadas (usuario final)

Todas navegables desde el header, sidebars y CTAs:

| Ruta | Vista |
| --- | --- |
| `/` | Inicio (hero, hábitats, destacados) |
| `/catalogo` | Catálogo (filtros + grilla + paginación) |
| `/producto/:id` | Detalle de producto (galería, reseñas, relacionados) |
| `/carrito` | Carrito (muestra "Carrito vacío" si no hay items) |
| `/checkout/envio` `/pago` `/resumen` `/confirmacion` | Flujo de checkout (stepper) |
| `/compras` · `/compras/:id` | Mis Compras · Detalle de compra |
| `/perfil` | Perfil de usuario |
| `/login` · `/registro` | Autenticación |
| `/sin-resultados` | Búsqueda sin resultados |
| `*` | Página 404 |

## Vistas de vendedor

| Ruta | Vista |
| --- | --- |
| `/vendedor` | Panel de control (KPIs + órdenes recientes) |
| `/vendedor/inventario` | Mis Productos (listado + CTA flotante "Crear Nuevo Producto") |
| `/vendedor/inventario/nuevo` | Crear Producto |
| `/vendedor/inventario/:id` | Detalle de producto (vendedor) |
| `/vendedor/ventas` · `/vendedor/ventas/:id` | Mis Ventas · Detalle de orden |

## Vistas de administrador

| Ruta | Vista |
| --- | --- |
| `/admin` | Panel de control (KPIs + gráficos + actividad) |
| `/admin/usuarios` | Gestión de Usuarios + Métodos de Pago |
| `/admin/ventas` | Gestión Global de Ventas |
| `/admin/catalogo` | Catálogo Global de Productos |
| `/admin/categorias` | Gestión de Categorías |

## Estructura

```
src/
  components/
    ui/        Átomos reutilizables: Icon, Button, Field (inputs/checkbox/select),
               Badge/Tag/StatusChip, PriceDisplay, QuantityStepper, RatingStars…
    layout/    PublicStoreLayout, AccountLayout, AuthLayout, CheckoutLayout,
               CenteredStateLayout, PublicHeader, Footer, AccountSidebar,
               CheckoutStepper, Brand
    product/   ProductCard, ProductGrid, CategoryCard, ProductImage
    common/    SectionHeader, EmptyState, CartItemRow, OrderSummaryCard,
               CheckoutSummaryPanel, OrderStatusStepper
  components/
    dashboard/ shells.jsx (SellerLayout, AdminLayout, PageTitle, StatCard, Avatar, Pill)
  pages/       Las 16 vistas de usuario final
    seller/    6 vistas de vendedor
    admin/     5 vistas de administrador
  store/       cart.jsx (contexto de carrito en memoria)
  data/        mock.js (datos de demostración)
  styles/      app.css (estilos de componentes y páginas)
  index.css    tokens del sistema de diseño (paleta de usuario + fuentes)
```

## Decisiones de diseño

- **Paleta de usuario** aplicada en todo (corrección de la profesora): Primary `#FF619B`,
  Secondary `#70D6BC`, Tertiary `#FF8C42`, Neutral `#F9F7F2`, magenta de marca `#BE2C5B`.
  Tipografía: Nunito (titulares) + Nunito Sans (cuerpo).
- **Login sin selección manual de rol**: se omiten las tabs cliente/vendedor/admin del Figma;
  el rol debe resolverse desde el token de autenticación.
- **Idioma**: toda la UI en español (incluido el Inicio, que en el PNG estaba en inglés).
- **Componentes reutilizables**: header, footer, sidebars, cards, grids, stepper, resumen de
  orden y estados vacíos se comparten entre páginas.
- **Vendedor y admin con la misma paleta de usuario** (corrección de la profesora): se sustituyó
  el índigo/púrpura de los PNG por el magenta de marca. El admin conserva un sidebar oscuro
  charcoal (`#2E3132`, que ya forma parte de la paleta de usuario) con acentos magenta/rosa.
- **Inventario del vendedor** (corrección #6): flujo unificado — una sola vista de listado con un
  botón flotante "Crear Nuevo Producto" que lleva a la pantalla de creación separada, evitando
  la duplicación de productos.

## Supuestos

- Las imágenes de producto se representan con **gradientes** (`ProductImage`) para funcionar
  sin red; al integrar backend se reemplazan por `src` reales.
- Los datos (productos, órdenes, perfil, direcciones) son **mock** en `src/data/mock.js`.
- El carrito es un estado en memoria (no persiste). Vaciar el carrito muestra la vista
  "Carrito vacío" en la misma ruta `/carrito`.

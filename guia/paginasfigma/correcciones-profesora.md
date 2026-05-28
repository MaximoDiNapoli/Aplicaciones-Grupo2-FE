# Figma y correcciones de la profesora

Este documento resume las pantallas exportadas en `guia/paginasfigma` y las correcciones observadas para ajustar el proyecto antes de avanzar con la implementación.

## Objetivo

Tomar las referencias visuales de Figma como base para construir una interfaz consistente, clara e intuitiva, manteniendo la misma línea visual en todos los perfiles de usuario.

## Pantallas disponibles en `guia/paginasfigma`

### Usuario final

- [Inicio - Sugar Safari.png](Inicio%20-%20Sugar%20Safari.png)
- [Catálogo - Sugar Safari.png](Cat%C3%A1logo%20-%20Sugar%20Safari.png)
- [Detalle de Producto - Sugar Safari.png](Detalle%20de%20Producto%20-%20Sugar%20Safari.png)
- [Carrito - Sugar Safari.png](Carrito%20-%20Sugar%20Safari.png)
- [Carrito Vacío - Sugar Safari.png](Carrito%20Vac%C3%ADo%20-%20Sugar%20Safari.png)
- [Checkout_ Envío - Sugar Safari.png](Checkout_%20Env%C3%ADo%20-%20Sugar%20Safari.png)
- [Checkout_ Pago - Sugar Safari.png](Checkout_%20Pago%20-%20Sugar%20Safari.png)
- [Checkout_ Resumen - Sugar Safari.png](Checkout_%20Resumen%20-%20Sugar%20Safari.png)
- [Checkout_ Confirmación - Sugar Safari.png](Checkout_%20Confirmaci%C3%B3n%20-%20Sugar%20Safari.png)
- [Mis Compras - Sugar Safari.png](Mis%20Compras%20-%20Sugar%20Safari.png)
- [Detalle de Compra - Sugar Safari.png](Detalle%20de%20Compra%20-%20Sugar%20Safari.png)
- [Perfil - Sugar Safari.png](Perfil%20-%20Sugar%20Safari.png)
- [Registro - Sugar Safari.png](Registro%20-%20Sugar%20Safari.png)
- [Login Unificado - Sugar Safari 2026.png](Login%20Unificado%20-%20Sugar%20Safari%202026.png)
- [Página 404 - Sugar Safari.png](P%C3%A1gina%20404%20-%20Sugar%20Safari.png)
- [Sin Resultados - Sugar Safari.png](Sin%20Resultados%20-%20Sugar%20Safari.png)

### Vendedor

- [Dashboard Vendedor - Sugar Safari.png](Dashboard%20Vendedor%20-%20Sugar%20Safari.png)
- [Mis Productos - Panel Vendedor.png](Mis%20Productos%20-%20Panel%20Vendedor.png)
- [Crear Producto - Panel Vendedor.png](Crear%20Producto%20-%20Panel%20Vendedor.png)
- [Detalle de Producto - Vendedor.png](Detalle%20de%20Producto%20-%20Vendedor.png)
- [Detalle de Orden - Vendedor.png](Detalle%20de%20Orden%20-%20Vendedor.png)
- [Mis Órdenes - Ventas Vendedor.png](Mis%20%C3%93rdenes%20-%20Ventas%20Vendedor.png)

### Admin

- [Panel de Control - Admin HQ.png](Panel%20de%20Control%20-%20Admin%20HQ.png)
- [Gestión de Usuarios - Admin.png](Gesti%C3%B3n%20de%20Usuarios%20-%20Admin.png)
- [Gestión de Ventas - Admin.png](Gesti%C3%B3n%20de%20Ventas%20-%20Admin.png)
- [Gestión Global de Productos - Admin.png](Gesti%C3%B3n%20Global%20de%20Productos%20-%20Admin.png)
- [Gestión de Categorías - Admin Maestro.png](Gesti%C3%B3n%20de%20Categor%C3%ADas%20-%20Admin%20Maestro.png)

### Sistemas y paletas

- [Colores Usuario.png](Colores%20Usuario.png)
- [Colores Vendedor.png](Colores%20Vendedor.png)
- [Html → Body.png](Html%20%E2%86%92%20Body.png)
- [2E3132.png](2E3132.png)

## Correcciones de la profesora

### 1. El diseño debe seguir siendo atractivo, claro e intuitivo

La interfaz está bien encaminada, pero se espera que el flujo de navegación se mantenga simple y fácil de entender en todas las vistas. Cada pantalla debe ayudar a completar una tarea concreta sin distraer al usuario.

### 2. Mantener la misma paleta de colores

La paleta visual debe conservarse sin importar el rol del usuario o la sección del sistema. No conviene cambiar colores base entre usuario, vendedor y administrador si eso rompe la coherencia visual. Definición actual: usar la paleta de las vistas de usuario para todos los roles.

### 3. El login no debe pedir el rol manualmente

En la pantalla de inicio de sesión, el rol del usuario debe obtenerse desde el token o desde la información de autenticación, no mediante una selección manual del usuario. Esto evita inconsistencias y reduce errores en el acceso.

### 4. Mantener consistencia idiomática

La página principal está en inglés, por lo que el resto de la interfaz debería seguir el mismo idioma para no mezclar estilos ni romper la coherencia de la experiencia. Definición actual: toda la aplicación en español.

### 5. La vista de medio de pago todavía no está maquetada

La pantalla de pago necesita una definición visual completa. Debe tener estructura, jerarquía de contenido y distribución clara de la información antes de integrarla al flujo de checkout.

### 6. Replantear la vista del vendedor en inventario

Queda pendiente resolver por qué se duplicaría el producto dentro del inventario y dónde debe ubicarse la acción para agregar un nuevo producto. La pantalla debería dejar claro si existe una vista de listado, una acción de creación separada o un flujo unificado para administrar productos.

## Definiciones confirmadas

- Idioma: toda la aplicación en español.
- Paleta: se usa la paleta de las vistas de usuario en todos los roles.

## Pendientes de definición

- Definir el flujo real de login sin selección manual de rol.
- Maquetar la pantalla de pago.
- Ajustar el inventario del vendedor para que la creación de productos quede clara.

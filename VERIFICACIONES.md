# Verificaciones — Pruebas y auditoría de endpoints

> Registro de las pruebas realizadas sobre la integración React-Redux-Axios, con foco en
> **que no se llamen endpoints de forma redundante o innecesaria**. Complementa a
> [REFACTOR-REDUX.md](REFACTOR-REDUX.md) (qué se hizo) con **cómo se verificó**.
>
> Fecha: 2026-06-28 · Entorno: Windows 11, Node v24.13.0, Vite 8, React 19.

---

## 0. Eliminación total de datos mock + features nuevas (última iteración)

Se eliminó **todo** consumo de `src/data/mock.js` (archivo **borrado**). Lo que era mock ahora
viene del backend, creando endpoints nuevos donde hacía falta:

| Antes (mock) | Ahora (backend real) |
|---|---|
| `ProductDetail` reseñas fabricadas + `rating` fijo (4) | **Feature Reseñas nueva** en el backend (`/api/resenas`): entidad `Resena`, repo, service, controller, seguridad. El frontend lista reseñas reales y calcula el rating promedio; los COMPRADOR pueden publicar reseña. |
| `AdminUsers` panel "pasarelas" (Stripe/PayPal toggles) | **Métodos de pago reales** (`/api/metodos-pago`, CRUD ya existente): listar + crear + eliminar (admin). |
| `rating`/`reviews` inventados en `normalizeProduct` | Eliminados; el rating se **deriva de reseñas reales**. |
| `data/mock.js` (~370 líneas) | **Archivo eliminado**. `git grep data/mock` → sin resultados. |

Backend nuevo (perfil MySQL requiere crear la tabla `resena`; el perfil H2 la crea sola):
`entity/Resena`, `repository/ResenaRepository`, `dto/ResenaRequest`, `dto/ResenaResponse`,
`service/ResenaService(+Impl)`, `controller/ResenaController`, reglas en `SecurityConfig`
(`GET /api/resenas` público, `POST /api/resenas` sólo COMPRADOR) y un `DataSeeder`
(`@Profile("h2")`) que siembra admin/vendedor/comprador + catálogo para pruebas.

También pulido: filtro de estado roto en `SellerProducts` (comparaba `'Activo'` vs `'activo'`),
y error *stale* en `CheckoutSummary` (ahora se limpia al entrar con `clearOrdersError`).

## 1. Resumen

| Verificación | Resultado |
|---|---|
| `npx eslint src` | ✅ sin errores |
| `npm run build` (Vite/Rollup) | ✅ 167 módulos, build OK |
| Dev server `npm run dev` sirve la app | ✅ HTTP 200 (root + entry presentes) |
| Auditoría de endpoints redundantes | ✅ corregida (ver §4–§5) |
| Test dinámico de conteo de endpoints | ✅ 8/8 escenarios sin llamadas de más |
| Datos de mock → backend (reseñas y métricas admin) | ✅ corregido (ver §8) |
| Backend real levantado (perfil H2) + e2e | ✅ ver §9 |

---

## 2. Comprobaciones estáticas (build / lint / arranque)

```text
> npx eslint src
LINT_OK            (0 errores, 0 warnings)

> npm run build
✓ 167 modules transformed.
dist/assets/index-*.js   449.60 kB │ gzip: 134.75 kB
✓ built in ~200 ms

> npm run dev   (smoke test sobre http://localhost:5173)
HTTP 200 · root div OK · main.jsx entry OK
```

> El `build` de Rollup resuelve todo el grafo de imports/exports: si un thunk o slice
> importara algo inexistente, fallaría. Pasa limpio ⇒ la migración es consistente.

---

## 3. Cómo se probó el conteo real de endpoints (sin backend ni navegador)

No hay backend Spring levantado ni navegador headless disponible. Para medir llamadas
**reales** se ejecutan los **thunks de verdad** (store + slices + api + axios) contra un
**backend mock en Node** que registra cada request:

- `scripts/verify-endpoints.mjs` — backend mock (`http`) que loguea `método + path` y
  responde JSON; crea un **store fresco por escenario** (simula entrar “en frío” a cada
  pantalla) y despacha el thunk correspondiente.
- `scripts/loader.mjs` + `scripts/ext-resolver.mjs` — hook que permite a Node resolver los
  imports sin extensión del `src/` (lo que normalmente hace Vite).

Ejecutar:
```bash
node --import ./scripts/loader.mjs scripts/verify-endpoints.mjs
```

> Ajuste para testabilidad: en `src/services/http.js` se protegió el acceso a
> `import.meta.env` (`import.meta.env && import.meta.env.VITE_API_URL`) para poder importar
> el módulo fuera de Vite. Es inocuo en producción (Vite sigue inyectando la variable).

---

## 4. Hallazgos de la auditoría (redundancias detectadas)

1. **`/api/categorias` se pedía dos veces** en pantallas de catálogo. Causa: `fetchProducts()`
   y `fetchProductById()` (en `api.js`) piden categorías **por dentro**, y las páginas además
   despachaban `loadCategories()` por separado.
   - Home / Catalog / AdminCategories: `loadCategories()` + `loadProducts()` ⇒ **categorías ×2**.
   - ProductDetail: `loadProductById()` + `loadProducts()` ⇒ **categorías ×2**.
2. **Recargas redundantes tras mutación**: `AdminCategories` y `AdminUsers` hacían un
   `loadCategories()` / `loadUsers()` extra después de crear/editar, **aunque el slice ya se
   actualiza** con la entidad devuelta por el thunk (GET innecesario).
3. **Despachos duplicados concurrentes** (React 19 StrictMode invoca los efectos dos veces en
   desarrollo): cada `dispatch` en `useEffect` podía disparar la misma request dos veces.

---

## 5. Correcciones aplicadas

1. **Reutilización de categorías desde el store** (`features/products/productsThunks.js`):
   helper `ensureCategoriesById()` — si las categorías ya están en el store no se vuelven a
   pedir; si faltan, se piden **una sola vez** y se publican en el slice (`categoriesSet`).
   Las lecturas usan `fetchProductsOnly` / `fetchProductOnly` (solo `/api/productos`).
2. **Thunks orquestadores** `loadCatalog()` y `loadProductPage(id)`: cargan categorías primero
   (una vez) y luego los productos, garantizando **un único** `GET /api/categorias` por pantalla.
   Páginas actualizadas: Home, Catalog, AdminCategories, ProductDetail.
3. **`condition` anti-duplicado** en `loadCategories`, `loadUsers`, `loadOrders`: si ya hay una
   carga en curso, se omite el despacho duplicado (cubre StrictMode y cargas concurrentes).
4. **Eliminadas las recargas post-mutación** en AdminCategories y AdminUsers (el slice ya
   refleja el resultado del thunk; el punto 3 normaliza la categoría devuelta).
5. **Caché de sesión**: al navegar entre pantallas, las categorías ya cargadas **no** se vuelven
   a pedir.

---

## 6. Resultado del test dinámico (antes / después)

### Antes (patrón anterior, medido con las funciones legacy de `api.js`)
```text
Home/Catalog   (loadCategories + loadProducts)      : { /api/categorias: 2, /api/productos: 1 }
ProductDetail  (loadProductById + loadProducts)     : { /api/categorias: 2, /api/productos/1: 1, /api/productos: 1 }
```

### Después (implementación actual) — 8/8 OK
```text
[OK] Home / Catalog / AdminCategories -> loadCatalog()       { /api/categorias: 1, /api/productos: 1 }
[OK] ProductDetail -> loadProductPage(1)                     { /api/categorias: 1, /api/productos/1: 1, /api/productos: 1 }
[OK] AdminProducts -> loadProducts()                         { /api/categorias: 1, /api/productos: 1 }
[OK] SellerProducts -> loadSellerProducts()                  { /api/categorias: 1, /api/productos: 1 }
[OK] loadCategories() x2 concurrente (condition)             { /api/categorias: 1 }
[OK] loadUsers() x2 concurrente (condition)                  { /api/users: 1 }
[OK] loadOrders() x2 concurrente (condition)                 { /api/compras: 1 }
[OK] Navegación: loadCatalog() y luego loadProducts()        { /api/categorias: 1, /api/productos: 2 }

=== TODO OK: sin llamadas redundantes ===
```

**Conclusión:** `/api/categorias` pasó de **2 → 1** por pantalla de catálogo; los despachos
concurrentes se deduplican a **1**; y la navegación reutiliza categorías (no repite el GET).

---

## 7. Limitaciones / pendiente de prueba manual

- **No se ejecutó contra el backend real** (Spring `:8080`). El test usa un mock; el contrato
  real (formato de respuestas, que los endpoints existan y respondan 2xx) debe validarse
  levantando el backend + `npm run dev` y recorriendo los flujos CRUD en el navegador.
- **StrictMode en desarrollo** duplica intencionalmente los efectos: en `npm run dev` puede
  verse alguna request repetida que **no** ocurre en producción. Los `condition` mitigan los
  casos parametrizables (categorías, usuarios, compras). Las mediciones de §6 corresponden a
  un despacho único (comportamiento de producción).
- Pasos de checkout y `SellerDashboard` siguen usando `api.js` directamente; funcionan, pero
  quedan fuera de esta auditoría.

---

## 8. Corrección: datos de mock → backend (reseñas y métricas admin)

Se detectó que dos vistas consumían `src/data/mock.js` en lugar de datos del backend:

1. **`ProductDetail` — reseñas.** El backend **no tiene** entidad ni endpoint de reseñas (la
   entidad `Producto` no expone `rating`/`reviews`). Se **eliminaron los testimonios
   inventados** del mock y la sección ahora refleja la realidad del backend: muestra un
   **estado vacío** (“Este producto todavía no tiene reseñas”). Así el frontend queda
   consistente con las entidades del backend (a.txt punto 5).
2. **`AdminDashboard` — métricas.** Antes usaba `adminStats`, `adminSalesTrend` y
   `adminSalesByCategory` (valores hardcodeados). Ahora **todas** las métricas se **derivan de
   datos reales** leídos por slices de Redux:
   - KPIs: Ventas Totales (Σ `compras.total`), Usuarios Registrados (`/api/users`), Pedidos
     Pendientes (compras ≠ entregado) y **Ticket Promedio** (real, reemplaza la “conversión”
     ficticia).
   - **Tendencia de ventas**: ingresos por mes (últimos 6) calculados desde `compras`.
   - **Productos por categoría**: distribución calculada desde `productos` + `categorias`.
   - Actividad reciente: últimas compras reales.

Verificado con `npx eslint src` (OK) y `npm run build` (OK, 167 módulos).

---

## 9. Pruebas con el backend REAL (end-to-end)

Se levantó el backend Spring Boot con el **perfil H2** en memoria (evita necesitar MySQL):

```bash
# en Aplicaciones-Grupo2
SPRING_PROFILES_ACTIVE=h2 ./mvnw -DskipTests spring-boot:run
# -> Tomcat started on port 8080 · Started SrcApplication · tablas creadas (Hibernate)
```

### 9.1 Endpoints probados con `curl`
| Acción | Endpoint | Resultado |
|---|---|---|
| Health | `GET /api/health` | `{"status":"UP"}` |
| Catálogo público | `GET /api/categorias` · `GET /api/productos` | `200` (`[]` en BD vacía) |
| Registro comprador | `POST /api/auth/register` | `200` + `accessToken` (JWT) |
| Login | `POST /api/auth/login` | `200` + `accessToken` |
| Perfil | `GET /api/users/me` | `200` → “Compra Dora / COMPRADOR” |
| Mis compras | `GET /api/compras` | `200` (`[]`) |
| Carrito | `GET /api/carrito` | `200` (`[]`) |
| Admin-only sin admin | `GET /api/users`, `POST /api/categorias` | `403` (seguridad correcta) |
| CORS | `SecurityConfig` | `allowedOrigins("*")` ⇒ navegador `:5173` habilitado |

### 9.2 E2E del stack Redux contra el backend real
`scripts/verify-live.mjs` ejecuta los **thunks reales** (store + slices + axios) contra el
backend en vivo (con un polyfill mínimo de `localStorage` para persistir el token, como el
navegador):

```text
[ OK ] loadCatalog()    -> categorias=0 productos=0      (sin error, responde el back)
[ OK ] loginUser(dora)  -> token=sí(146) usuario=Compra Dora rol=COMPRADOR
[ OK ] loadOrders()     -> compras=0                      (autenticado con el token del slice)
=== E2E OK: el stack Redux conversa con el backend real ===
```

### 9.3 Estado de los servidores
- Backend `:8080` (perfil H2) — **UP**.
- Frontend `:5173` (`npm run dev`) — **HTTP 200**, sirve la app contra el backend real.

### 9.5 Pruebas exhaustivas de las features nuevas (backend H2 sembrado)

Con el `DataSeeder` (admin/vendedor/comprador `@gmail.com`, password `123`, mismas credenciales
que el seed de MySQL), se probó **por API** y por el **stack Redux del frontend**:

```text
SEED       categorias=2 · productos=2 · metodos-pago=2 · estados=4 · usuarios=3
LOGIN      admin/vendedor/comprador -> token JWT (146) OK

RESEÑAS
  GET  /api/resenas?producto=1  (público)                 -> 200 []
  POST /api/resenas sin auth                              -> 403
  POST /api/resenas como ADMIN (no comprador)             -> 403
  POST /api/resenas como COMPRADOR                        -> 201 {autorNombre:"Comprador Seed", ...}
  POST /api/resenas producto inexistente                  -> 404
  GET  /api/resenas?producto=1  (2 reseñas)               -> count=2 avg=4.5

METODOS DE PAGO
  GET  /api/metodos-pago (comprador)                      -> 200 [2]
  POST /api/metodos-pago como COMPRADOR                   -> 403
  POST /api/metodos-pago como ADMIN                       -> 201
  DELETE /api/metodos-pago/{id} como ADMIN                -> 204

PRODUCTOS (vendedor)
  POST /api/productos (multipart)                         -> 201
  PUT  /api/productos/{id}/imagen (multipart, el FIX)     -> 200  (producto editado OK)
  PUT  /api/productos/{id} con multipart (endpoint JSON)  -> falla (confirma que el FIX era necesario)
  DELETE /api/productos/{id}                              -> 204

E2E Redux (scripts/verify-live.mjs) contra backend real:
  [OK] loadCatalog()        categorias=2 productos=2
  [OK] loadResenas(1)       count=2 avg=4.5
  [OK] loginUser(comprador) rol=COMPRADOR
  [OK] createResenaThunk()  total=3
  [OK] loadMetodosPago()    metodos=2
  [OK] loadOrders()         compras=0

REDUNDANCIA (scripts/verify-endpoints.mjs)                -> 8/8 OK (sin regresión)
```

### 9.4 Flujos admin/vendedor (ahora sí probados)
El backend solo permite **auto-registrarse como COMPRADOR** (crear `VENDEDOR`/`ADMINISTRADOR`
exige un admin). Para poder probar esos flujos end-to-end se agregó el `DataSeeder`
(`@Profile("h2")`) que crea un admin, un vendedor y un comprador (`@gmail.com`, password `123`)
más catálogo y reseñas. Con eso se validaron **con datos reales**: alta/edición/baja de
productos (vendedor), CRUD de métodos de pago (admin) y publicación de reseñas (comprador) — §9.5.

> Nota MySQL: el perfil por defecto usa `ddl-auto=validate`. Se **agregó la tabla `Resena`** a
> `Aplicaciones-Grupo2/bdd/init.sql` y datos de reseñas a `bdd/reset_seed_chocolateria_animales.sql`,
> de modo que MySQL valida el esquema y queda poblado. El `DataSeeder` no corre en MySQL
> (está acotado a `@Profile("h2")`).

### 9.6 Issues extra encontrados y arreglados (llamadas innecesarias / limpieza)

- **`CartEmpty` y `NoResults`** pedían el catálogo al backend cada vez (`fetchProducts`), aun si
  ya estaba en el store. Ahora leen del slice `products` y **solo piden si está vacío** (reutilizan
  la caché → cero llamadas al navegar desde el catálogo).
- **`SellerDashboard`** usaba `fetchSellerProducts` **crudo** (sin normalizar) con estado local.
  Migrado al slice `products`/`orders` (consistencia + sin estado duplicado).
- **Código muerto eliminado**: `fetchProducts` y `fetchProductById` de `api.js` (las variantes que
  pedían `/api/categorias` por dentro) ya no se usaban; se borraron.
- **Fix pre-existente**: filtro de estado en `SellerProducts` (`'Activo'` vs `'activo'`).
- **Fix**: error *stale* de compras en `CheckoutSummary` (se limpia al entrar).


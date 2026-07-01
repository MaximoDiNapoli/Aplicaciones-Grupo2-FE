# Refactorización e integración de Redux Toolkit — Log de trabajo

> UVA: *Redux avanzado*. Ejercicio grupal de refactorización e integración de las
> operaciones CRUD del backend (ver `a.txt`). Este documento registra **qué había que
> hacer**, **qué se hizo** y **cómo verificarlo**.

---

## 1. Punto de partida

La aplicación **no usaba Redux**: el estado global vivía en **React Context**
(`src/store/auth.jsx`, `cart.jsx`, `checkout.jsx`, `toast.jsx`) y las peticiones HTTP
se hacían con **`fetch`** (`src/services/api.js`). Además, cada página repetía el mismo
patrón de `useState(data) + useState(loading) + useState(error) + useEffect(fetch...)`,
con código duplicado y estados de carga locales dispersos.

**Objetivo (consigna):** migrar a **Redux Toolkit** (createSlice + createAsyncThunk) con
**Axios**, unificando el manejo de carga/éxito/error y la comunicación con el backend.

> El usuario pidió explícitamente usar **Redux Toolkit** (no Redux "clásico" ni Context).

---

## 2. Qué había que hacer (según `a.txt`) y cómo se resolvió

| Punto de `a.txt` | Resuelto con |
|---|---|
| **1. Slices actualizados** — `createAsyncThunk` para CRUD, acciones GET/POST/PUT/DELETE, manejo de `pending/fulfilled/rejected`, estados `loading/error/data` | Slices en `src/features/*` con thunks `createAsyncThunk` y `extraReducers` que cubren los 3 estados vía el helper `handleAsync`. |
| **2. Estructura de proyecto** — modularización `/features/` por dominio, separar thunks (async) de slices (estado) | Carpeta `src/features/<dominio>/` con `*Thunks.js` (lógica async) y `*Slice.js` (estado) separados. Store en `src/app/store.js`. |
| **3. Integración con el backend** — **Axios** para todo, URLs correctas, manejo de respuestas/errores | Cliente único `src/services/http.js` (instancia Axios + interceptores de token y de error). `api.js` ahora delega 100% en Axios. |
| **4. Refactorización de componentes** — `useSelector`, `useDispatch`, sin estados locales duplicados, render condicional carga/error | Páginas CRUD migradas a `useSelector/useDispatch`; los hooks legacy se reimplementaron sobre Redux. Render condicional `loading/error` mantenido. |
| **5. Flujo front-back** — cada acción con su endpoint, consistencia de entidades, probar CRUD | Cada thunk mapea a un endpoint existente del backend (`/api/...`). Ver tabla de endpoints abajo. |

---

## 3. Qué se hizo (cambios concretos)

### 3.1 Dependencias
```
npm install @reduxjs/toolkit react-redux axios
```
> Nota: la instalación falló inicialmente por verificación de certificado SSL
> (`UNABLE_TO_VERIFY_LEAF_SIGNATURE`, antivirus/proxy interceptando). Se resolvió con
> `NODE_OPTIONS=--use-system-ca` (y deshabilitando temporalmente el antivirus).

### 3.2 Capa HTTP con Axios
- **`src/services/http.js`** (nuevo): instancia Axios con `baseURL` (`VITE_API_URL` →
  `http://localhost:8080`), **interceptor de request** que adjunta el `Bearer token`, e
  **interceptor de response** que normaliza el error del backend a un `Error` con mensaje
  legible.
- **`src/services/session.js`** (nuevo): helpers de sesión en `localStorage`
  (`getStoredToken/getStoredUser/saveStoredSession/...`), aislados para evitar
  dependencias circulares entre `http.js` y `api.js`.
- **`src/services/api.js`** (refactor): se eliminó `fetch`; el `request()` interno ahora
  delega en el cliente Axios. **Se conservaron todas las firmas exportadas** para no
  romper la app.

### 3.3 Helpers compartidos (anti-duplicación)
- **`src/features/shared/createApiThunk.js`**: fábrica de `createAsyncThunk` con manejo de
  error unificado (`rejectWithValue`).
- **`src/features/shared/asyncState.js`**: `handleAsync(builder, thunk, onFulfilled)`
  registra `pending → loading`, `fulfilled → datos`, `rejected → error` en un solo lugar
  (**unifica carga/éxito/error**, evita repetir la lógica en cada slice).

### 3.4 Feature slices + thunks (`src/features/`)
```
features/
  shared/      createApiThunk.js · asyncState.js
  auth/        authThunks.js (login, register, loadCurrentUser, saveProfile) · authSlice.js
  cart/        cartThunks.js (load, add, setQty, remove, clear) · cartSlice.js · cartUtils.js
  checkout/    checkoutSlice.js (shipping, payment, lastOrder)
  ui/          toastSlice.js (pushToast/removeToast + thunk notify)
  products/    productsThunks.js (fetchAll, fetchSeller, fetchOne, create, delete) · productsSlice.js
  categories/  categoriesThunks.js (CRUD completo) · categoriesSlice.js
  users/       usersThunks.js (CRUD completo) · usersSlice.js
  orders/      ordersThunks.js (fetchAll, fetchOne, fetchItems, updateStatus, create) · ordersSlice.js
```
Cada slice CRUD expone `{ items, loading, error, ... }` + **selectores**.

### 3.5 Store y Provider
- **`src/app/store.js`** (nuevo): `configureStore` con un reducer por dominio. Incluye un
  `store.subscribe` que persiste la sesión (token+usuario) en `localStorage` ante cambios
  de `auth` (reemplaza el efecto del antiguo `AuthProvider`).
- **`src/main.jsx`**: ahora envuelve la app con `<Provider store={store}>`. Se eliminaron
  los Providers de Context; `CartProvider` quedó sólo para **sincronizar** el carrito con
  el backend al cambiar la sesión, y `ToastViewport` renderiza la pila de toasts.

### 3.6 Hooks legacy reimplementados sobre Redux (compatibilidad)
Para no reescribir las ~30 páginas de golpe, `src/store/auth.jsx`, `cart.jsx`,
`checkout.jsx` y `toast.jsx` conservan su **misma API pública** (`useAuth`, `useCart`,
`useCheckout`, `useToast`) pero por dentro usan `useSelector/useDispatch`. Así **el estado
global ya vive 100% en Redux** aunque el consumidor no haya cambiado.

### 3.7 Páginas migradas a `useSelector/useDispatch`
Todas eliminan los `useState(data/loading/error)` locales y leen del store; las mutaciones
disparan thunks y muestran toasts/errores con render condicional.

| Página | Slice(s) | Operaciones |
|---|---|---|
| `admin/AdminProducts` | products | listar, eliminar |
| `admin/AdminCategories` | categories (+products) | CRUD completo |
| `admin/AdminUsers` | users | CRUD completo |
| `admin/AdminSales` | orders | listar |
| `seller/SellerProducts` | products | listar (del vendedor) |
| `seller/SellerSales` | orders | listar |
| `seller/SellerCreateProduct` | products, categories | crear |
| `seller/SellerProductDetail` | products | ver, eliminar |
| `seller/SellerOrderDetail` | orders, products | ver, cambiar estado |
| `Home` · `Catalog` | products, categories | listar |
| `ProductDetail` | products | ver + relacionados |
| `MyOrders` | orders | listar |
| `OrderDetail` | orders, products | ver detalle |
| `Profile` | auth | ver/editar perfil |
| `Login` · `Register` | auth | login / registro |
| `CheckoutSummary` | orders (cart/checkout) | crear compra |

> Nota técnica: al reiniciar estado de UI en cambios de ruta (galería, estado de orden,
> campos de perfil) se usó el patrón de **ajuste de estado durante el render** en lugar de
> `setState` dentro de `useEffect`, exigido por `eslint-plugin-react-hooks` v7.

---

## 4. Mapa acción Redux → endpoint backend (flujo front-back)

| Thunk | Método | Endpoint |
|---|---|---|
| `auth/login` | POST | `/api/auth/login` (+ `GET /api/users/me`) |
| `auth/register` | POST | `/api/auth/register` |
| `auth/loadCurrentUser` / `saveProfile` | GET / PUT | `/api/users/me` |
| `products/fetchAll` · `fetchOne` · `create` · `delete` | GET/POST/DELETE | `/api/productos[/:id]` |
| `categories/*` (CRUD) | GET/POST/PUT/DELETE | `/api/categorias[/:id]` |
| `users/*` (CRUD) | GET/POST/PUT/DELETE | `/api/users[/:id]` |
| `orders/fetchAll` · `fetchOne` · `fetchItems` | GET | `/api/compras[/:id][/detalle]` |
| `orders/updateStatus` · `create` | PUT/POST | `/api/compras/:id` |
| `cart/*` (load/add/setQty/remove/clear) | GET/POST/PUT/DELETE | `/api/carrito[/:id]/items[...]` |

---

## 5. Verificación realizada

- ✅ `npx eslint src` → **sin errores**.
- ✅ `npm run build` (Vite) → **167 módulos transformados, build OK**.
- ⏳ **Pendiente de prueba en vivo**: levantar el backend Spring (`Aplicaciones-Grupo2`,
  `:8080`) + `npm run dev` y validar manualmente los flujos CRUD (login, catálogo,
  carrito, checkout, admin). El build sólo garantiza que el grafo de imports resuelve, no
  la respuesta real del servidor.

### Cómo correr
```bash
# Backend (en Aplicaciones-Grupo2):  ./mvnw spring-boot:run
# Frontend:
cd Aplicaciones-Grupo2-FE
npm install
npm run dev          # http://localhost:5173  (VITE_API_URL opcional, default :8080)
```

---

## 6. Estado final y trabajo opcional restante

**Hecho en esta iteración (puntos 2 y 3 de la consigna):**
- ✅ Todas las páginas de listado/detalle/CRUD migradas a los slices (ver tabla 3.7).
- ✅ `createPurchase` de `CheckoutSummary` movido al thunk `createPurchaseThunk`.
- ✅ Punto 3: `createCategory`/`updateCategory` normalizan la respuesta del backend en el
  thunk, dejando el slice `categories` consistente sin necesidad de recargar.

**Opcional / mejoras futuras:**
- Crear un slice `estados` (hoy `SellerOrderDetail` carga los estados por API directa).
- Mantener `metodos-pago`/`direcciones`/`estados` como slices si se amplía el checkout.
- Reemplazar los hooks de compatibilidad (`store/*.jsx`) por consumo directo de selectores
  en los componentes de carrito/checkout que aún los usan.

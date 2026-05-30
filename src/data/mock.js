// Datos de demostración para las vistas de Sugar Safari.
// Las imágenes se representan con gradientes (ver ProductImage) para funcionar sin red.

export const categories = [
  { id: 'osos', name: 'Osos de Chocolate', icon: 'paw', g: ['#a05a2c', '#7a3f1d'] },
  { id: 'mariposas', name: 'Mariposas de Azúcar', icon: 'butterfly', g: ['#ff9ec0', '#ff619b'] },
  { id: 'grillos', name: 'Grillos Crujientes', icon: 'sparkles', g: ['#9b6b3a', '#5e3d1f'] },
  { id: 'leones', name: 'Leones de Goma', icon: 'store', g: ['#ffb15a', '#ff8c42'] },
]

export const products = [
  {
    id: 'gummy-lions',
    name: 'Pack de Leones de Goma',
    tagline: 'Un surtido fascinante de sabores frutales.',
    category: 'leones',
    price: 12.0,
    rating: 5,
    reviews: 128,
    badge: { tone: 'mint', label: 'Nuevo' },
    g: ['#ffd25a', '#ff8c42'],
  },
  {
    id: 'dark-cocoa-bears',
    name: 'Osos de Cacao Oscuro',
    tagline: '70% cacao oscuro con un toque de miel silvestre.',
    category: 'osos',
    price: 18.5,
    rating: 4,
    reviews: 86,
    badge: { tone: 'orange', label: 'Más vendido' },
    g: ['#7a4a2a', '#3d2414'],
  },
  {
    id: 'flutter-mallows',
    name: 'Mariposas de Malvavisco',
    tagline: 'Suaves, esponjosas y espolvoreadas con magia.',
    category: 'mariposas',
    price: 9.0,
    rating: 5,
    reviews: 64,
    g: ['#ffc2dc', '#ff8fb6'],
  },
  {
    id: 'classic-gummy',
    name: 'Ositos de Goma Clásicos',
    tagline: 'El clásico de siempre en sabores frutales.',
    category: 'leones',
    price: 12.0,
    oldPrice: 15.0,
    rating: 5,
    reviews: 210,
    badge: { tone: 'brand', label: '-20% OFF' },
    g: ['#ff8c42', '#ff619b'],
  },
  {
    id: 'milk-butterfly',
    name: 'Mariposa Milk Choco',
    tagline: 'Chocolate con leche en forma de mariposa.',
    category: 'mariposas',
    price: 8.5,
    rating: 4,
    reviews: 42,
    g: ['#b07a4a', '#6b4423'],
  },
  {
    id: 'sour-beetles',
    name: 'Escarabajos Ácidos',
    tagline: 'Gomitas ácidas con sabor a frutos rojos.',
    category: 'grillos',
    price: 6.0,
    rating: 4,
    reviews: 31,
    g: ['#ff6b8a', '#c0265e'],
  },
  {
    id: 'dark-lions',
    name: 'Leones de Chocolate Oscuro',
    tagline: 'Leones de cacao intenso para los más valientes.',
    category: 'leones',
    price: 14.0,
    rating: 5,
    reviews: 58,
    g: ['#8a5a30', '#412410'],
  },
  {
    id: 'pistachio-cricket',
    name: 'Chocolate de Pistacho «Grillo Saltón»',
    tagline: 'Relleno de crema de pistacho.',
    category: 'grillos',
    price: 12.99,
    oldPrice: 15.24,
    rating: 4.5,
    reviews: 18,
    badge: { tone: 'mint', label: 'En Stock' },
    g: ['#9bcf6a', '#5e8a2f'],
  },
  {
    id: 'honey-bears',
    name: 'Osos de Miel Silvestre',
    tagline: 'Gomitas suaves endulzadas con miel pura.',
    category: 'osos',
    price: 7.5,
    rating: 4,
    reviews: 39,
    g: ['#ffcf6e', '#e09a2e'],
  },
  {
    id: 'mint-butterflies',
    name: 'Mariposas de Menta',
    tagline: 'Caramelos refrescantes con alas de azúcar.',
    category: 'mariposas',
    price: 8.0,
    rating: 4,
    reviews: 27,
    g: ['#9be3cf', '#3fae93'],
  },
  {
    id: 'spicy-crickets',
    name: 'Grillos Picositos',
    tagline: 'Chocolate con un toque de chile artesanal.',
    category: 'grillos',
    price: 11.0,
    rating: 5,
    reviews: 52,
    badge: { tone: 'orange', label: 'Picante' },
    g: ['#b05a2a', '#5e2a12'],
  },
  {
    id: 'rainbow-lions',
    name: 'Leones Arcoíris',
    tagline: 'Surtido frutal de colores vibrantes.',
    category: 'leones',
    price: 10.5,
    oldPrice: 13.0,
    rating: 5,
    reviews: 96,
    badge: { tone: 'brand', label: '-19% OFF' },
    g: ['#ff9ec0', '#ff8c42'],
  },
]

export const productDetail = {
  id: 'pistachio-cricket',
  name: 'Chocolate de Pistacho «Grillo Saltón»',
  breadcrumbs: ['Inicio', 'Colección Bosque', 'Grillo de Pistacho'],
  price: 12.99,
  oldPrice: 15.24,
  rating: 4.5,
  reviews: 18,
  stock: 'En Stock (24)',
  description:
    'Un salto de sabor en cada bocado. Este grillo artesanal está elaborado con nuestro chocolate con leche de origen único, mezclado con trozos crujientes de pistacho tostado. Una combinación perfecta de dulzura suave y un toque de salinidad crujiente, ideal para exploradores de sabores de todas las edades.',
  features: ['Sin Gluten', 'Artesanal', 'Comercio Justo'],
  gallery: [
    ['#9bcf6a', '#5e8a2f'],
    ['#b07a4a', '#6b4423'],
    ['#ffb15a', '#ff8c42'],
    ['#ff9ec0', '#ff619b'],
  ],
}

export const reviews = [
  { id: 1, author: 'Ana P.', rating: 5, title: '¡Crujiente perfecto!', body: 'El pistacho le da un toque salado ideal y el chocolate es suave. Mis hijos lo encontraron buenísimo.' },
  { id: 2, author: 'Carlos D.', rating: 4, title: 'Muy original', body: 'La cremosidad por dentro y lo crujiente por fuera es una combinación rara pero deliciosa. Volveré a comprar.' },
  { id: 3, author: 'Ana R.', rating: 5, title: 'Mi favorito', body: 'De toda la colección del bosque, este es mi favorito. La textura de los pistachos está justa en su punto.' },
]

export const cartItems = [
  { id: 'gummy-monkeys', name: 'Monos de Goma', variant: 'Mezcla Tropical', price: 14.0, qty: 2, g: ['#ffd25a', '#ff8c42'] },
  { id: 'white-truffles', name: 'Trufas Blancas', variant: 'Chocolate Blanco y Plata', price: 18.0, qty: 1, g: ['#9c8f80', '#6b6155'] },
]

export const orders = [
  { id: '9842', date: '12 Oct 2023', total: 45.5, status: 'entregado' },
  { id: '9885', date: '28 Oct 2023', total: 120.0, status: 'enviado' },
  { id: '9912', date: '02 Nov 2023', total: 34.25, status: 'procesando' },
  { id: '9721', date: '15 Sep 2023', total: 89.9, status: 'entregado' },
]

export const orderDetail = {
  id: 'SS-89420',
  date: '24 de Octubre, 2024',
  status: 'enviado',
  statusSteps: [
    { id: 'confirmado', label: 'Confirmado', icon: 'checkCircle' },
    { id: 'preparando', label: 'Preparando', icon: 'box' },
    { id: 'enviado', label: 'Enviado', icon: 'truck' },
    { id: 'entregado', label: 'Entregado', icon: 'home' },
  ],
  currentStep: 2, // 0-based -> Enviado
  tracking: 'EX-99238472',
  eta: 'Oct 28 - Oct 30',
  items: [
    { id: 1, name: 'Osos de Chocolate Artesanal', variant: 'Caja de Regalo Chocolate con Leche', qty: 2, price: 24.0, g: ['#7a4a2a', '#3d2414'] },
    { id: 2, name: 'Pack Premium de Leones de Goma', variant: 'Bolsa Grande Mango y Cítricos', qty: 1, price: 15.5, g: ['#ffb15a', '#ff8c42'] },
  ],
  totals: { subtotal: 39.5, shipping: 8.0, taxes: 3.16, total: 50.66 },
  address: { name: 'Jane Doe', lines: ['Calle de los Dulces 123', 'Depto 4B', 'Ciudad Caramelo, NY 10001', 'Estados Unidos'] },
  payment: { brand: 'VISA', last4: '4242', note: 'Cobrado: $50.66' },
}

export const profile = {
  name: 'Elena la Exploradora',
  email: 'elena.exploradora@sugarsafari.com',
  phone: '+34 600 123 456',
  stats: [
    { id: 'member', value: '2024', label: 'Miembro desde', icon: 'calendar', tone: 'mint' },
    { id: 'orders', value: '15', label: 'Safari-Compras', icon: 'bag', tone: 'pink' },
    { id: 'spent', value: '$450.00', label: 'Total gastado', icon: 'dollar', tone: 'orange' },
  ],
}

export const addresses = [
  { id: 'casa', label: 'Casa', icon: 'home', lines: ['Av. de los Dulces 123', 'Ciudad Caramelo, 90210'] },
  { id: 'oficina', label: 'Oficina', icon: 'briefcase', lines: ['Torre Bombón 45, Piso 3', 'Ciudad Caramelo, 90215'] },
]

// Genera `n` filas a partir de una semilla, ciclando su contenido y reasignando id
// (para tener suficientes registros y que la paginación tenga varias páginas reales).
const cycle = (seed, n, makeId) =>
  Array.from({ length: n }, (_, i) => ({ ...seed[i % seed.length], id: makeId(i, seed[i % seed.length]) }))

/* ===================== Vendedor ===================== */

export const sellerRecentOrders = [
  { id: '9932', customer: 'María Carmen', total: 124.5, status: 'pendiente', date: 'Hoy, 10:42 AM' },
  { id: '9931', customer: 'Juan Rodríguez', total: 45.0, status: 'completada', date: 'Ayer, 16:30 PM' },
  { id: '9930', customer: 'Ana López', total: 89.9, status: 'pendiente', date: 'Ayer, 14:15 PM' },
  { id: '9929', customer: 'Carlos Gómez', total: 210.0, status: 'completada', date: '12 Oct, 09:00 AM' },
  { id: '9928', customer: 'Luis Torres', total: 15.5, status: 'cancelada', date: '11 Oct, 18:45 PM' },
]

const seedSellerProducts = [
  { id: 'trufas-cacao', name: 'Trufas de Cacao Oscuro', category: 'Chocolates', price: 12.5, sold: 840, status: 'activo', g: ['#7a4a2a', '#3d2414'] },
  { id: 'ositos-acidos', name: 'Ositos de Goma Ácidos', category: 'Gomitas', price: 4.2, sold: 2100, status: 'inactivo', g: ['#ff8c42', '#ff619b'] },
  { id: 'caramelos-duros', name: 'Caramelos Duros Surtidos', category: 'Caramelos', price: 6.75, sold: 450, status: 'activo', g: ['#ffd25a', '#ff8c42'] },
  { id: 'malvaviscos-vainilla', name: 'Malvaviscos de Vainilla', category: 'Malvaviscos', price: 5.5, sold: 1280, status: 'activo', g: ['#ffe0ec', '#ff9ec0'] },
  { id: 'paletas-frutales', name: 'Paletas Frutales Mix', category: 'Caramelos', price: 3.9, sold: 730, status: 'activo', g: ['#9be3cf', '#3fae93'] },
  { id: 'tableta-leche', name: 'Tableta de Chocolate con Leche', category: 'Chocolates', price: 9.25, sold: 1560, status: 'inactivo', g: ['#a86a3c', '#5e3a1d'] },
  { id: 'gomitas-lima', name: 'Gomitas de Lima Ácida', category: 'Gomitas', price: 4.5, sold: 980, status: 'activo', g: ['#c6e86a', '#7aa82f'] },
  { id: 'bombones-surtidos', name: 'Bombones Surtidos', category: 'Chocolates', price: 15.0, sold: 410, status: 'activo', g: ['#d4a5b5', '#a8607d'] },
  { id: 'caramelo-cafe', name: 'Caramelos de Café', category: 'Caramelos', price: 6.0, sold: 320, status: 'inactivo', g: ['#b89060', '#6e4a2a'] },
]
export const sellerProducts = cycle(seedSellerProducts, 14, (i, r) => (i < seedSellerProducts.length ? r.id : `${r.id}-${i}`))

export const sellerProductDetail = {
  id: 'gomitas-arcoiris',
  name: 'Gomitas de Osito Arcoíris (500g)',
  status: 'activo',
  basePrice: 22.0,
  discount: 50,
  finalPrice: 11.25,
  category: 'Gomitas Dulces',
  created: '15 Oct 2023',
  updated: 'Hace 2 días',
  soldMonth: 1240,
  description:
    'Deliciosas gomitas de osito con sabores frutales surtidos (fresa, naranja, limón, mora y piña). Perfectas para fiestas, mesas de dulces o simplemente para disfrutar como un snack dulce durante el día. Empaque resellable para mantener su frescura.',
  bullets: ['Sin colorantes artificiales', 'Aptas para vegetarianos (sí)', 'Ácido cítrico', 'Saborizantes naturales'],
  gallery: [['#ff8c42', '#c0265e'], ['#ffd25a', '#ff8c42'], ['#ff9ec0', '#ff619b'], ['#9bcf6a', '#5e8a2f']],
}

const seedSellerSales = [
  { id: '9021', customer: 'María González', items: 3, total: 450.0, status: 'pendiente', date: '24 Oct, 2023' },
  { id: '9020', customer: 'Carlos Ramírez', items: 1, total: 120.5, status: 'procesando', date: '24 Oct, 2023' },
  { id: '9019', customer: 'Ana Lucía Torres', items: 5, total: 890.0, status: 'enviado', date: '23 Oct, 2023' },
  { id: '9018', customer: 'Empresa XYZ S.A.', items: 12, total: 2450.0, status: 'entregado', date: '22 Oct, 2023' },
  { id: '9017', customer: 'Roberto Gómez', items: 2, total: 300.0, status: 'cancelado', date: '20 Oct, 2023' },
  { id: '9016', customer: 'Lucía Fernández', items: 4, total: 560.0, status: 'enviado', date: '19 Oct, 2023' },
  { id: '9015', customer: 'Diego Salazar', items: 1, total: 85.0, status: 'entregado', date: '18 Oct, 2023' },
]
export const sellerSales = {
  totalOrders: 1248,
  totalRevenue: 45290.0,
  rows: cycle(seedSellerSales, 13, (i) => String(9021 - i)),
}

export const sellerOrderDetail = {
  id: 'ORD-9284A',
  status: 'procesando',
  date: '24 de Octubre, 2023 a las 14:30 hs',
  steps: [
    { id: 'pendiente', label: 'Pendiente', icon: 'checkCircle' },
    { id: 'procesando', label: 'Procesando', icon: 'refresh' },
    { id: 'enviado', label: 'Enviado', icon: 'truck' },
    { id: 'entregado', label: 'Entregado', icon: 'box' },
  ],
  currentStep: 1,
  customer: { name: 'Mariana Rosas', email: 'mariana.r@example.com', phone: '+54 9 11 4321-8765' },
  address: ['Av. Libertador 1450, Piso 4, Dpto B', 'Palermo, Ciudad Autónoma de Buenos Aires', 'CPA: C1425AAB'],
  notes: 'Dejar en portería si no atiende.',
  payment: { brand: 'VISA', last4: '4242', note: 'Aprobado el 24/10/2023 - Ref: TXN-89012' },
  items: [
    { id: 1, name: 'Gomitas Ácidas Neón - Paquete 500g', qty: 2, price: 450.0, g: ['#ff619b', '#ff8c42'] },
    { id: 2, name: 'Chocolate Blanco Artesanal con Almendras', qty: 1, price: 1200.0, g: ['#e7dcc8', '#b8a888'] },
  ],
  subtotal: 2100.0,
  total: 2100.0,
}

/* ===================== Admin ===================== */

export const adminStats = [
  { id: 'ventas', label: 'Ventas Totales', value: '$124,500.00', icon: 'dollar', delta: '+12.5%', deltaTone: 'mint', sub: 'vs mes anterior', tone: 'mint' },
  { id: 'usuarios', label: 'Usuarios Nuevos', value: '842', icon: 'users', delta: '+5.2%', deltaTone: 'mint', sub: 'vs mes anterior', tone: 'pink' },
  { id: 'pendientes', label: 'Pedidos Pendientes', value: '45', icon: 'alert', delta: '+2 urgentes', deltaTone: 'orange', tone: 'orange', alert: true },
  { id: 'conversion', label: 'Tasa de Conversión', value: '3.8%', icon: 'trendUp', note: 'Sin cambios', tone: 'mint' },
]

export const adminSalesTrend = [
  { label: 'Ene', value: 28 }, { label: 'Feb', value: 48 }, { label: 'Mar', value: 40 },
  { label: 'Abr', value: 66 }, { label: 'May', value: 58 }, { label: 'Jun', value: 100, top: '$85k' },
]

export const adminSalesByCategory = [
  { id: 'premium', label: 'Dulces Premium', pct: 45, color: '#be2c5b' },
  { id: 'choco', label: 'Chocolates Artesanales', pct: 30, color: '#70d6bc' },
  { id: 'cajas', label: 'Cajas de Regalo', pct: 25, color: '#ff8c42' },
]

export const adminActivity = [
  { id: '8902', user: 'María Carmen', type: 'Venta Alto Valor', amount: '$1,250.00', status: 'completado', date: 'Hace 10 min' },
  { id: '1045', user: 'Juan Rodríguez', type: 'Nuevo Registro', amount: '—', status: 'verificado', date: 'Hace 45 min' },
  { id: '8901', user: 'Ana López', type: 'Venta Estándar', amount: '$340.50', status: 'procesando', date: 'Hace 2 horas' },
]

const seedAdminUsers = [
  { id: '8921', name: 'María Jiménez', email: 'maria.j@example.com', role: 'Vendedor', activity: '142 Ventas', status: 'activo' },
  { id: '8922', name: 'Carlos Pérez', email: 'carlos.p@example.com', role: 'Cliente', activity: '12 Compras', status: 'activo' },
  { id: '8923', name: 'Ana López', email: 'ana.l@example.com', role: 'Vendedor', activity: '89 Ventas', status: 'suspendido' },
  { id: '8924', name: 'Diego Salazar', email: 'diego.s@example.com', role: 'Cliente', activity: '34 Compras', status: 'activo' },
  { id: '8925', name: 'Lucía Fernández', email: 'lucia.f@example.com', role: 'Vendedor', activity: '210 Ventas', status: 'activo' },
  { id: '8926', name: 'Roberto Gómez', email: 'roberto.g@example.com', role: 'Cliente', activity: '5 Compras', status: 'suspendido' },
]
export const adminUsers = cycle(seedAdminUsers, 11, (i) => String(8921 + i))

export const adminPaymentProviders = [
  { id: 'stripe', name: 'Stripe', enabled: true },
  { id: 'paypal', name: 'PayPal', enabled: true },
  { id: 'mercadopago', name: 'MercadoPago', enabled: false },
]

const seedAdminGlobalSales = [
  { id: '9021', date: '24 Oct 2023, 14:30', customer: 'Carlos Mendoza', seller: 'Sweet Tooth Mx', method: 'Tarjeta', total: 1250.0, commission: 125.0, status: 'pagado' },
  { id: '9020', date: '24 Oct 2023, 11:15', customer: 'Ana García', seller: 'Candy Corp', method: 'PayPal', total: 890.5, commission: 89.05, status: 'rechazado' },
  { id: '9019', date: '23 Oct 2023, 18:45', customer: 'Luis Herrera', seller: 'Gomitas Locas SA', method: 'Transferencia', total: 3400.0, commission: 340.0, status: 'pendiente' },
  { id: '9018', date: '23 Oct 2023, 09:20', customer: 'Elena Rojas', seller: 'Sweet Tooth Mx', method: 'Tarjeta', total: 450.0, commission: 45.0, status: 'pagado' },
  { id: '9017', date: '22 Oct 2023, 16:05', customer: 'Pablo Núñez', seller: 'Candy Corp', method: 'PayPal', total: 1780.0, commission: 178.0, status: 'pagado' },
  { id: '9016', date: '22 Oct 2023, 10:40', customer: 'Sofía Castro', seller: 'Gomitas Locas SA', method: 'Transferencia', total: 620.0, commission: 62.0, status: 'pendiente' },
]
export const adminGlobalSales = cycle(seedAdminGlobalSales, 13, (i) => String(9021 - i))

const seedAdminProducts = [
  { id: 'gom-001', name: 'Gomitas Ácidas Arcoíris', sku: 'GOM-001', category: 'Gomitas', seller: 'Dulcería El Oasis', price: 4.5, status: 'publicado', stock: 'En stock', g: ['#ff8c42', '#c0265e'] },
  { id: 'cho-092', name: 'Trufas de Cacao 70%', sku: 'CHO-092', category: 'Chocolates', seller: 'Cacao Fino Ltda.', price: 18.0, status: 'pendiente', stock: 'Bajo', g: ['#7a4a2a', '#3d2414'] },
  { id: 'car-014', name: 'Caramelos de Menta Finos', sku: 'CAR-014', category: 'Caramelos', seller: 'Dulcería El Oasis', price: 6.25, status: 'publicado', stock: 'En stock', g: ['#9bcf6a', '#5e8a2f'] },
  { id: 'mal-007', name: 'Malvaviscos de Fresa', sku: 'MAL-007', category: 'Malvaviscos', seller: 'Nube Dulce', price: 5.0, status: 'publicado', stock: 'Agotado', g: ['#ffd6e4', '#ff8fb6'] },
  { id: 'cho-110', name: 'Bombones Rellenos', sku: 'CHO-110', category: 'Chocolates', seller: 'Cacao Fino Ltda.', price: 22.0, status: 'pendiente', stock: 'En stock', g: ['#a8607d', '#6e3a52'] },
  { id: 'gom-045', name: 'Gusanos de Goma', sku: 'GOM-045', category: 'Gomitas', seller: 'Gomitas Locas SA', price: 3.75, status: 'publicado', stock: 'Bajo', g: ['#c6e86a', '#7aa82f'] },
]
export const adminProducts = cycle(seedAdminProducts, 12, (i, r) => (i < seedAdminProducts.length ? r.id : `${r.id}-${i}`))

const seedAdminCategories = [
  { id: 1, name: 'Chocolates', desc: 'Tabletas, bombones, trufas y derivados de cacao', count: 142 },
  { id: 2, name: 'Gomitas', desc: 'Caramelos de goma, ositos, gusanitos, y opciones', count: 87 },
  { id: 3, name: 'Caramelos Macizos', desc: 'Dulces duros, paletas, mentas y confites tradicionales', count: 56 },
  { id: 4, name: 'Snacks Salados', desc: 'Pretzels, papas fritas, cacahuates y mezclas para botanear', count: 32 },
  { id: 5, name: 'Bebidas', desc: 'Refrescos, jugos, aguas saborizadas y bebidas energéticas', count: 105 },
  { id: 6, name: 'Malvaviscos', desc: 'Nubes, bombones esponjosos y mezclas para chocolate', count: 48 },
  { id: 7, name: 'Galletas', desc: 'Galletas artesanales, sándwich y rellenas', count: 73 },
  { id: 8, name: 'Edición Limitada', desc: 'Colecciones de temporada y ediciones especiales', count: 19 },
]
export const adminCategories = cycle(seedAdminCategories, 12, (i) => i + 1)

// Iconos vectoriales reutilizables (stroke = currentColor salvo indicacion).
// Mantiene una sola fuente de iconos para toda la UI.

const paths = {
  cart: (
    <>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
      <path d="M3 4h2l2.1 11.3a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.5-1.2L20 7H6" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="9" r="3.2" fill="none" strokeWidth="1.8" />
      <path d="M5.5 19.5c1.4-3 3.8-4.5 6.5-4.5s5.1 1.5 6.5 4.5" fill="none" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="12" r="10" fill="none" strokeWidth="1.6" opacity="0" />
    </>
  ),
  userCircle: (
    <>
      <circle cx="12" cy="12" r="9.2" fill="none" strokeWidth="1.6" />
      <circle cx="12" cy="10" r="2.8" fill="none" strokeWidth="1.6" />
      <path d="M6.5 18.4c1.2-2.3 3.2-3.4 5.5-3.4s4.3 1.1 5.5 3.4" fill="none" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" fill="none" strokeWidth="1.8" />
      <path d="M16 16l4.5 4.5" fill="none" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  paw: (
    <>
      <ellipse cx="12" cy="15.5" rx="4.2" ry="3.4" />
      <circle cx="6.5" cy="11" r="1.7" />
      <circle cx="17.5" cy="11" r="1.7" />
      <circle cx="9.3" cy="7.3" r="1.7" />
      <circle cx="14.7" cy="7.3" r="1.7" />
    </>
  ),
  arrowRight: <path d="M5 12h13M13 6l6 6-6 6" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />,
  arrowLeft: <path d="M19 12H6M11 6l-6 6 6 6" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />,
  close: <path d="M6 6l12 12M18 6 6 18" fill="none" strokeWidth="1.9" strokeLinecap="round" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9.2" fill="none" strokeWidth="1.8" />
      <path d="M8 12.3l2.7 2.7L16 9.5" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  minus: <path d="M5 12h14" fill="none" strokeWidth="2" strokeLinecap="round" />,
  plus: <path d="M12 5v14M5 12h14" fill="none" strokeWidth="2" strokeLinecap="round" />,
  star: <path d="M12 3.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.6 9.7l5.8-.8z" />,
  truck: (
    <>
      <rect x="2.5" y="6.5" width="11" height="9" rx="1.4" fill="none" strokeWidth="1.7" />
      <path d="M13.5 9.5h4l3 3v3h-7z" fill="none" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="7" cy="17.5" r="1.7" fill="none" strokeWidth="1.7" />
      <circle cx="17.5" cy="17.5" r="1.7" fill="none" strokeWidth="1.7" />
    </>
  ),
  home: <path d="M4 11l8-6 8 6M6 9.5V19h12V9.5" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
  briefcase: (
    <>
      <rect x="3.5" y="7.5" width="17" height="12" rx="2" fill="none" strokeWidth="1.7" />
      <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" fill="none" strokeWidth="1.7" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" fill="none" strokeWidth="1.7" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" strokeWidth="1.7" />
    </>
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" fill="none" strokeWidth="1.7" />
      <path d="M4 7l8 6 8-6" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  phone: <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 6.2 2 2 0 0 1 6.5 4z" fill="none" strokeWidth="1.7" strokeLinejoin="round" />,
  card: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" fill="none" strokeWidth="1.7" />
      <path d="M3 10h18" fill="none" strokeWidth="1.7" />
    </>
  ),
  bank: (
    <>
      <path d="M4 9.5l8-4.5 8 4.5" fill="none" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M5.5 10v7M9.5 10v7M14.5 10v7M18.5 10v7M3.5 19.5h17" fill="none" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  pencil: <path d="M14.5 5.5l4 4L8 20H4v-4z" fill="none" strokeWidth="1.7" strokeLinejoin="round" />,
  pin: (
    <>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" fill="none" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.3" fill="none" strokeWidth="1.7" />
    </>
  ),
  camera: (
    <>
      <rect x="3.5" y="7.5" width="17" height="12" rx="2.5" fill="none" strokeWidth="1.7" />
      <path d="M8.5 7.5l1.3-2.2h4.4l1.3 2.2" fill="none" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="13.5" r="3.2" fill="none" strokeWidth="1.7" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="15" rx="2.5" fill="none" strokeWidth="1.7" />
      <path d="M4 10h16M8 3.5v4M16 3.5v4" fill="none" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
  bag: (
    <>
      <path d="M6 8h12l-1 12H7z" fill="none" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" fill="none" strokeWidth="1.7" />
    </>
  ),
  dollar: <path d="M12 3v18M16 7c0-1.7-1.8-3-4-3s-4 1.3-4 3 1.8 3 4 3 4 1.3 4 3-1.8 3-4 3-4-1.3-4-3" fill="none" strokeWidth="1.8" strokeLinecap="round" />,
  store: (
    <>
      <path d="M4 9.5h16l-1.2 9.5a1.5 1.5 0 0 1-1.5 1.3H6.7a1.5 1.5 0 0 1-1.5-1.3z" fill="none" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M3 9.5L5 4.5h14l2 5" fill="none" strokeWidth="1.7" strokeLinejoin="round" />
    </>
  ),
  butterfly: (
    <>
      <path d="M12 7v10" fill="none" strokeWidth="1.6" />
      <path d="M12 9c-1.5-3.5-7-4-7 0 0 3.5 4.5 5 7 3" fill="none" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 9c1.5-3.5 7-4 7 0 0 3.5-4.5 5-7 3" fill="none" strokeWidth="1.6" strokeLinejoin="round" />
    </>
  ),
  download: <path d="M12 4v10m0 0l-3.5-3.5M12 14l3.5-3.5M5 18.5h14" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9.2" fill="none" strokeWidth="1.7" />
      <path d="M12 11v5M12 7.6v.1" fill="none" strokeWidth="1.9" strokeLinecap="round" />
    </>
  ),
  question: (
    <>
      <circle cx="12" cy="12" r="9.2" fill="none" strokeWidth="1.6" />
      <path d="M9.5 9.5a2.5 2.5 0 0 1 4.5 1.5c0 1.7-2 2-2 3.5M12 17v.1" fill="none" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 2.5v5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5v-5z" fill="none" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  sparkles: <path d="M12 4l1.4 3.6L17 9l-3.6 1.4L12 14l-1.4-3.6L7 9l3.6-1.4zM18 14l.7 1.8L20.5 16.5l-1.8.7L18 19l-.7-1.8L15.5 16.5l1.8-.7z" />,
  box: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" fill="none" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 7.5l8 4.5 8-4.5M12 12v9" fill="none" strokeWidth="1.6" strokeLinejoin="round" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" fill="none" strokeWidth="1.7" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" fill="none" strokeWidth="1.7" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" fill="none" strokeWidth="1.7" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" fill="none" strokeWidth="1.7" />
    </>
  ),
  inventory: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2" fill="none" strokeWidth="1.7" />
      <path d="M3.5 9.5h17M8 14h8" fill="none" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
  receipt: (
    <>
      <path d="M5 3.5h14v17l-2.3-1.4-2.3 1.4-2.4-1.4L9.6 20.5 7.3 19.1 5 20.5z" fill="none" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8.5 8h7M8.5 11.5h7M8.5 15h4" fill="none" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" fill="none" strokeWidth="1.6" />
      <path d="M12 2.8v2.4M12 18.8v2.4M4.3 7.5l2.1 1.2M17.6 15.3l2.1 1.2M19.7 7.5l-2.1 1.2M6.4 15.3l-2.1 1.2" fill="none" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  sitemap: (
    <>
      <rect x="9" y="3.5" width="6" height="5" rx="1.2" fill="none" strokeWidth="1.6" />
      <rect x="3.5" y="15.5" width="6" height="5" rx="1.2" fill="none" strokeWidth="1.6" />
      <rect x="14.5" y="15.5" width="6" height="5" rx="1.2" fill="none" strokeWidth="1.6" />
      <path d="M12 8.5v3.5M6.5 15.5V13h11v2.5" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3" fill="none" strokeWidth="1.6" />
      <path d="M3.5 19c.9-2.7 2.9-4 5.5-4s4.6 1.3 5.5 4" fill="none" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16 6.2a3 3 0 0 1 0 5.6M17.5 19c-.3-1.7-1-3-2-3.8" fill="none" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  trash: (
    <>
      <path d="M4.5 6.5h15M9.5 6.5V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v1.5" fill="none" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6.5 6.5l.9 12a1.6 1.6 0 0 0 1.6 1.5h6a1.6 1.6 0 0 0 1.6-1.5l.9-12" fill="none" strokeWidth="1.6" strokeLinejoin="round" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" fill="none" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.8" fill="none" strokeWidth="1.6" />
    </>
  ),
  dots: (
    <>
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="9.2" fill="none" strokeWidth="1.7" />
      <path d="M12 7v6M12 16.4v.1" fill="none" strokeWidth="1.9" strokeLinecap="round" />
    </>
  ),
  trendUp: <path d="M3.5 16.5l5-5 3.5 3.5L20 7.5M15.5 7.5H20v4.5" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
  logout: <path d="M14 4.5H7a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 7 19.5h7M16 8l4 4-4 4M9.5 12H20" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
  filter: <path d="M4 5.5h16l-6.5 7.5v5l-3 2v-7z" fill="none" strokeWidth="1.6" strokeLinejoin="round" />,
  sliders: (
    <>
      <path d="M5 6.5h14M5 12h14M5 17.5h14" fill="none" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="9" cy="6.5" r="2" fill="currentColor" /><circle cx="15" cy="12" r="2" fill="currentColor" /><circle cx="8" cy="17.5" r="2" fill="currentColor" />
    </>
  ),
  upload: <path d="M12 16V5m0 0l-4 4m4-4l4 4M5 18.5h14" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
  image: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" fill="none" strokeWidth="1.6" />
      <circle cx="8.5" cy="9.5" r="1.6" fill="none" strokeWidth="1.4" />
      <path d="M4 17l4.5-4.5 3.5 3.5 3-3 5 5" fill="none" strokeWidth="1.6" strokeLinejoin="round" />
    </>
  ),
  printer: (
    <>
      <path d="M7 9V4h10v5" fill="none" strokeWidth="1.6" strokeLinejoin="round" />
      <rect x="4.5" y="9" width="15" height="7" rx="1.5" fill="none" strokeWidth="1.6" />
      <path d="M7 14h10v6H7z" fill="none" strokeWidth="1.6" strokeLinejoin="round" />
    </>
  ),
  refresh: <path d="M19 8a7 7 0 1 0 1.3 5M19 4v4h-4" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
}

function Icon({ name, size = 22, className = '', style, strokeFill = false }) {
  const node = paths[name]
  if (!node) return null
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={strokeFill ? 'none' : 'currentColor'}
      stroke={strokeFill ? 'currentColor' : 'none'}
      aria-hidden="true"
      style={style}
    >
      {node}
    </svg>
  )
}

export default Icon

/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from 'react'

// Hook de paginación local: corta un array y expone los metadatos de la página actual.
// resetKey: cuando cambia (p. ej. al aplicar un filtro) vuelve a la página 1.
export function usePager(items, pageSize, resetKey) {
  const [page, setPage] = useState(1)
  // Reset a la página 1 cuando cambia el filtro (resetKey).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setPage(1) }, [resetKey])
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const current = Math.min(page, totalPages)
  const start = (current - 1) * pageSize
  const slice = items.slice(start, start + pageSize)
  return {
    page: current,
    setPage,
    total,
    totalPages,
    slice,
    from: total === 0 ? 0 : start + 1,
    to: Math.min(start + pageSize, total),
  }
}

// Lista de páginas a mostrar con elipsis cuando hay muchas.
function buildPages(page, total) {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1)
  const out = []
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || Math.abs(p - page) <= 1) out.push(p)
    else if (out[out.length - 1] !== '…') out.push('…')
  }
  return out
}

// Control de paginación. variant: "numbered" (‹ 1 2 3 ›) | "mini" (Anterior / Siguiente).
function Pagination({ page, totalPages, onChange, variant = 'numbered' }) {
  if (totalPages <= 1) return null
  const go = (p) => onChange(Math.max(1, Math.min(totalPages, p)))

  if (variant === 'mini') {
    return (
      <div className="mini-pager">
        <button disabled={page === 1} onClick={() => go(page - 1)}>Anterior</button>
        <button disabled={page === totalPages} onClick={() => go(page + 1)}>Siguiente</button>
      </div>
    )
  }

  return (
    <div className="pagination">
      <button className="pagination__item" disabled={page === 1} onClick={() => go(page - 1)} aria-label="Anterior">‹</button>
      {buildPages(page, totalPages).map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="pagination__ellipsis">…</span>
        ) : (
          <button
            key={p}
            className={`pagination__item${p === page ? ' is-active' : ''}`}
            onClick={() => go(p)}
          >
            {p}
          </button>
        ),
      )}
      <button className="pagination__item" disabled={page === totalPages} onClick={() => go(page + 1)} aria-label="Siguiente">›</button>
    </div>
  )
}

export default Pagination

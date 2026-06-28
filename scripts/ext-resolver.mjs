// Hook de resolución para Node: permite imports sin extensión (como hace Vite),
// probando .js / .jsx / /index.js cuando el specifier relativo no resuelve tal cual.
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export async function resolve(specifier, context, next) {
  try {
    return await next(specifier, context)
  } catch (err) {
    if (specifier.startsWith('./') || specifier.startsWith('../')) {
      const base = new URL(specifier, context.parentURL)
      for (const ext of ['.js', '.jsx', '/index.js']) {
        if (existsSync(fileURLToPath(new URL(base.href + ext)))) {
          return next(specifier + ext, context)
        }
      }
    }
    throw err
  }
}

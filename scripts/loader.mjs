// Registra el hook de resolución de extensiones antes de cargar el script de verificación.
import { register } from 'node:module'
register('./ext-resolver.mjs', import.meta.url)

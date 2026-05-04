/** Relative paths work with the Vite dev proxy to the API (`npm run server`). */
export function apiPath(path) {
  const base = import.meta.env.VITE_API_BASE || ''
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

export function isBackendApiEnabled() {
  return import.meta.env.VITE_USE_BACKEND === 'true'
}

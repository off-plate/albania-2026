// Resolve a stored asset path against the app's base URL (/albania-2026/).
// Absolute URLs pass through unchanged.
export function asset(path: string | null | undefined): string | undefined {
  if (!path) return undefined
  if (/^https?:\/\//.test(path)) return path
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}

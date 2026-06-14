/**
 * resolveMediaUrl — Reusable URL resolver for 4K Production media.
 *
 * Supports three path formats stored in MongoDB:
 *   1. Cloudinary URL  — https://res.cloudinary.com/…   → returned as-is
 *   2. Any other full URL (http/https)                  → returned as-is
 *   3. Legacy local path — /uploads/events/file.jpg     → prefixed with backend base URL
 *
 * Usage:
 *   import { resolveMediaUrl } from '@/utils/resolveMediaUrl'
 *   const src = resolveMediaUrl(item.media_url)
 */
export function resolveMediaUrl(url) {
  if (!url) return ''

  // Already a fully-qualified URL (Cloudinary, CDN, or external)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // Legacy local path — prepend the backend base URL so the request hits
  // the /uploads static handler still present for backward compatibility.
  // VITE_API_URL is typically "https://yourbackend.onrender.com/api";
  // strip the trailing "/api" to get the server root.
  const apiUrl = import.meta.env.VITE_API_URL || ''
  const base   = apiUrl.endsWith('/api')
    ? apiUrl.slice(0, -4)
    : apiUrl

  return `${base}${url.startsWith('/') ? '' : '/'}${url}`
}

export default resolveMediaUrl

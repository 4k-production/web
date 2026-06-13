/**
 * 4K Production — Admin API Service
 * Supports browser (Vite env) and Electron (window.electronConfig)
 */
import axios from 'axios'

// ─── Electron detection ───────────────────────
// navigator.userAgent is the most reliable — set by Electron itself
// before any JS runs, regardless of preload/contextBridge
const isElectron = typeof navigator !== 'undefined'
  && navigator.userAgent.toLowerCase().includes('electron')

// ─── Resolve base URL ─────────────────────────
function resolveApiBase() {
  // Priority 1: Electron with config loaded via preload
  if (isElectron && typeof window !== 'undefined' && window.electronConfig?.apiUrl) {
    const url = window.electronConfig.apiUrl
    console.log('[AdminAPI] Using Electron config URL:', url)
    return `${url}/api`
  }

  // Priority 2: Running in Electron but preload config not ready yet
  // (fallback to hardcoded localhost — never use relative /api in Electron)
  if (isElectron) {
    console.warn('[AdminAPI] Electron detected but electronConfig not available, using localhost fallback')
    return 'https://fourk-production.onrender.com/api'
  }

  // Priority 3: Browser — use Vite env var or dev proxy
  return import.meta.env.VITE_API_URL || '/api'
}

const apiBase = resolveApiBase()

// ─── Axios Instance ───────────────────────────
const adminApi = axios.create({
  baseURL:         apiBase,
  timeout:         15000,
  headers:         { 'Content-Type': 'application/json' },
  withCredentials: true
})

// ─── Token Storage ─────────────────────────────
// JWT is stored in localStorage and sent via Authorization header.
// This avoids relying on cross-site cookies (Vercel frontend ↔ Render
// backend), which modern browsers increasingly block by default.
const TOKEN_KEY = '4k_admin_token'

export function getAdminToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setAdminToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore storage errors (e.g. disabled in some webviews) */
  }
}

// ─── Request Interceptor ──────────────────────
adminApi.interceptors.request.use(config => {
  const token = getAdminToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Response Interceptor ─────────────────────
adminApi.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      // Token is missing/invalid/expired — clear it so the login page
      // doesn't keep trying to use it.
      setAdminToken(null)
      // Use Vue Router for the redirect so there is no full-page reload.
      // Dynamic import avoids a circular dependency with the router module.
      import('@/router/index.js').then(({ default: router }) => {
        if (router.currentRoute.value.name !== 'AdminLogin') {
          router.push('/admin/login')
        }
      })
    }
    const message = error.response?.data?.message || error.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

// =============================================
// Auth
// =============================================
export const authApi = {
  login: async (data) => {
    const res = await adminApi.post('/admin/login', data)
    if (res?.token) setAdminToken(res.token)
    return res
  },
  logout: async () => {
    setAdminToken(null)
    try {
      return await adminApi.post('/admin/logout')
    } catch {
      // Even if the server call fails, the local token is already cleared.
      return { success: true }
    }
  },
  me: () => adminApi.get('/admin/me')
}

// =============================================
// Dashboard
// =============================================
export const dashboardApi = {
  getStats: () => adminApi.get('/admin/dashboard')
}

// =============================================
// File Upload
// =============================================
export const uploadApi = {
  uploadFile: (file, uploadType = 'portfolio') => {
    const formData = new FormData()
    formData.append('file', file)
    // Pass upload_type as a query param so Multer's destination callback can
    // read it from req.query (req.body is not yet parsed when destination runs)
    return axios.post(`${apiBase}/upload?upload_type=${uploadType}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(getAdminToken() ? { Authorization: `Bearer ${getAdminToken()}` } : {})
      },
      withCredentials: true,
      timeout: 60000
    }).then(res => res.data)
  },
  uploadMultiple: (files, uploadType = 'events') => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    // Pass upload_type as a query param so Multer's destination callback can
    // read it from req.query (req.body is not yet parsed when destination runs)
    return axios.post(`${apiBase}/upload/multiple?upload_type=${uploadType}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(getAdminToken() ? { Authorization: `Bearer ${getAdminToken()}` } : {})
      },
      withCredentials: true,
      timeout: 60000
    }).then(res => res.data)
  }
}

// =============================================
// Announcements
// =============================================
export const adminAnnouncementsApi = {
  getAll:    ()         => adminApi.get('/admin/announcements'),
  getById:   (id)       => adminApi.get(`/announcements/${id}`),
  create:    (data)     => adminApi.post('/announcements', data),
  update:    (id, data) => adminApi.put(`/announcements/${id}`, data),
  delete:    (id)       => adminApi.delete(`/announcements/${id}`),
  publish:   (id)       => adminApi.put(`/announcements/${id}/publish`),
  unpublish: (id)       => adminApi.put(`/announcements/${id}/unpublish`)
}

// =============================================
// Contact Messages
// =============================================
export const adminMessagesApi = {
  getAll:   (status) => adminApi.get('/contact', { params: status ? { status } : {} }),
  getById:  (id)     => adminApi.get(`/contact/${id}`),
  markRead: (id)     => adminApi.put(`/contact/${id}/read`),
  delete:   (id)     => adminApi.delete(`/contact/${id}`)
}

// =============================================
// Service Requests
// =============================================
export const adminRequestsApi = {
  getAll:       (status)     => adminApi.get('/requests', { params: status ? { status } : {} }),
  getById:      (id)         => adminApi.get(`/requests/${id}`),
  updateStatus: (id, status) => adminApi.put(`/requests/${id}/status`, { status }),
  delete:       (id)         => adminApi.delete(`/requests/${id}`)
}

// =============================================
// Portfolio
// =============================================
export const adminPortfolioApi = {
  getAll:  ()         => adminApi.get('/portfolio'),
  getById: (id)       => adminApi.get(`/portfolio/${id}`),
  create:  (data)     => adminApi.post('/portfolio', data),
  update:  (id, data) => adminApi.put(`/portfolio/${id}`, data),
  delete:  (id)       => adminApi.delete(`/portfolio/${id}`)
}

// =============================================
// Events
// =============================================
export const adminEventsApi = {
  getAll:  ()         => adminApi.get('/events'),
  getById: (id)       => adminApi.get(`/events/${id}`),
  create:  (data)     => adminApi.post('/events', data),
  update:  (id, data) => adminApi.put(`/events/${id}`, data),
  delete:  (id)       => adminApi.delete(`/events/${id}`)
}

export default adminApi

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
    return 'https://4k-production.onrender.com/api'
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

// ─── Response Interceptor ─────────────────────
adminApi.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      if (isElectron) {
        window.location.hash = '#/admin/login'
      } else {
        window.location.href = '/admin/login'
      }
    }
    const message = error.response?.data?.message || error.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

// =============================================
// Auth
// =============================================
export const authApi = {
  login:  (data) => adminApi.post('/admin/login', data),
  logout: ()     => adminApi.post('/admin/logout'),
  me:     ()     => adminApi.get('/admin/me')
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
      headers: { 'Content-Type': 'multipart/form-data' },
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
      headers: { 'Content-Type': 'multipart/form-data' },
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

/**
 * 4K Production — api.js
 * Public website API — supports browser and Electron
 */
import axios from 'axios'

// ─── Electron detection ───────────────────────
const isElectron = typeof navigator !== 'undefined'
  && navigator.userAgent.toLowerCase().includes('electron')

// ─── Resolve base URL ─────────────────────────
function resolveApiBase() {
  if (isElectron && typeof window !== 'undefined' && window.electronConfig?.apiUrl) {
    return `${window.electronConfig.apiUrl}/api`
  }
  // Fallback for Electron without config — never use relative path on file://
  if (isElectron) {
    return 'http://localhost:5000/api'
  }
  return import.meta.env.VITE_API_URL || '/api'
}

const apiBase = resolveApiBase()

// ─── Axios Instance ───────────────────────────
const api = axios.create({
  baseURL:         apiBase,
  timeout:         10000,
  headers:         { 'Content-Type': 'application/json' },
  withCredentials: true
})

// ─── Response Interceptor ─────────────────────
api.interceptors.response.use(
  response => response.data,
  error => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred'
    return Promise.reject(new Error(message))
  }
)

export const announcementsApi = {
  getAll:      ()     => api.get('/announcements'),
  getFeatured: ()     => api.get('/announcements/featured'),
  getById:     (id)   => api.get(`/announcements/${id}`),
  create:      (data) => api.post('/announcements', data),
  delete:      (id)   => api.delete(`/announcements/${id}`)
}

export const portfolioApi = {
  getAll: (category = null) => {
    const params = category && category !== 'All' ? { category } : {}
    return api.get('/portfolio', { params })
  },
  getCategories: ()        => api.get('/portfolio/categories'),
  getById:       (id)      => api.get(`/portfolio/${id}`),
  create:        (data)    => api.post('/portfolio', data),
  delete:        (id)      => api.delete(`/portfolio/${id}`)
}

export const requestsApi = {
  getAll:       ()           => api.get('/requests'),
  getById:      (id)         => api.get(`/requests/${id}`),
  create:       (data)       => api.post('/requests', data),
  updateStatus: (id, status) => api.put(`/requests/${id}/status`, { status })
}

export const contactApi = {
  send:   (data) => api.post('/contact', data),
  getAll: ()     => api.get('/contact')
}

export const eventsApi = {
  getAll:  ()   => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`)
}

export const statsApi = {
  getPublicStats: () => api.get('/stats')
}

export default api
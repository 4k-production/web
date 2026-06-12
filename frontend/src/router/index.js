/**
 * 4K Production — router/index.js
 * Vue Router configuration — public site + Admin CMS
 */
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

// ─── Reliable Electron detection ──────────────
// navigator.userAgent always contains 'Electron' when inside Electron,
// regardless of preload.js or contextBridge — works before anything else runs
const isElectron = typeof navigator !== 'undefined'
  && navigator.userAgent.toLowerCase().includes('electron')

// ─── Public pages (lazy-loaded) ───────────────
const Home           = () => import('@/pages/Home.vue')
const Services       = () => import('@/pages/Services.vue')
const Portfolio      = () => import('@/pages/Portfolio.vue')
const About          = () => import('@/pages/About.vue')
const Announcements  = () => import('@/pages/Announcements.vue')
const Contact        = () => import('@/pages/Contact.vue')
const RequestService = () => import('@/pages/RequestService.vue')
const Events         = () => import('@/pages/Events.vue')
const EventDetails   = () => import('@/pages/EventDetails.vue')
const NotFound       = () => import('@/pages/NotFound.vue')

// ─── Admin pages (lazy-loaded) ────────────────
const AdminLogin         = () => import('@/admin/pages/AdminLogin.vue')
const AdminLayout        = () => import('@/admin/AdminLayout.vue')
const AdminDashboard     = () => import('@/admin/pages/AdminDashboard.vue')
const AdminAnnouncements = () => import('@/admin/pages/AdminAnnouncements.vue')
const AdminMessages      = () => import('@/admin/pages/AdminMessages.vue')
const AdminRequests      = () => import('@/admin/pages/AdminRequests.vue')
const AdminPortfolio     = () => import('@/admin/pages/AdminPortfolio.vue')
const AdminEvents        = () => import('@/admin/pages/AdminEvents.vue')
const AdminSettings      = () => import('@/admin/pages/AdminSettings.vue')

// ─── Auth guard ───────────────────────────────
async function requireAuth(_to, _from, next) {
  try {
    const { authApi } = await import('@/admin/services/adminApi.js')
    await authApi.me()
    next()
  } catch {
    next('/admin/login')
  }
}

const routes = [
  // ── Public ──────────────────────────────────
  { path: '/',              name: 'Home',           component: Home,           meta: { title: '4K Production | Premier Multimedia Services' } },
  { path: '/services',      name: 'Services',       component: Services,       meta: { title: 'Our Services | 4K Production' } },
  { path: '/portfolio',     name: 'Portfolio',      component: Portfolio,      meta: { title: 'Portfolio | 4K Production' } },
  { path: '/about',         name: 'About',          component: About,          meta: { title: 'About Us | 4K Production' } },
  { path: '/announcements', name: 'Announcements',  component: Announcements,  meta: { title: 'Announcements | 4K Production' } },
  { path: '/contact',       name: 'Contact',        component: Contact,        meta: { title: 'Contact Us | 4K Production' } },
  { path: '/request',       name: 'RequestService', component: RequestService, meta: { title: 'Request a Service | 4K Production' } },
  { path: '/events',        name: 'Events',         component: Events,         meta: { title: 'Events Room | 4K Production' } },
  { path: '/events/:idOrSlug', name: 'EventDetails', component: EventDetails, meta: { title: 'Event Details | 4K Production' } },

  // ── Admin login (standalone) ─────────────────
  {
    path:      '/admin/login',
    name:      'AdminLogin',
    component: AdminLogin,
    meta:      { title: 'Admin Login | 4K Production Admin', isAdmin: true }
  },

  // ── Admin shell (guarded) ────────────────────
  {
    path:        '/admin',
    component:   AdminLayout,
    beforeEnter: requireAuth,
    meta:        { isAdmin: true },
    children: [
      { path: '',              name: 'AdminDashboard',     component: AdminDashboard,     meta: { title: 'Dashboard | 4K Admin',          isAdmin: true } },
      { path: 'announcements', name: 'AdminAnnouncements', component: AdminAnnouncements, meta: { title: 'Announcements | 4K Admin',      isAdmin: true } },
      { path: 'messages',      name: 'AdminMessages',      component: AdminMessages,      meta: { title: 'Messages | 4K Admin',           isAdmin: true } },
      { path: 'requests',      name: 'AdminRequests',      component: AdminRequests,      meta: { title: 'Service Requests | 4K Admin',   isAdmin: true } },
      { path: 'portfolio',     name: 'AdminPortfolio',     component: AdminPortfolio,     meta: { title: 'Portfolio | 4K Admin',          isAdmin: true } },
      { path: 'events',        name: 'AdminEvents',        component: AdminEvents,        meta: { title: 'Events Room | 4K Admin',        isAdmin: true } },
      { path: 'settings',      name: 'AdminSettings',      component: AdminSettings,      meta: { title: 'Settings | 4K Admin',           isAdmin: true } },
    ]
  },

  // ── 404 ─────────────────────────────────────
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, meta: { title: 'Page Not Found | 4K Production' } }
]

const router = createRouter({
  // HashHistory for Electron — file:// protocol needs hash-based routing
  // WebHistory for the browser — clean URLs work fine
  history: isElectron ? createWebHashHistory() : createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

// ── Global guard: redirect to admin in Electron ──
router.beforeEach((to, _from, next) => {
  // In Electron the app is admin-only
  // Any navigation to the root "/" redirects straight to admin login
  if (isElectron && to.path === '/') {
    return next({ name: 'AdminLogin', replace: true })
  }
  next()
})

router.afterEach((to) => {
  document.title = to.meta?.title || '4K Production'
})

export default router
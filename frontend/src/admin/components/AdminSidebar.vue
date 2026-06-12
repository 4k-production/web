<template>
  <aside class="adm-sidebar" :class="{ 'adm-sidebar-open': isOpen }">
    <!-- Logo -->
    <div class="adm-sidebar-logo">
      <router-link to="/" class="adm-logo-link" title="Back to website">
        <div class="adm-logo-icon">
          <svg viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="9" fill="url(#sg)"/>
            <text x="18" y="24" text-anchor="middle" font-family="Syne,sans-serif" font-weight="800" font-size="14" fill="white">4K</text>
            <defs><linearGradient id="sg" x1="0" y1="0" x2="36" y2="36"><stop stop-color="#8b5cf6"/><stop offset="1" stop-color="#06b6d4"/></linearGradient></defs>
          </svg>
        </div>
        <div class="adm-logo-text">
          <span class="adm-logo-brand">4K Production</span>
          <span class="adm-logo-sub">Admin Panel</span>
        </div>
      </router-link>
    </div>

    <!-- Nav -->
    <nav class="adm-sidebar-nav">
      <div class="adm-nav-section">
        <span class="adm-nav-section-label">Overview</span>
        <router-link to="/admin" exact-active-class="adm-nav-active" class="adm-nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>
          </svg>
          <span>Dashboard</span>
        </router-link>
      </div>

      <div class="adm-nav-section">
        <span class="adm-nav-section-label">Content</span>
        <router-link to="/admin/announcements" active-class="adm-nav-active" class="adm-nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535"/>
          </svg>
          <span>Announcements</span>
          <span v-if="counts.total_announcements" class="adm-nav-badge">{{ counts.total_announcements }}</span>
        </router-link>

        <router-link to="/admin/portfolio" active-class="adm-nav-active" class="adm-nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
          </svg>
          <span>Portfolio</span>
        </router-link>

        <router-link to="/admin/events" active-class="adm-nav-active" class="adm-nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <span>Events Room</span>
        </router-link>
      </div>

      <div class="adm-nav-section">
        <span class="adm-nav-section-label">Inbox</span>
        <router-link to="/admin/messages" active-class="adm-nav-active" class="adm-nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
          </svg>
          <span>Messages</span>
          <span v-if="counts.unread_messages" class="adm-nav-badge adm-badge-alert">{{ counts.unread_messages }}</span>
        </router-link>

        <router-link to="/admin/requests" active-class="adm-nav-active" class="adm-nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
          </svg>
          <span>Service Requests</span>
          <span v-if="counts.pending_requests" class="adm-nav-badge adm-badge-warn">{{ counts.pending_requests }}</span>
        </router-link>
      </div>

      <div class="adm-nav-section">
        <span class="adm-nav-section-label">System</span>
        <router-link to="/admin/settings" active-class="adm-nav-active" class="adm-nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span>Settings</span>
        </router-link>
      </div>
    </nav>

    <!-- Footer -->
    <div class="adm-sidebar-footer">
      <a href="/" target="_blank" class="adm-sidebar-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
        </svg>
        View Website
      </a>
      <button class="adm-sidebar-logout" @click="handleLogout">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/>
        </svg>
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { authApi }   from '../services/adminApi.js'

defineProps({
  isOpen: { type: Boolean, default: false },
  counts: { type: Object,  default: () => ({}) },
  theme:  { type: String,  default: 'dark' }
})

const router = useRouter()

async function handleLogout() {
  try {
    await authApi.logout()
  } catch(e) {
    // ignore errors — still redirect to login
  } finally {
    const isElectron = typeof navigator !== 'undefined'
      && navigator.userAgent.toLowerCase().includes('electron')

    if (isElectron) {
      // Hash routing in Electron
      window.location.hash = '#/admin/login'
    } else {
      router.push('/admin/login')
    }
  }
}
</script>

<style scoped>
.adm-sidebar {
  width: 260px; min-height: 100vh;
  background: var(--adm-sidebar);
  border-right: 1px solid var(--adm-border);
  backdrop-filter: blur(24px);
  display: flex; flex-direction: column;
  position: fixed; top: 0; left: 0; bottom: 0; z-index: 100;
  overflow-y: auto;
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), background 0.35s, border-color 0.35s;
}

/* Logo */
.adm-sidebar-logo {
  padding: 22px 20px 8px;
  border-bottom: 1px solid var(--adm-border);
}
.adm-logo-link { display: flex; align-items: center; gap: 12px; text-decoration: none; }
.adm-logo-icon svg { width: 36px; height: 36px; border-radius: 9px; }
.adm-logo-text { display: flex; flex-direction: column; line-height: 1.25; }
.adm-logo-brand { font-family: 'Syne',sans-serif; font-weight: 800; font-size: 0.9rem; color: var(--adm-text); }
.adm-logo-sub   { font-size: 0.68rem; color: var(--adm-text4); font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }

/* Nav */
.adm-sidebar-nav { flex: 1; padding: 14px 12px; display: flex; flex-direction: column; gap: 6px; }
.adm-nav-section { display: flex; flex-direction: column; gap: 2px; margin-bottom: 6px; }
.adm-nav-section-label {
  font-size: 0.64rem; font-weight: 700; letter-spacing: 0.13em; text-transform: uppercase;
  color: var(--adm-text4); padding: 5px 12px 3px;
}
.adm-nav-item {
  display: flex; align-items: center; gap: 11px; padding: 10px 12px; border-radius: 12px;
  color: var(--adm-text3); text-decoration: none; font-size: 0.875rem; font-weight: 500;
  transition: all 0.2s; position: relative;
}
.adm-nav-item svg { width: 17px; height: 17px; flex-shrink: 0; }
.adm-nav-item span:first-of-type { flex: 1; }
.adm-nav-item:hover { background: var(--adm-hover); color: var(--adm-text2); }

.adm-nav-active {
  background: rgba(139,92,246,0.12) !important;
  border: 1px solid rgba(139,92,246,0.22);
  color: #a78bfa !important;
}
.adm-nav-active svg { color: #8b5cf6; }

.adm-nav-badge {
  padding: 2px 7px; border-radius: 9999px; font-size: 0.68rem; font-weight: 700;
  background: rgba(139,92,246,0.18); color: #a78bfa; border: 1px solid rgba(139,92,246,0.28);
}
.adm-badge-alert { background: rgba(239,68,68,0.14); color: #f87171; border-color: rgba(239,68,68,0.28); }
.adm-badge-warn  { background: rgba(251,191,36,0.14); color: #fbbf24; border-color: rgba(251,191,36,0.28); }

/* Footer */
.adm-sidebar-footer {
  padding: 14px 12px 22px;
  border-top: 1px solid var(--adm-border);
  display: flex; flex-direction: column; gap: 2px;
}
.adm-sidebar-link, .adm-sidebar-logout {
  display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 10px;
  font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: all 0.2s;
  text-decoration: none; border: none; background: transparent; font-family: inherit;
}
.adm-sidebar-link   { color: var(--adm-text3); }
.adm-sidebar-link:hover { background: var(--adm-hover); color: var(--adm-text2); }
.adm-sidebar-logout { color: var(--adm-text3); }
.adm-sidebar-logout:hover { background: rgba(239,68,68,0.1); color: #f87171; }

/* Responsive */
@media (max-width: 1024px) {
  .adm-sidebar { transform: translateX(-100%); }
  .adm-sidebar.adm-sidebar-open { transform: translateX(0); }
}
</style>

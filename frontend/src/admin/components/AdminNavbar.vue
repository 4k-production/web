<template>
  <header class="adm-navbar">
    <div class="adm-navbar-left">
      <button class="adm-menu-toggle" @click="$emit('toggle-sidebar')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
        </svg>
      </button>
      <div class="adm-breadcrumb">
        <span class="adm-breadcrumb-root">Admin</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
        </svg>
        <span class="adm-breadcrumb-current">{{ currentPage }}</span>
      </div>
    </div>

    <div class="adm-navbar-right">
      <!-- Unread badge -->
      <div class="adm-nav-stat" v-if="unreadCount > 0">
        <span class="adm-stat-dot"></span>
        <span>{{ unreadCount }} unread</span>
      </div>

      <!-- Theme toggle -->
      <button class="adm-theme-toggle" @click="$emit('toggle-theme')" :title="theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
        <!-- Sun icon (shown in dark mode to switch TO light) -->
        <svg v-if="theme === 'dark'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/>
        </svg>
        <!-- Moon icon (shown in light mode to switch TO dark) -->
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>
        </svg>
      </button>

      <!-- User -->
      <div class="adm-user">
        <div class="adm-user-avatar">A</div>
        <span class="adm-user-name">Administrator</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineProps({
  unreadCount: { type: Number,  default: 0 },
  theme:       { type: String,  default: 'dark' }
})
defineEmits(['toggle-sidebar', 'toggle-theme'])

const route       = useRoute()
const currentPage = computed(() => {
  const map = {
    '/admin':               'Dashboard',
    '/admin/announcements': 'Announcements',
    '/admin/portfolio':     'Portfolio',
    '/admin/messages':      'Messages',
    '/admin/requests':      'Service Requests',
    '/admin/settings':      'Settings',
  }
  return map[route.path] || 'Dashboard'
})
</script>

<style scoped>
.adm-navbar {
  height: 75px;
  background: var(--adm-navbar);
  border-bottom: 1px solid var(--adm-border);
  backdrop-filter: blur(20px);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px;
  position: fixed;
  top: 0;
  left: 260px;
  right: 0;
  z-index: 50;
  transition: background 0.35s, border-color 0.35s, left 0.3s;
}

@media (max-width: 1024px) {
  .adm-navbar {
    left: 0;
  }
}



.adm-navbar-left  { display: flex; align-items: center; gap: 16px; }
.adm-navbar-right { display: flex; align-items: center; gap: 12px; }

.adm-menu-toggle {
  display: none; align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: 10px;
  background: var(--adm-surface); border: 1px solid var(--adm-border);
  color: var(--adm-text3); cursor: pointer; transition: all 0.2s;
}
.adm-menu-toggle svg { width: 20px; height: 20px; }
.adm-menu-toggle:hover { background: var(--adm-hover); color: var(--adm-text); }

.adm-breadcrumb { display: flex; align-items: center; gap: 6px; }
.adm-breadcrumb-root    { color: var(--adm-text3); font-size: 0.85rem; }
.adm-breadcrumb-current { color: var(--adm-text);  font-size: 0.875rem; font-weight: 600; }

.adm-nav-stat {
  display: flex; align-items: center; gap: 6px;
  padding: 5px 12px; border-radius: 9999px;
  background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.22);
  color: #a78bfa; font-size: 0.78rem; font-weight: 600;
}
.adm-stat-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #a78bfa; box-shadow: 0 0 6px #a78bfa;
  animation: adm-pulse 2s infinite;
}
@keyframes adm-pulse { 0%,100%{opacity:1;} 50%{opacity:0.35;} }

/* Theme toggle button */
.adm-theme-toggle {
  width: 36px; height: 36px; border-radius: 10px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  background: var(--adm-surface); border: 1px solid var(--adm-border);
  color: var(--adm-text3); transition: all 0.2s;
}
.adm-theme-toggle svg { width: 18px; height: 18px; }
.adm-theme-toggle:hover {
  background: rgba(139,92,246,0.12);
  border-color: rgba(139,92,246,0.3);
  color: #a78bfa;
}

.adm-user        { display: flex; align-items: center; gap: 10px; }
.adm-user-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: linear-gradient(135deg,#8b5cf6,#06b6d4);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.875rem; color: #fff; flex-shrink: 0;
}
.adm-user-name { font-size: 0.85rem; font-weight: 600; color: var(--adm-text2); }

@media (max-width: 1024px) {
  .adm-menu-toggle { display: flex; }
  .adm-user-name   { display: none; }
}
@media (max-width: 640px) {
  .adm-nav-stat { display: none; }
  .adm-breadcrumb-root { display: none; }
}
</style>

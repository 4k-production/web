<template>
  <div class="admin-layout" :data-theme="adminTheme">
    <!-- Background orbs (adapt to theme) -->
    <div class="adm-orb adm-orb-1"></div>
    <div class="adm-orb adm-orb-2"></div>

    <!-- Mobile overlay -->
    <div v-if="sidebarOpen" class="adm-sidebar-overlay" @click="sidebarOpen = false"></div>

    <AdminSidebar :is-open="sidebarOpen" :counts="counts" :theme="adminTheme" />

    <div class="adm-content">
      <AdminNavbar
        :unread-count="counts.unread_messages || 0"
        :theme="adminTheme"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
        @toggle-theme="toggleTheme"
      />
      <main class="adm-main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'
import AdminSidebar from './components/AdminSidebar.vue'
import AdminNavbar  from './components/AdminNavbar.vue'
import { dashboardApi } from './services/adminApi.js'

// ── Theme ──────────────────────────────────────
const adminTheme = ref('dark')

function toggleTheme() {
  adminTheme.value = adminTheme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('4kp-theme', adminTheme.value)
  // Also set on documentElement so Teleport'd modals & global CSS vars respond
  document.documentElement.setAttribute('data-theme', adminTheme.value)
}

// ── Sidebar ────────────────────────────────────
const sidebarOpen = ref(false)

// ── Stats ──────────────────────────────────────
const counts = ref({
  total_requests:      0,
  pending_requests:    0,
  total_messages:      0,
  unread_messages:     0,
  total_announcements: 0,
  total_portfolio:     0
})

async function refreshCounts() {
  try {
    const res    = await dashboardApi.getStats()
    counts.value = res.data.stats
  } catch(e) {}
}

provide('refreshCounts', refreshCounts)
provide('adminTheme',    adminTheme)

onMounted(() => {
  // Sync theme with public site preference
  const saved = localStorage.getItem('4kp-theme')
  if (saved === 'light' || saved === 'dark') adminTheme.value = saved
  // Sync documentElement so global CSS vars are correct
  document.documentElement.setAttribute('data-theme', adminTheme.value)
  refreshCounts()
})
</script>

<style>
/* Import admin shared CSS here — it's all scoped under .admin-layout */
@import './admin-shared.css';
</style>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--adm-bg);
  position: relative;
  overflow-x: hidden;
  transition: background 0.35s ease, color 0.35s ease;
}

/* Ambient glow orbs */
.adm-orb {
  position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
  filter: blur(120px); opacity: 0.1; transition: opacity 0.4s;
}
.adm-orb-1 { width: 500px; height: 500px; background: #8b5cf6; top: -150px; left: -150px; }
.adm-orb-2 { width: 400px; height: 400px; background: #06b6d4; bottom: -100px; right: -100px; }
.admin-layout[data-theme="light"] .adm-orb { opacity: 0.06; }

.adm-sidebar-overlay {
  position: fixed; inset: 0; z-index: 99;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(4px);
}

.adm-content {
  flex: 1; margin-left: 260px; min-width: 0;
  display: flex; flex-direction: column;
  position: relative; z-index: 1;
}

.adm-main { flex: 1; padding: 28px; padding-top: calc(75px + 28px); max-width: 100%; }

@media (max-width: 1024px) { .adm-content { margin-left: 0; } }
@media (max-width: 640px)  { .adm-main  { padding: 16px; } }
</style>

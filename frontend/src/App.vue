<template>
  <div :data-theme="theme" class="app-root">

    <!-- Public site layout — hidden for admin routes -->
    <template v-if="!isAdminRoute">
      <TopBar />
      <Navbar :theme="theme" @toggle-theme="toggleTheme" />

      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>

      <Footer />
      <FloatingButtons />
      <ScrollToTop />
      <AnnouncementPopup />
    </template>

    <!-- Admin routes render their own layout -->
    <template v-else>
      <router-view />
    </template>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, provide } from 'vue'
import { useRoute } from 'vue-router'
import TopBar            from '@/components/TopBar.vue'
import Navbar            from '@/components/Navbar.vue'
import Footer            from '@/components/Footer.vue'
import FloatingButtons   from '@/components/FloatingButtons.vue'
import ScrollToTop       from '@/components/ScrollToTop.vue'
import AnnouncementPopup from '@/components/AnnouncementPopup.vue'

const route = useRoute()

// ─── Detect admin route ───────────────────────
// Works with both WebHistory (/admin/...) and HashHistory (#/admin/...)
// route.path always gives the clean path without # regardless of history mode
const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin') || route.meta?.isAdmin === true
})

// ─── Theme management ─────────────────────────
const theme = ref('dark')

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('4kp-theme', theme.value)
  document.documentElement.setAttribute('data-theme', theme.value)
}

provide('theme', theme)

onMounted(() => {
  const saved = localStorage.getItem('4kp-theme')
  if (saved === 'light' || saved === 'dark') {
    theme.value = saved
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    theme.value = 'light'
  }
  document.documentElement.setAttribute('data-theme', theme.value)
})
</script>

<style>
.app-root {
  display:        flex;
  flex-direction: column;
  min-height:     100vh;
  position:       relative;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}
.page-enter-from { opacity: 0; transform: translateY(10px); }
.page-leave-to   { opacity: 0; transform: translateY(-6px); }
</style>